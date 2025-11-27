# Boardify – Trello-like Task Management (MERN, Docker)

> Full-stack Kanban board application inspired by Trello.  
> Built with **MERN stack** (MongoDB, Express, React, Node.js) and packaged via **Docker**.

![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-B73C9D?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/UI-MUI-0081CB?logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/State-Redux%20Toolkit-593D88?logo=redux&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/DevOps-Docker-0db7ed?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Run with Docker (recommended)](#run-with-docker-recommended)
   - [Run locally without Docker](#run-locally-without-docker)
7. [Environment Variables](#environment-variables)
8. [Screenshots](#screenshots)
9. [Roadmap / TODO](#roadmap--todo)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contact](#contact)

---

## Overview

Boardify is a Trello-style productivity app that helps you:

- Organize work into **boards**, **lists (columns)** and **cards**
- Collaborate with teammates via **members, labels, checklists, due dates**
- Track progress visually using **drag & drop** on a Kanban board
- Log in with **email/password** or **Google OAuth**
- Recover access via **forgot password** email flow

This repository is a **monorepo** that contains **both backend and frontend**.

---

## Architecture

High-level architecture:

```text
[ React + Vite (MUI, Redux) ]  <--->  [ Express API ]  <--->  [ MongoDB ]
              ^                                   ^
              |                                   |
        Google OAuth                        Nodemailer
           (client)                        (reset password,
                                            invitations)
Frontend calls the REST API via Axios.

Backend handles auth, boards, columns, cards, invitations, etc.

MongoDB stores users, boards, columns, cards, activities…

Docker Compose starts: MongoDB + API + Web in one command.

Tech Stack
Frontend
React 18 + Vite

React Router v6

Redux Toolkit

Material UI (MUI) + Emotion

@dnd-kit (drag & drop)

Axios

Nginx (for production build)

Details: see trello-web/trello-web/README.md

Backend
Node.js, Express

MongoDB & Mongoose

JWT (access + refresh tokens)

Google OAuth 2.0

Nodemailer (SMTP / Gmail) for emails

Joi / custom validation middlewares

Socket.io (optional, for realtime)

(You can add a dedicated API_Trello/README.md later to document all endpoints.)

Features
Authentication & Security
Register / login with email & password

Login with Google (OAuth 2.0)

Protected routes with JWT (access + refresh)

Forgot password via email link

Reset password screen (new password + confirm)

Basic profile & security settings

Boards & Collaboration
Create / update / delete boards

Board templates (e.g., Sprint board, Study plan, Marketing campaign, etc.)

Invite members to boards via email

Role: board members vs. non-members (UI level)

Kanban Board
Columns (To do / Doing / Done…) with custom titles

Cards inside columns

Drag & drop:

Reorder columns

Move cards inside the same column

Move cards between columns

Card Details
Description (rich text-like UX)

Labels (colored tags)

Members (assign people to card)

Checklists with progress

Due date & completion status

Attachments & card cover

Comment / activity history (UI)

User Experience
Empty state onboarding (when user has no boards)

Keyboard shortcuts modal

Light / Dark mode switch

Notifications dropdown (UI)

Profile overview with stats and recent activity

Project Structure
text
Copy code
Boardify/
  API_Trello/            # Backend (Express + MongoDB)
    src/
      config/            # environment, CORS, MongoDB
      controllers/       # auth, board, column, card, user, invitation
      middlewares/       # auth, validation, error handlers
      models/            # Mongoose schemas
      services/          # business logic
      routes/
        v1/              # REST endpoints (/v1/auth, /v1/boards, ...)
      utils/             # constants, helpers
      server.js
    .env.example
    Dockerfile
    ...

  trello-web/            # Frontend root
    trello-web/
      src/
        apis/            # Axios instance & API helpers
        components/      # AppBar, Board, Modals, Profile, ...
        pages/           # Auth, Boards, Profile, AcceptInvite, ...
        redux/           # Redux slices & store
        services/        # boardsService, profileService, ...
        utilities/       # boardTemplates, constants, formatters, ...
        App.jsx
        main.jsx
      Dockerfile
      vite.config.ts
      nginx.conf
      .env.example
      ...

  docker-compose.yml     # Run Mongo + API + Web together
  README.md              # This file
Getting Started
Run with Docker (recommended)
Requirements: Docker & Docker Compose

Clone the repository:

bash
Copy code
git clone https://github.com/NguyenManhNinh/Boardify.git
cd Boardify
Create environment files:

bash
Copy code
# Backend
cd API_Trello
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, SMTP, Google keys...

# Frontend
cd ../trello-web/trello-web
cp .env.example .env.local
# Edit VITE_API_ROOT, VITE_GOOGLE_CLIENT_ID, etc.

# Back to project root
cd ../../
Start all services:

bash
Copy code
docker-compose up -d --build
Open in browser:

Frontend: http://localhost:8080

API: http://localhost:8017

Stop:

bash
Copy code
docker-compose down
Run locally without Docker
Backend (API_Trello)
bash
Copy code
cd API_Trello
npm install
cp .env.example .env      # then edit values
npm run dev               # or: npm start
# API -> http://localhost:8017
Frontend (trello-web)
bash
Copy code
cd trello-web/trello-web
npm install
cp .env.example .env.local
# In .env.local, set VITE_API_ROOT=http://localhost:8017
npm run dev
# Vite dev server -> http://localhost:5173
Environment Variables
Backend (API_Trello/.env)
Typical variables (names may differ slightly in your project):

env
Copy code
# Database
MONGODB_URI=mongodb://mongo:27017/boardify
DATABASE_NAME=boardify

# Server
APP_HOST=0.0.0.0
APP_PORT=8017
BUILD_MODE=dev

# JWT
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_LIFE=1h
REFRESH_TOKEN_LIFE=7d

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8017/v1/auth/google/callback

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8080
Frontend (trello-web/trello-web/.env.local)
env
Copy code
VITE_APP_NAME=Boardify
VITE_API_ROOT=http://localhost:8017
VITE_GOOGLE_CLIENT_ID=your_google_client_id
Screenshots
You can replace these placeholders with real screenshots from your app.
Auth	Empty Boards
Board	Card Detail
Roadmap / TODO
Some ideas for future improvements:
 Realtime updates for boards & cards using Socket.io
 Comments & activity log persisted per card
 Board / card search engine
 Tag / label management page
 Export board as JSON / CSV
 Unit tests (Jest / React Testing Library)
 E2E tests (Cypress / Playwright)
Contributing
Contributions are welcome!
Fork the repository
Create a feature branch: git checkout -b feature/my-feature
Commit your changes: git commit -m "Add my feature"
Push to your fork: git push origin feature/my-feature
Open a Pull Request
License
This project is licensed under the MIT License.
Contact
Author: Nguyen Manh Ninh
GitHub: @NguyenManhNinh
Feel free to open an issue or reach out if you have questions about the project.
yaml
Copy code
---
### Tóm tắt lại cho bạn
1. Mở `Boardify/README.md`  
2. Dán nguyên block markdown ở trên vào → lưu file  
3. Commit & push:
```bash
git add README.md
git commit -m "Write full GitHub-style README for Boardify"
git push
