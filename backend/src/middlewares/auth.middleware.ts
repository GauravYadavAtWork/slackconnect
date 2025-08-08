// auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import SlackUser from '../models/authtable.models';

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
            access_token: data.authed_user.access_token,
            refresh_token: data.authed_user.refresh_token,
            expires_in: data.expires_in,
            scope: data.scope,
        };
    } catch (error: any) {
        console.error("Error refreshing token:", error.message);
        throw error;
    }
}

// Function to test if access token is valid via Slack API
async function isAccessTokenValid(accessToken: string): Promise<boolean> {
    try {
        const response = await axios.post(
            'https://slack.com/api/auth.test',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.ok === true;
    } catch (error: any) {
        console.error('Slack token validation failed:', error.message);
        return false;
    }
}

// Middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract access token from request
        
        const accessToken =
            req.body?.access_token ||
            req.headers['authorization']?.toString().replace('Bearer ', '') ||
            req.query?.access_token;

        if (!accessToken) {
            return res.status(401).json({ error: 'Access token is required' });
        }

        // Get user ID from request (adjust depending on how you pass it)
        const authedUserId = req.body?.authed_user || req.params?.authed_user || req.query?.authed_user;

        if (!authedUserId) {
            return res.status(400).json({ error: 'authed_user is required' });
        }

        // Find user by authed_user
        const user = await SlackUser.findOne({ authed_user: authedUserId });

        if (!user) {
            return res.status(404).json({ error: 'Slack user not found for given user ID' });
        }

        const tokenValid = await isAccessTokenValid(accessToken as string);

        if (!tokenValid) {
            console.log('Access token is invalid. Attempting to refresh...');

            const newTokens = await rotateAccessToken(user.refresh_token);

            if (!newTokens || !newTokens.access_token) {
                return res.status(500).json({ error: 'Failed to refresh access token' });
            }

            user.access_token = newTokens.access_token;
            user.refresh_token = newTokens.refresh_token;
            user.expires_at = new Date(Date.now() + newTokens.expires_in * 1000);

            await user.save();

            console.log('Access token refreshed successfully.');
        }
        console.log("logging user:", user.authed_user);
        // Attach Slack user info to the request object
        (req as any).slackUser = user;
        console.log("Calling next()");
        console.log("Requesting: ", req.originalUrl);

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export = authMiddleware;
