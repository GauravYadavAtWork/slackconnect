
// // ./pages/Home.jsx
// import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import axios from 'axios'

// function Home() {
//   const location = useLocation()
//   const [data, setData] = useState(null)
//   const [channels, setChannels] = useState([])

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search)

//     const userId = queryParams.get("user_id") // authed_user
//     const accesstoken = queryParams.get("access_token")
//     const teamId = queryParams.get("team_id")
//     const teamName = queryParams.get("team_name")

//     if (userId && accesstoken && teamId && teamName) {
//       const payload = { userId, accesstoken, teamId, teamName }
//       setData(payload)

//       // Fetch channel list
//       fetchChannelList(userId, accesstoken)
//     }
//   }, [location.search])

//   const fetchChannelList = async (userId, accesstoken) => {
//     try {
//       const response = await axios.get("https://slackconnect-s25w.onrender.com/channel/getlist", {
//         params: {
//           authed_user: userId,
//           access_token: accesstoken
//         }
//       })

//       setChannels(response.data.channels)
//     } catch (error) {
//       console.error("Error fetching channel list:", error)
//     }
//   }

//   return (
//     <div>
//       <h1>Slack OAuth Result</h1>
//       {data && (
//         <div>
//           <p><strong>User ID:</strong> {data.userId}</p>
//           <p><strong>Access Token:</strong> {data.accesstoken}</p>
//           <p><strong>Team ID:</strong> {data.teamId}</p>
//           <p><strong>Team Name:</strong> {data.teamName}</p>
//         </div>
//       )}

//       <h2>Channels</h2>
//       <ul>
//         {channels.map(channel => (
//           <li key={channel.id}>
//             #{channel.name} {channel.is_private && "(Private)"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Home


// ./pages/Home.jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

// const baseurl = "https://slackconnect-s25w.onrender.com";
const baseurl = "http://localhost:3000";

function Home() {
  const location = useLocation()
  const [data, setData] = useState(null)
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('')
  const [message, setMessage] = useState('')
  const [responseMsg, setResponseMsg] = useState('')

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    const userId = queryParams.get("user_id") // authed_user
    const accesstoken = queryParams.get("access_token")
    const teamId = queryParams.get("team_id")
    const teamName = queryParams.get("team_name")

    if (userId && accesstoken && teamId && teamName) {
      const payload = { userId, accesstoken, teamId, teamName }
      setData(payload)

      // Fetch channel list
      fetchChannelList(userId, accesstoken)
    }
  }, [location.search])

  const fetchChannelList = async (userId, accesstoken) => {
    try {
      const response = await axios.get(baseurl + "/channel/getlist", {
        params: {
          authed_user: userId,
          access_token: accesstoken
        }
      })

      setChannels(response.data.channels)
    } catch (error) {
      console.error("Error fetching channel list:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedChannel || !message) {
      alert("Please select a channel and enter a message.")
      return
    }

    try {
      const response = await axios.post(baseurl + "/message/instantmessage", {
        teamId: data.teamId,
        channel: selectedChannel,
        text: message,
        access_token: data.accesstoken
      }, {
        headers: {
        },
        params:{
          authed_user: data.userId,
        }
      })

      setResponseMsg(response.data.message || "Message sent!")
      setMessage('') // Clear input
    } catch (error) {
      console.error("Error sending message:", error)
      setResponseMsg("Failed to send message.")
    }
  }

  return (
    <div>
      <h1>Slack OAuth Result</h1>
      {data && (
        <div>
          <p><strong>User ID:</strong> {data.userId}</p>
          <p><strong>Access Token:</strong> {data.accesstoken}</p>
          <p><strong>Team ID:</strong> {data.teamId}</p>
          <p><strong>Team Name:</strong> {data.teamName}</p>
        </div>
      )}

      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
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
          <h3>Send a Message to #{channels.find(c => c.id === selectedChannel)?.name}</h3>
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

export default Home
