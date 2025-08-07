// src/index.ts (CommonJS style)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const slack = require('./routes/slack.route')
const channel = require('./routes/channelDetails.route')
const connectDB = require('./models/connectDB')
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/slack', slack);
app.use('/channel', channel);

app.get('/', (req: any, res: any) => {
  res.send('server healthy');
});


(async () => {
    await connectDB();
  
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
})();