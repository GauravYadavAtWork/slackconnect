// slack.route.ts
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
import { Request, Response } from 'express';

dotenv.config();

const router = express.Router();

router.get('/oauth/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
        return res.status(400).json({ error: 'Missing code from Slack callback' });
    }

    try {
        const response = await axios.post(
            'https://slack.com/api/oauth.v2.access',
            null,
            {
                params: {
                    code,
                    client_id: process.env.SLACK_CLIENTID,
                    client_secret: process.env.SLACK_CLIENTSECRET,
                    redirect_uri: process.env.SLACK_REDIRECT_URI
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const data = response.data;

        if (!data.ok) {
            return res.status(400).json({ error: data.error || 'Slack auth failed' });
        }

        return res.status(200).json({
            message: 'Slack auth successful',
            access_token: data.access_token,
            team: data.team,
            authed_user: data.authed_user
        });

    } catch (error: any) {
        console.error('Slack OAuth error:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Internal server error during Slack auth' });
    }
});

module.exports = router;
