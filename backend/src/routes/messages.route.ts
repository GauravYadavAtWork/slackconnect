// ./route/messages.route.ts

import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import ScheduledMessage from '../models/scheduledmessages.models';
import { WebClient } from '@slack/web-api';
const { DateTime } = require("luxon");

const router = express.Router();

// Extend Request interface to include slackUser
interface SlackRequest extends Request {
  slackUser?: {
    access_token: string;
  };
}

router.post('/instantmessage', authMiddleware,  async (req: SlackRequest, res: Response) => {
  console.log("Logging body of instant message:" ,req.body);
  const { teamId, channel, text } = req.body;

  if (!teamId || !channel || !text) {
    return res.status(400).json({ error: 'Team ID, channel, and text are required' });
  }

  if (!req.slackUser || !req.slackUser.access_token) {
    return res.status(401).json({ error: 'Missing access token in slackUser' });
  }

  const web = new WebClient(req.slackUser.access_token);

  try {
    await web.conversations.join({ channel });

    const result = await web.chat.postMessage({
      channel,
      text,
    });

    return res.status(200).json({
      message: 'Message sent successfully',
      data: {
        ok: result.ok,
        channel: result.channel,
        ts: result.ts,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});


router.post('/scheduled', authMiddleware, async (req: SlackRequest, res: Response) => {
  console.log("Logging body of scheduled message:", req.body);

  const { teamId, channel, text, schedule_time } = req.body;
  const authed_user = req.query.authed_user as string;

  console.log("Authed User:", authed_user);

  if (!teamId || !channel || !text || !schedule_time) {
    return res.status(400).json({ error: 'Team ID, channel, time and text are required'});
  }

  if (!req.slackUser || !req.slackUser.access_token) {
    return res.status(401).json({ error: 'Missing access token in slackUser' });
  }

  try {
    const scheduleTimeInUTC = DateTime.fromISO(schedule_time, { zone: 'Asia/Kolkata' }).toUTC().toJSDate();

    const newScheduledMessage = new ScheduledMessage({
      authed_user,
      teamId,
      channel,
      text,
      schedule_time: scheduleTimeInUTC, // stored in UTC
    });

    await newScheduledMessage.save();

    return res.status(201).json({
      message: 'Scheduled message saved successfully',
      scheduledMessageId: newScheduledMessage._id,
    });
  } catch (error) {
    console.error("Error saving scheduled message:", error);
    return res.status(500).json({ error: 'Failed to save scheduled message' });
  }
});


// /message/scheduledlist
// get the list from the db
// GET /message/scheduledlist
router.get('/scheduledlist', authMiddleware, async (req: SlackRequest, res: Response) => {
  const authed_user = req.query.authed_user as string;
  const teamId = req.query.teamId as string;

  if (!authed_user || !teamId) {
    return res.status(400).json({ error: 'authed_user and teamId are required' });
  }

  try {
    const messages = await ScheduledMessage.find({ authed_user, teamId }).sort({ schedule_time: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching scheduled messages:", error);
    return res.status(500).json({ error: 'Failed to fetch scheduled messages' });
  }
});


// delete route 
// DELETE /message/scheduled/:id
router.delete('/scheduled/:id', authMiddleware, async (req: SlackRequest, res: Response) => {
  const messageId = req.params.id;
  const authed_user = req.query.authed_user as string;

  if (!messageId || !authed_user) {
    return res.status(400).json({ error: 'Message ID and authed_user are required' });
  }

  try {
    const deleted = await ScheduledMessage.findOneAndDelete({
      _id: messageId,
      authed_user
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Scheduled message not found or not authorized' });
    }

    return res.status(200).json({ message: 'Scheduled message deleted successfully' });
  } catch (error) {
    console.error('Error deleting scheduled message:', error);
    return res.status(500).json({ error: 'Failed to delete scheduled message' });
  }
});


module.exports = router;
