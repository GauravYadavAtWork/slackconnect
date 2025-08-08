// ./routes/channelDetails.route.ts
const express = require('express');
const dotenv = require('dotenv');
import authMiddleware = require('../middlewares/auth.middleware');
import { getChannelList } from '../controllers/channel.Controller';

dotenv.config();

const router = express.Router();

router.get('/getlist', authMiddleware, getChannelList);

module.exports = router;
