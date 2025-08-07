// channelDetails.route.ts

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
import { Request, Response } from 'express';
import SlackUser from '../models/authtable.models';
import authMiddleware = require('../middlewares/auth.middleware');


dotenv.config();

const router = express.Router();

// this route gets me the list of channels
router.get('/getlist', authMiddleware,  async (req: Request, res: Response) => {
    console.log("protected route");
    return res.json({message:"working"});
});

module.exports = router;
