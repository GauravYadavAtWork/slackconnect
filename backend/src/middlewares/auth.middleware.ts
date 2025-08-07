// auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import SlackUser from '../models/authtable.models';

// Helper to check if token is expired or will expire in next 10 minutes
function isTokenExpiringSoon(expiresAt: Date): boolean {
    const now = new Date();
    const threshold = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    return !expiresAt || expiresAt.getTime() < threshold.getTime();
}


// Function to refresh Slack access token using refresh_token
async function rotateAccessToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope?: string;
}> {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    params.append("client_id", process.env.SLACK_CLIENT_ID || '');
    params.append("client_secret", process.env.SLACK_CLIENT_SECRET || '');

    try {
        const response = await axios.post("https://slack.com/api/oauth.v2.access", params);
        const data = response.data;

        if (!data.ok) {
            throw new Error(`Slack error: ${data.error}`);
        }

        console.log("Token refresh response:", data);

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            scope: data.scope,
        };
    } catch (error: any) {
        console.error("Error refreshing token:", error.message);
        throw error;
    }
}

// Middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.body.teamid || req.params.teamid;

        if (!teamId) {
            return res.status(400).json({ error: 'Team ID is required' });
        }

        const user = await SlackUser.findOne({ teamid: teamId });

        if (!user) {
            return res.status(404).json({ error: 'Slack user not found for given team ID' });
        }

        if (isTokenExpiringSoon(user.expires_at)) {
            console.log('Access token is expired or about to expire. Refreshing...');

            const newTokens = await rotateAccessToken(user.refresh_token); // implement it again here

            if (!newTokens || !newTokens.access_token) {
                return res.status(500).json({ error: 'Failed to refresh access token' });
            }

            user.access_token = newTokens.access_token;
            user.refresh_token = newTokens.refresh_token;
            user.expires_at = new Date(Date.now() + newTokens.expires_in * 1000);

            await user.save();
            console.log('Access token refreshed successfully.');
        }

        // Attach user info to request for further use
        (req as any).slackUser = user;

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export = authMiddleware;
