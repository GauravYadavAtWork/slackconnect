// // ./pages/Home.jsx
// import { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'

// function Home() {
//   const location = useLocation()
//   const [data, setData] = useState(null)

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search)

//     const userId = queryParams.get("user_id") // authed_user
//     const accesstoken = queryParams.get("access_token")
//     const teamId = queryParams.get("team_id")
//     const teamName = queryParams.get("team_name")

//     if (userId && accesstoken && teamId && teamName) {
//       setData({ userId, accesstoken, teamId, teamName })
//     }
//   }, [location.search])

//   return (
//     <div>
//       <h1>Slack OAuth Result</h1>
//       <div>
//         <p><strong>User ID:</strong> {data.userId}</p>
//         <p><strong>Access Token:</strong> {data.accesstoken}</p>
//         <p><strong>Team ID:</strong> {data.teamId}</p>
//         <p><strong>Team Name:</strong> {data.teamName}</p>
//       </div>
//     </div>
//   )
// }

// export default Home


// ./pages/Home.jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const location = useLocation()
  const [data, setData] = useState(null)
  const [channels, setChannels] = useState([])

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
      const response = await axios.get("https://slackconnect-s25w.onrender.com/channel/getlist", {
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
            #{channel.name} {channel.is_private && "(Private)"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
