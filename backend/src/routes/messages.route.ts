// ./route/messages.route.ts

import express, { Request, Response } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { WebClient } from '@slack/web-api';

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

module.exports = router;
