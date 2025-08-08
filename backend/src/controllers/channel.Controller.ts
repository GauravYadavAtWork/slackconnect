// ./controllers/channel.Controller.ts

import axios from 'axios';
import { Request, Response } from 'express';

interface SlackRequest extends Request {
    slackUser?: {
        access_token: string;
    };
}

export const getChannelList = async (req: SlackRequest, res: Response) => {
    try {
        const accessToken = req.slackUser?.access_token;

        if (!accessToken) {
            return res.status(401).json({ error: 'Access token not found' });
        }

        const apiUrl = 'https://slack.com/api/conversations.list';

        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                types: 'public_channel,private_channel',
            },
        });

        const channels = response.data.channels;

        if (!channels || channels.length === 0) {
            return res.status(404).json({ error: 'No channels found' });
        }

        return res.status(200).json({
            channels: channels.map((channel: any) => ({
                id: channel.id,
                name: channel.name,
                is_private: channel.is_private,
            })),
        });

    } catch (error: any) {
        console.error('Error fetching channels:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
