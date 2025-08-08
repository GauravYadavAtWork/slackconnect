import express from 'express';
import dotenv from 'dotenv';
import { slackOAuthCallback } from '../controllers/auth.Controller';
dotenv.config();

const router = express.Router();

router.get('/oauth/callback', slackOAuthCallback);

export = router;
