

## **Project Name:** SlackConnect

** Live Link:** [https://slackconnect.vercel.app](https://slackconnect.vercel.app)

---

##  Tech Stack

### Backend

* **Language:** TypeScript
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **OAuth:** Slack OAuth 2.0
* **Hosted On:** [Render](https://render.com)

### Frontend

* **Library:** React.js
* **Routing:** React Router
* **OAuth Handling:** custom logic
* **Hosted On:** [Vercel](https://vercel.com)

---

##  Platform Overview

**SlackConnect** is a platform designed to schedule messages to any Slack workspace’s channels or groups.

* It's **installable by any Slack workspace.**
* Each workspace needs to:

  1. **Install the app**
  2. **Provide their own Client ID and Client Secret** (from their Slack App)
  3. Once done, they can use SlackConnect independently to schedule messages.

This ensures that **data stays isolated per workspace**.

---

##  Backend Setup

###  Prerequisites

Make sure you have:

* Node.js (v18+)
* TypeScript (`npm i -g typescript`)
* MongoDB Atlas (or local instance)
* Your own **Slack App** (create from: [https://api.slack.com/apps](https://api.slack.com/apps))

---

### Steps to Run Backend Locally

#### 1. Clone the repository:

```bash
git clone https://github.com/your-username/slackconnect-backend.git
cd slackconnect-backend
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Create `.env` file:

In the root folder, create a `.env` file with the following contents:

```env
SLACK_CLIENTID=your-slack-client-id
SLACK_CLIENTSECRET=your-slack-client-secret
SLACK_REDIRECT_URI=https://slackconnect-s25w.onrender.com/slack/oauth/callback

MONGODB_CONNECTION_URL=your-mongodb-url
FRONTEND_REDIRECT_URL=https://slackconnect.vercel.app/home
```

###  Explanation of ENV variables

| Variable                 | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `SLACK_CLIENTID`         | Your Slack App's Client ID                                |
| `SLACK_CLIENTSECRET`     | Your Slack App's Client Secret                            |
| `SLACK_REDIRECT_URI`     | Redirect URL after Slack login (matches one in Slack App) |
| `MONGODB_CONNECTION_URL` | MongoDB connection string (local or Atlas)                |
| `FRONTEND_REDIRECT_URL`  | Where to redirect users after Slack authentication        |

#### 4. Run the server:

```bash
npx tsc
node dist/index.js
```

Or using ts-node for development:

```bash
npx ts-node src/index.ts
```

---

##  Frontend Setup

###  Prerequisites

* Node.js
* npm
* React (already built in Vite or CRA)

---

### Steps to Run Frontend Locally

#### 1. Clone the frontend repo:

```bash
git clone https://github.com/your-username/slackconnect-frontend.git
cd slackconnect-frontend
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Create `.env` file:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000
```

> Replace with your deployed backend URL if needed.

#### 4. Start the development server:

```bash
npm run dev
```

---

##  How the Platform Works

* The app can be **installed by any Slack workspace**.
* Once installed, the workspace admins must:

  * Create a Slack App
  * Enter their app's `client_id` and `client_secret` on the platform
* The platform uses **Slack OAuth** to authenticate users and gain permission to post messages.
* Each message is scheduled and stored in MongoDB with a timestamp.
* A **background task runs every minute** to check and post scheduled messages.

##  **Core Functionality:**

### 1. **Slack OAuth Integration**

* **OAuth flow using `client_id`, `redirect_uri`, scopes, and user\_scopes\`.**
* The user clicks "Login with Slack", gets redirected to Slack for authorization.
* On successful login, Slack redirects back to your backend (`/slack/oauth/callback`) with a code.
* Backend exchanges this code for:

  * `access_token`
  * `refresh_token`
  * `expires_at`
  * `authed_user`
  * `teamId`

### 2. **Slack User Token Management**

* You store the access/refresh tokens in a MongoDB collection named `SlackUser` using this schema:

```ts
{
  authed_user: string;
  access_token: string;
  refresh_token: string;
  teamid: string;
  expires_at: Date;
}
```

* Used in authenticated calls to post messages on behalf of the user.

---

##  **Scheduled Messaging**

###  3. **Users can schedule messages**

* Stored in a MongoDB collection with schema:

```ts
{
  authed_user: string;
  teamId: string;
  channel: string;
  text: string;
  schedule_time: Date;
  sent: boolean;
}
```

---

##  **Message Scheduler**

###  4. **Scheduled Job runs every 1 minute**

* `checkAndSendScheduledMessages()`:

  * Runs every 60 seconds from `app.ts` using `setInterval`.
  * Checks if any messages' `schedule_time <= now && sent === false`
  * Sends them using `sendMessage()` (which uses Slack API and user's `access_token`)
  * After sending, **deletes** the message from DB

```ts
setInterval(() => {
  checkAndSendScheduledMessages();
}, 60 * 1000);
```

---

## **sendMessage() Function**

* Pulls the access token from your `SlackUser` collection
* Uses `axios` to send a `POST` request to `https://slack.com/api/chat.postMessage`

```ts
const response = await axios.post('https://slack.com/api/chat.postMessage', {
  channel,
  text,
}, {
  headers: {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'application/json',
  },
});
```

---

##  **Frontend**

###  5. **Login Page**

* React component with a single button: "Login to Slack"
* You enhanced it with Tailwind CSS and a beautiful UI:

  * Centered on the screen
  * Gradient background

Sure, here’s a well-structured section you can add to your project documentation or README for **potential improvements**:

---

##  Potential Improvements

While the current version of SlackConnect is fully functional, several improvements can be made to scale the system, enhance reliability, and add more features.

### 1. **Microservices Architecture**

* **Current Architecture:** Currently, all functionality is bundled in a monolithic Node.js backend.
* **Improved Architecture:** SlackConnect can be refactored into multiple microservices to separate concerns:

  * **Authentication Service** – Handles Slack OAuth flow.
  * **Scheduler Service** – Manages scheduling and cron jobs for posting messages.
  * **Message Service** – Responsible for sending messages to Slack channels.
  * **User Management Service** – Handles user and workspace details.
  * **Monitoring & Logging Service** – Tracks failures and system health.

This separation improves scalability, fault isolation, and developer productivity.

---

### 2. **Queue-Based Scheduling**

* **Current:** A background job runs every minute to query MongoDB for due messages.
* **Improved:** Use **message queues (like Redis + Bull or RabbitMQ)** to manage scheduled jobs in real-time with retry and delay support.

---

### 3. **Rate Limit Handling**

* Slack APIs have strict rate limits.
* Add retry queues with exponential backoff or token-bucket rate limiting to ensure Slack APIs are not overwhelmed.

---

### 4. **Admin Dashboard**

* Build an admin UI to:

  * View scheduled messages
  * Cancel or update pending ones
  * Monitor failures and stats
  * Manage connected Slack workspaces

---

### 5. **Real-Time Status Updates**

* Use **WebSockets or Server-Sent Events (SSE)** to notify users about the message delivery status (sent, failed, pending).

---

### 6. **Security Improvements**

* Encrypt sensitive tokens like `access_token`, `client_secret` using a secret vault or AWS KMS.
* Add rate limiting and logging on all API endpoints to prevent abuse.

---

### 7. **Analytics Dashboard**

* Show users:

  * Number of scheduled messages
  * Success/failure counts
  * User engagement stats

---

### 8. **Testing and CI/CD**

* Add unit, integration, and end-to-end tests.
* Automate deployments using CI/CD pipelines (GitHub Actions, Jenkins, etc).

## Support

For questions or support, please contact: [gauravyatwork@gmail.com](mailto:gauravyatwork@gmail.com)
