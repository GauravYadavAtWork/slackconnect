// ./pages/Home.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ScheduledComp from './scheduledComp';
import axios from 'axios';
import './H2.css';

const baseurl = "https://slackconnect-s25w.onrender.com";
// const baseurl = "http://localhost:3000";

function Home() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledKey, setScheduledKey] = useState(0);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("user_id");
    const accesstoken = queryParams.get("access_token");
    const teamId = queryParams.get("team_id");
    const teamName = queryParams.get("team_name");

    if (userId && accesstoken && teamId && teamName) {
      const payload = { userId, accesstoken, teamId, teamName };
      setData(payload);
      fetchChannelList(userId, accesstoken);
    }
  }, [location.search]);

  const fetchChannelList = async (userId, accesstoken) => {
    try {
      const response = await axios.get(baseurl + "/channel/getlist", {
        params: {
          authed_user: userId,
          access_token: accesstoken
        }
      });
      setChannels(response.data.channels);
    } catch (error) {
      console.error("Error fetching channel list:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChannel || !message.trim()) {
      alert("Please select a channel and enter a message.");
      return;
    }

    if (isScheduled && !scheduleTime) {
      alert("Please select a schedule time.");
      return;
    }

    try {
      const url = isScheduled
        ? baseurl + "/message/scheduled"
        : baseurl + "/message/instantmessage";

      const payload = {
        teamId: data.teamId,
        channel: selectedChannel,
        text: message,
        access_token: data.accesstoken,
        ...(isScheduled && { schedule_time: scheduleTime })
      };

      const response = await axios.post(url, payload, {
        params: { authed_user: data.userId }
      });

      const channelName = channels.find(c => c.id === selectedChannel)?.name;
      setResponseMsg(response.data.message || `Message sent to #${channelName}`);
      setMessage('');
      setIsScheduled(false);
      setScheduleTime('');
      setScheduledKey(prev => prev + 1);
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMsg("Failed to send message.");
    }
  };


  return (
    <div className="h2-wrapper">
      {/* Left panel with video background */}
      <div className="left-panel">
        <video autoPlay muted loop playsInline className="bg-video">
          <source src="/videoplayback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay"></div>
        <div className="left-content">
          <h1>Welcome to Slack Connect</h1>

          <h2>Choose a Channel</h2>
          <select
            className="channel-select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="">-- Select a channel --</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name} {channel.is_private && "(Private)"}
              </option>
            ))}
          </select>

          {selectedChannel && (
            <div className="message-section">
              <h3>
                Send a Message to #{channels.find(c => c.id === selectedChannel)?.name}
              </h3>

              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />

              <div style={{ margin: "10px 0" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                  />
                  {" "}Schedule message
                </label>
              </div>

              {isScheduled && (
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Select Time:{" "}
                    <input
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <button onClick={handleSendMessage} disabled={!message.trim()}>
                Send
              </button>
            </div>
          )}

          {responseMsg && <p className="success-msg">{responseMsg}</p>}
        </div>
      </div>

      {/* Right panel (empty for now) */}
      <div className="right-panel">
        {data && (
          <ScheduledComp
            key={scheduledKey}
            userId={data.userId}
            accessToken={data.accesstoken}
            teamId={data.teamId}
            baseurl={baseurl}
          />
        )}
      </div>

    </div>
  );
}

export default Home;
