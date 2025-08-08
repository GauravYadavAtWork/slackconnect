import React from 'react'

const CLIENT_ID = "9328204862769.9319939219157"; // my client id
const REDIRECT_URI = "https://slackconnect-s25w.onrender.com/slack/oauth/callback";
const SCOPES = "channels:read,groups:read,im:read,mpim:read,users:read,chat:write,channels:history,im:history,channels:join";
const USER_SCOPES = "channels:read,channels:history,channels:write,chat:write,calls:read,groups:read,groups:write";

// const OAUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=YOUR_CLIENT_ID&scope=${SCOPES}&user_scope=${USER_SCOPES}&redirect_uri=YOUR_REDIRECT_URI`;


function Loginpage() {
  const handleLogin = () => {
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&user_scope=${USER_SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = slackAuthUrl;
  };
  
  return (
    <>
      <button onClick={handleLogin}>Login to Slack</button>
    </>
  );
}

export default Loginpage