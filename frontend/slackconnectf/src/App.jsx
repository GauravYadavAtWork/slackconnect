import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const CLIENT_ID = "9328204862769.9319939219157"; // my client id
const REDIRECT_URI = "https://slackconnect-s25w.onrender.com/slack/oauth/callback";
const SCOPES = "channels:read,groups:read,im:read,mpim:read,users:read,chat:write,channels:history,im:history,channels:join";

function App() {
  const handleLogin = () => {
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = slackAuthUrl;
  };

  return (
    <>
      <button onClick={handleLogin}>Login to Slack</button>
    </>
  );
}


export default App
