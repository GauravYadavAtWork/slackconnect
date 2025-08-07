// src/index.ts (CommonJS style)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const slack = require('./routes/slack.route')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use('/slack', slack);

app.get('/', (req: any, res: any) => {
  res.send('Hello from Express + TypeScript + CORS (CommonJS)!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
