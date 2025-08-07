import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const CLIENT_ID = "YOUR_SLACK_CLIENT_ID";
const REDIRECT_URI = "http://localhost:3000/slack/callback";
const SCOPES = "identity.basic"; // Add more scopes if needed

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
