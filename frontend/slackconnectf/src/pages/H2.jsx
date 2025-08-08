// ./pages/H2.jsx
import { useState } from 'react'

function H2() {
  const data = {
    userId: "U12345678",
    accesstoken: "xoxp-dummy-access-token",
    teamId: "T12345678",
    teamName: "Dummy Team"
  }

  const dummyChannels = [
    { id: "C1", name: "general", is_private: false },
    { id: "C2", name: "random", is_private: false },
    { id: "C3", name: "private-group", is_private: true }
  ]

  const [selectedChannel, setSelectedChannel] = useState('')
  const [message, setMessage] = useState('')
  const [responseMsg, setResponseMsg] = useState('')

  const handleSendMessage = () => {
    if (!selectedChannel || !message) {
      alert("Please select a channel and enter a message.")
      return
    }

    console.log("Sending message to:", selectedChannel)
    console.log("Message:", message)
    setResponseMsg("Message sent successfully (dummy)!")
    setMessage('')
  }

  return (
    <div>
      <h1>Slack OAuth Result</h1>
      <div>
        <p><strong>User ID:</strong> {data.userId}</p>
        <p><strong>Access Token:</strong> {data.accesstoken}</p>
        <p><strong>Team ID:</strong> {data.teamId}</p>
        <p><strong>Team Name:</strong> {data.teamName}</p>
      </div>

      <h2>Channels</h2>
      <ul>
        {dummyChannels.map(channel => (
          <li key={channel.id}>
            <label>
              <input
                type="radio"
                name="channel"
                value={channel.id}
                onChange={() => setSelectedChannel(channel.id)}
              />
              #{channel.name} {channel.is_private && "(Private)"}
            </label>
          </li>
        ))}
      </ul>

      {selectedChannel && (
        <div style={{ marginTop: '20px' }}>
          <h3>Send a Message to #{dummyChannels.find(c => c.id === selectedChannel)?.name}</h3>
          <textarea
            rows="4"
            cols="50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <br />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}

      {responseMsg && <p>{responseMsg}</p>}
    </div>
  )
}

export default H2
