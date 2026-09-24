# Task Tracker

A full-stack task and time tracking application that allows users to manage tasks, track time in real time, and monitor their daily productivity.

## Features

- User authentication with Clerk
- Create, view, edit, and delete tasks
- Task status management
  - Pending
  - In Progress
  - Completed
- Real-time task timer
- Start and stop time tracking sessions
- Time log history for each task
- Daily productivity summary
- AI-powered task generation using Gemini
- User-specific task and time data
- Protected API routes
- Input validation and error handling
- Responsive UI

## Tech Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- shadcn/ui
- Axios

### Backend
- Next.js API Routes
- Node.js
- MongoDB
- Mongoose
- Zod

### Authentication
- Clerk

### AI
- Google Gemini API

### Deployment
- Vercel


## Local Setup

### Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* Git
* MongoDB Atlas account
* Clerk account
* Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/MohdFahad1/task-tracker.git
cd task-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

### Test Users

The following test accounts are available for evaluation:

| Email | Password |
|---|---|
| test@example.com | Testuser@123456 |
| test2@example.com | TestUser@123456 |

## Live Link
[Live Link](https://task-tracker-ai-app.vercel.app/)

