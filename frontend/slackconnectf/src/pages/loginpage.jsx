import React from 'react';

const CLIENT_ID = "9328204862769.9319939219157";
const REDIRECT_URI = "https://slackconnect-s25w.onrender.com/slack/oauth/callback";
const SCOPES = "channels:read,groups:read,im:read,mpim:read,users:read,chat:write,channels:history,im:history,channels:join";
const USER_SCOPES = "channels:read,channels:history,channels:write,chat:write,calls:read,groups:read,groups:write";


const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes letter-fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes subtle-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(74, 21, 75, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(74, 21, 75, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(74, 21, 75, 0);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(10deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }
`;

// --- Component Styles ---
const styles = {
  // Container for the background shapes animation
  backgroundContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
    background: 'linear-gradient(45deg, #f8f8f8, #e9e9e9)',
  },
  // Style for the individual floating shapes
  shape: (color, top, left, size, duration, delay) => ({
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: '50%',
    opacity: 0.5,
    filter: 'blur(20px)',
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
  }),
  // Main content container, now also fixed to the viewport
  loginContainer: {
    position: 'fixed', // <-- THE FIX: This ensures it covers the whole screen
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1, // Ensure this is on top of the background
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Lato', sans-serif",
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent to show background
    backdropFilter: 'blur(10px)', // Frosted glass effect
    padding: '40px 50px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
    maxWidth: '420px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'fadeInUp 0.8s 0.5s ease-out forwards',
    opacity: 0,
  },
  slackLogo: {
    width: '100px',
    height: 'auto',
    marginBottom: '16px',
  },
  animatedTitle: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#1d1c1d',
    marginBottom: '20px',
    display: 'inline-block',
  },
  animatedLetter: (delay) => ({
    display: 'inline-block',
    opacity: 0,
    animation: `letter-fade-in 0.5s ease-out forwards`,
    animationDelay: `${delay}s`,
  }),
  header: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1d1c1d',
    marginBottom: '8px',
  },
  subHeader: {
    fontSize: '16px',
    color: '#616061',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  loginButton: {
    backgroundColor: '#4A154B',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 0',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease-in-out, transform 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    animation: 'subtle-pulse 2s infinite',
  },
  footer: {
    marginTop: '24px',
    fontSize: '12px',
    color: '#616061', // Darker for better contrast
    animation: 'fadeInUp 0.8s 1s ease-out forwards',
    opacity: 0,
  }
};

// Slack Logo Component (no changes)
const SlackLogo = () => (
  <svg viewBox="0 0 122.8 122.8" style={styles.slackLogo}>
    <path fill="#E01E5A" d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z"/>
    <path fill="#E01E5A" d="M32.2 77.6c7.1 0 12.9-5.8 12.9-12.9S39.3 51.8 32.2 51.8 19.3 57.6 19.3 64.7V77.6h12.9z"/>
    <path fill="#36C5F0" d="M45.2 25.8c-7.1 0-12.9 5.8-12.9 12.9s5.8 12.9 12.9 12.9S58.1 39.3 58.1 32.2v-12.9H45.2z"/>
    <path fill="#36C5F0" d="M45.2 19.3c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9S64.9 32.2 58.1 32.2H45.2V19.3z"/>
    <path fill="#2EB67D" d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z"/>
    <path fill="#2EB67D" d="M90.6 45.2c-7.1 0-12.9 5.8-12.9 12.9s5.8 12.9 12.9 12.9 12.9-5.8 12.9-12.9V45.2H90.6z"/>
    <path fill="#ECB22E" d="M77.6 97c7.1 0 12.9-5.8 12.9-12.9S84.7 71.2 77.6 71.2 64.7 77 64.7 84.1v12.9h12.9z"/>
    <path fill="#ECB22E" d="M77.6 103.5c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9S64.7 90.6 71.2 90.6h12.9v12.9z"/>
  </svg>
);

// Data for the background shapes
const shapes = [
    { color: '#e01e5a', top: 10, left: 15, size: 150, duration: 10, delay: 0 },
    { color: '#36c5f0', top: 20, left: 80, size: 200, duration: 12, delay: 2 },
    { color: '#2eb67d', top: 70, left: 10, size: 180, duration: 9, delay: 1 },
    { color: '#ecb22e', top: 65, left: 70, size: 220, duration: 15, delay: 3 },
];

function LoginPage() {
  const handleLogin = () => {
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&user_scope=${USER_SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = slackAuthUrl;
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = '#611f69';
    e.currentTarget.style.transform = 'scale(1.02)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = '#4A154B';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const titleText = "Slack Connect";

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      <style>{animationStyles}</style>

      {/* Background Animation Container */}
      <div style={styles.backgroundContainer}>
        {shapes.map((shape, i) => (
          <div key={i} style={styles.shape(shape.color, shape.top, shape.left, shape.size, shape.duration, shape.delay)} />
        ))}
      </div>

      {/* Main Content Container */}
      <div style={styles.loginContainer}>
        <h1 style={styles.animatedTitle}>
          {titleText.split("").map((letter, index) => (
            <span key={index} style={styles.animatedLetter(index * 0.05)}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>
        <div style={styles.loginCard}>
          <SlackLogo />
          <h2 style={styles.header}>Sign in to your workspace</h2>
          <p style={styles.subHeader}>
            Connect your account to start collaborating with your team.
          </p>
          <button
            style={styles.loginButton}
            onClick={handleLogin}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Sign in with Slack
          </button>
        </div>
        <p style={styles.footer}>
          Secured by Slack OAuth
        </p>
      </div>
    </>
  );
}

export default LoginPage;
