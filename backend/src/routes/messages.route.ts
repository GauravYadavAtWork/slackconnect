import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import {
  sendInstantMessage,
  scheduleMessage,
  getScheduledMessages,
  deleteScheduledMessage
} from '../controllers/messages.Controller';

const router = express.Router();

router.post('/instantmessage', authMiddleware, sendInstantMessage);
router.post('/scheduled', authMiddleware, scheduleMessage);
router.get('/scheduledlist', authMiddleware, getScheduledMessages);
router.delete('/scheduled/:id', authMiddleware, deleteScheduledMessage);

export = router;
