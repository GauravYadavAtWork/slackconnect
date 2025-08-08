import { useState } from "react";
import "./H2.css";

function H2() {
  const data = {
    userId: "U12345678",
    accesstoken: "xoxp-dummy-access-token",
    teamId: "T12345678",
    teamName: "Dummy Team",
  };

  const dummyChannels = [
    { id: "C1", name: "general", is_private: false },
    { id: "C2", name: "random", is_private: false },
    { id: "C3", name: "private-group", is_private: true },
  ];

  const [selectedChannel, setSelectedChannel] = useState("");
  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSendMessage = () => {
    if (!selectedChannel || !message.trim()) {
      alert("Please select a channel and enter a message.");
      return;
    }

    const channelName = dummyChannels.find(
      (c) => c.id === selectedChannel
    )?.name;

    console.log("Sending message to:", selectedChannel);
    console.log("Message:", message);

    setResponseMsg(`Message sent successfully to #${channelName} (dummy)!`);
    setMessage("");
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
          <h1>Welcome to Slack</h1>
          <h2>Choose a Channel</h2>

          <select
            className="channel-select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="">-- Select a channel --</option>
            {dummyChannels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name} {channel.is_private && "(Private)"}
              </option>
            ))}
          </select>

          {selectedChannel && (
            <div className="message-section">
              <h3>
                Send a Message to #
                {dummyChannels.find((c) => c.id === selectedChannel)?.name}
              </h3>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
              />
              
              <button onClick={handleSendMessage} disabled={!message.trim()}>
                Send
              </button>
            </div>
          )}

          {responseMsg && <p className="success-msg">{responseMsg}</p>}
        </div>
      </div>

      {/* Right panel */}
      <div className="right-panel">
        
      </div>
    </div>
  );
}

export default H2;



