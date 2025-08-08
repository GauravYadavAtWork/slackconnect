import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './H2.css';


const ScheduledComp = ({ userId, accessToken, teamId , baseurl}) => {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && accessToken && teamId) {
      fetchScheduledMessages();
    }
  }, [userId, accessToken, teamId]);

  const fetchScheduledMessages = async () => {
    try {
      const response = await axios.get(baseurl + "/message/scheduledlist", {
        params: {
          authed_user: userId,
          access_token: accessToken,
          teamId: teamId
        }
      });
      setScheduledMessages(response.data.messages || []);
      console.log(response.data.messages);
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScheduled = async (id) => {
    try {
      await axios.delete(baseurl + `/message/scheduled/${id}`, {
        params: {
          authed_user: userId,
          access_token: accessToken
        }
      });
      setScheduledMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (error) {
      console.error("Failed to delete scheduled message:", error);
    }
  };

  if (loading) {
    return <div className="scheduled-empty">Loading scheduled messages...</div>;
  }

  if (scheduledMessages.length === 0) {
    return <div className="scheduled-empty">No scheduled messages.</div>;
  }

  return (
    <div className="scheduled-container">
      <h2 className="scheduled-title">Scheduled Messages</h2>
      {scheduledMessages.map((msg) => (
        <div className="scheduled-box-container" key={msg._id}>
          <div className="scheduled-card">
            <p><strong>Channel:</strong> #{msg.channel}</p>
            <p><strong>Message:</strong> {msg.text}</p>
            <p><strong>Time:</strong> {new Date(msg.schedule_time).toLocaleString()}</p>
            <button
              className="delete-btn"
              onClick={() => handleDeleteScheduled(msg._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledComp;
