// slack.route.ts
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
import { Request, Response } from 'express';
import SlackUser from '../models/authtable.models';

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

        // now we have access token and refesh token
        const data = response.data;
        console.log(data);
        if (!data.ok) {
            return res.status(400).json({ error: data.error || 'Slack auth failed' });
        }

        // // now i will store data.authed_user.id to the db along with access and refresh token
        await SlackUser.create({
            authed_user: data.authed_user.id,
            access_token: data.access_token,
            refresh_token: data.refresh_token 
        });

        // i will send it back to the client in the form of json

        // Redirect back to frontend with user and team info (secure in production)

        const redirectUrl = new URL(process.env.FRONTEND_REDIRECT_URL || 'http://localhost:5173/home');
        // Include all necessary query params
        redirectUrl.searchParams.set('user_id', data.authed_user.id);
        redirectUrl.searchParams.set('team_id', data.team.id);
        redirectUrl.searchParams.set('team_name', data.team.name);
        redirectUrl.searchParams.set('access_token', data.access_token);
        return res.redirect(redirectUrl.toString());

    } catch (error: any) {
        console.error('Slack OAuth error:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Internal server error during Slack auth' });
    }
});

module.exports = router;
