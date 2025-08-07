// src/index.ts (CommonJS style)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const slack = require('./routes/slack.route')
import connectDB from './models/connectDB';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use('/slack', slack);

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();

app.get('/', async(req: any, res: any) => {
  res.send(Date.now);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
