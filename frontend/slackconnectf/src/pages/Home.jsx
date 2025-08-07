// ./pages/Home.jsx
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function Home() {
  const location = useLocation()
  const [data, setData] = useState(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    const userId = queryParams.get("user_id")
    const accesstoken = queryParams.get("access_token")
    const teamId = queryParams.get("team_id")
    const teamName = queryParams.get("team_name")

    if (userId && accesstoken && teamId && teamName) {
      setData({ userId, accesstoken, teamId, teamName })
    }
  }, [location.search])

  return (
    <div>
      <h1>Slack OAuth Result</h1>
      {data ? (
        <div>
          <p><strong>User ID:</strong> {data.userId}</p>
          <p><strong>Access Token:</strong> {data.accesstoken}</p>
          <p><strong>Team ID:</strong> {data.teamId}</p>
          <p><strong>Team Name:</strong> {data.teamName}</p>
        </div>
      ) : (
        <p>Loading data from Slack...</p>
      )}
    </div>
  )
}

export default Home
