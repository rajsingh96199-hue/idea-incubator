InnoBridge – Idea Incubation Platform

A role-based full-stack web application that connects Students, Mentors, and Investors through a structured idea submission, evaluation, and investment workflow.

Built with a clear separation between frontend and backend using a three-tier architecture.

- Tech Stack

Frontend

React (Vite)

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

JWT Authentication

bcrypt (Password Hashing)

Database

MySQL (mysql2)

- Core Capabilities

Role-based authentication (Student / Mentor / Investor)

Secure JWT-based authorization

Idea submission and mentor approval workflow

Investor interest tracking system

Notification management

REST-based chat functionality

Protected API routes with middleware

System Architecture
Client (React) → REST API (Express) → MySQL Database

Three-tier architecture with clear separation of concerns.

-Local Setup
Start Backend
npm install
node Backend/server.js
Start Frontend
cd Frontend
npm install
npm run dev

Frontend: http://localhost:5173

Backend: http://localhost:5000

-Future Enhancements

WebSocket-based real-time communication

AI-driven idea evaluation

Funding & investment tracking module

Admin dashboard

This version does 3 things well:

Shows architecture maturity

Highlights security practices

Avoids unnecessary explanation
