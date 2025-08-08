// ./controllers/auth.Controller.ts

import axios from 'axios';
import { Request, Response } from 'express';
import SlackUser from '../models/authtable.models';

export const slackOAuthCallback = async (req: Request, res: Response) => {
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
                    redirect_uri: process.env.SLACK_REDIRECT_URI,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const data = response.data;

        if (!data.ok) {
            return res.status(400).json({ error: data.error || 'Slack auth failed' });
        }

        const expiresAt = new Date(Date.now() + data.expires_in * 1000);
        const authedUserId = data.authed_user.id;

        const existingUser = await SlackUser.findOne({ authed_user: authedUserId });

        if (existingUser) {
            existingUser.access_token = data.authed_user.access_token;
            existingUser.refresh_token = data.authed_user.refresh_token;
            existingUser.teamid = data.team.id;
            existingUser.expires_at = expiresAt;
            await existingUser.save();
            console.log('Slack user updated:', authedUserId);
        } else {
            await SlackUser.create({
                authed_user: authedUserId,
                access_token: data.authed_user.access_token,
                refresh_token: data.authed_user.refresh_token,
                teamid: data.team.id,
                expires_at: expiresAt,
            });
            console.log('New Slack user saved:', authedUserId);
        }

        const redirectUrl = new URL(process.env.FRONTEND_REDIRECT_URL || 'http://localhost:5173/home');
        redirectUrl.searchParams.set('user_id', authedUserId);
        redirectUrl.searchParams.set('team_id', data.team.id);
        redirectUrl.searchParams.set('team_name', data.team.name);
        redirectUrl.searchParams.set('access_token', data.authed_user.access_token);

        return res.redirect(redirectUrl.toString());

    } catch (error: any) {
        console.error('Slack OAuth error:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Internal server error during Slack auth' });
    }
};
