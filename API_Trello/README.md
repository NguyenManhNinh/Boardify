# Boardify API (Backend)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Boardify API is the backend service for the Boardify (Trello‑like) task management application.
It provides RESTful endpoints for authentication, boards, columns, cards, invitations and user profile.

> Frontend repository / folder: `trello-web/trello-web`
> See that folder’s `README.md` for UI details.

---

## Table of Contents

- [1. Tech Stack & Architecture](#1-tech-stack--architecture)
- [2. Features](#2-features)
- [3. Project Structure](#3-project-structure)
- [4. Getting Started](#4-getting-started)
- [5. Environment Variables](#5-environment-variables)
- [6. Run with Docker](#6-run-with-docker-optional)
- [7. API Overview](#7-api-overview)
- [8. Authentication Flow](#8-authentication-flow)
- [9. Development Notes](#9-development-notes)
- [10. Troubleshooting](#10-troubleshooting)
- [License](#license)

---

## 1. Tech Stack & Architecture

- **Node.js 18+**
- **Express.js** – HTTP server & routing
- **MongoDB** (local or MongoDB Atlas)
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication (access & refresh tokens)
- **Bcrypt** – Password hashing
- **Nodemailer** (via `EmailProvider`) – Email sending for:
  - Forgot password
  - Invitation links
- **Multer** – File uploads (attachments, avatar, etc.)
- **Docker** – Containerization (multi‑stage build)
- **ESLint / Babel** – Code style & ESNext transpiling

The application is layered:

- **Routes** (`src/routes`) – HTTP endpoints, versioned (`/v1`, `/v2`).
- **Controllers** (`src/controllers`) – Handle HTTP requests, validate input, call services.
- **Services** (`src/services`) – Business logic (auth, boards, cards, invitations, users).
- **Models** (`src/models`) – MongoDB schemas & data access.
- **Middlewares** (`src/middlewares`) – Auth, error handling, validation, etc.
- **Providers** (`src/providers`) – Email and other external integrations.
- **Config** (`src/config`) – env, DB, CORS, file upload.

---

## 2. Features

Backend supports:

- **Authentication**
  - Email/password register & login
  - JWT access & refresh tokens
  - Google OAuth 2.0 (login with Google)
  - Forgot password / reset password via email link

- **Boards**
  - CRUD boards
  - Favorite / starred boards
  - Background color & visibility
  - Templates (handled mostly on frontend, stored as boards once created)

- **Columns (Lists)**
  - Add / update / delete columns
  - Reorder columns in a board

- **Cards**
  - Add / update / delete cards
  - Move cards within a column or across columns
  - Description, labels, members, checklist, due date, attachments, cover image

- **Invitations**
  - Invite users to boards by email
  - Invitation tokens with expiry
  - Accept board invitations from email link

- **User & Profile**
  - Get current user profile
  - Update display name, avatar
  - Basic statistics for profile overview (boards count, completed cards, etc.)

---

## 3. Project Structure

```txt
API_Trello/
  src/
    config/
      cors.js           # CORS whitelist & middleware setup
      environment.js    # Load env variables, BUILD_MODE, etc.
      mongodb.js        # MongoDB connection
      multer.js         # Multer config for file uploads

    controllers/
      authController.js
      boardController.js
      cardController.js
      columnController.js
      invitationController.js
      userController.js

    middlewares/
      ...               # auth, error handler, validators

    models/
      boardModel.js
      cardModel.js
      columnModel.js
      invitationModel.js
      userModel.js

    providers/
      EmailProvider.js  # Sending emails (Nodemailer wrapper)
      exampleProvider.js

    routes/
      v1/
        authRoute.js
        boardRoute.js
        cardRoute.js
        columnRoute.js
        invitationRoute.js
        userRoute.js
        index.js        # combine v1 routes
      v2/
        ...             # reserved / future API version

    services/
      authService.js
      boardService.js
      cardService.js
      emailService.js
      invitationService.js
      userService.js

    sockets/
      ...               # prepared for real‑time features (if used)

    utils/
      ...               # helpers, constants

    validations/
      ...               # Joi / custom validators

    server.js           # Express app entry point

  uploads/              # uploaded files (covers, attachments, etc.)

  .env.example          # example env file (do NOT commit real .env)
  .env.backup
  Dockerfile
  docker-compose.yml    # (optional) local convenience for API only
  jsconfig.json
  package.json
  yarn.lock / package-lock.json
  SECURITY.md           # security notes
  migrate_boards.js     # migration scripts
  migrate_cards.js
  reset_password.js
  ...
Note: Environment files (.env, .env.local, etc.) are ignored by Git.
Copy from .env.example and fill in your own secrets.
4. Getting Started
4.1. Prerequisites
Node.js >= 18
npm or yarn
MongoDB instance:
Local MongoDB (mongodb://localhost:27017)
or MongoDB Atlas connection string
4.2. Install dependencies
bash
Copy code
cd API_Trello
cp .env.example .env   # create your env file
npm install            # or: yarn
4.3. Run in development mode
bash
Copy code
npm run dev
# or depending on your scripts:
# npm start
Typical dev config (from .env):
App host: 0.0.0.0
App port: 8017
Base URL: http://localhost:8017
API prefix: /v1
4.4. Build & run in production mode
bash
Copy code
npm run build       # transpile src -> build/src
npm run production  # or: node ./build/src/server.js
In logs you should see something like:
Server is running at 0.0.0.0:8017 and Connected to MongoDB.
5. Environment Variables
All sensitive values are loaded from .env.
This is a typical configuration (names may vary slightly in your project):
env
Copy code
# App
APP_HOST=0.0.0.0
APP_PORT=8017
BUILD_MODE=dev
AUTHOR=Your Name

# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=boardify

# JWT
JWT_SECRET=your_super_secret_key_change_this
ACCESS_TOKEN_LIFE=1h
REFRESH_TOKEN_LIFE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8017/v1/auth/google/callback

# Email (SMTP) - used for password reset & invitations
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password

# Frontend URL (for CORS, email links, redirects)
FRONTEND_URL=http://localhost:8080

# Invitations
INVITATION_TOKEN_EXPIRY_DAYS=7
Important:
Never commit real .env to Git.
When deploying (Render / VPS / etc.), set these as environment variables in your hosting panel.
FRONTEND_URL and CORS whitelist must include the real frontend domain.
6. Run with Docker (optional)
The Dockerfile is already configured with a multi‑stage build (build + run).
6.1. Build & run backend container
bash
Copy code
cd API_Trello
docker build -t boardify-api .
docker run -d --name boardify-api \
  --env-file .env \
  -p 8017:8017 \
  boardify-api
The API is now available at http://localhost:8017.
6.2. Using root docker-compose.yml (recommended)
If you use the root docker-compose.yml (which also starts MongoDB and frontend):
bash
Copy code
# from repository root (where docker-compose.yml lives)
docker-compose up -d --build

# Services:
# - API:       http://localhost:8017
# - Frontend:  http://localhost:8080
# - MongoDB:   mongodb://mongo:27017
7. API Overview
All endpoints are versioned and grouped under /v1. Base URL (dev):
txt
Copy code
http://localhost:8017/v1
7.1. Auth Routes (/v1/auth)
Typical endpoints:
POST /auth/register – Register with email & password
POST /auth/login – Login, returns access & refresh tokens
GET /auth/profile – Get current user profile (requires JWT)
POST /auth/refresh-token – Refresh access token (if implemented)
POST /auth/forgot-password – Send password reset email
POST /auth/reset-password – Reset password with token
GET /auth/google – Get Google OAuth URL / start login
GET /auth/google/callback – OAuth callback (Google → API)
7.2. Board Routes (/v1/boards)
GET /boards – List boards of current user
POST /boards – Create new board
GET /boards/:id – Get board detail (columns & cards)
PUT /boards/:id – Update board info
DELETE /boards/:id – Delete board
7.3. Column Routes (/v1/columns)
POST /columns – Create new column
PATCH /columns/:id – Update column (title, order)
DELETE /columns/:id – Delete column
7.4. Card Routes (/v1/cards)
POST /cards – Create new card
PATCH /cards/:id – Update card fields
DELETE /cards/:id – Delete card
Additional endpoints may handle:
move card (column / position)
checklist / labels / members / due date
7.5. Invitation Routes (/v1/invitations)
POST /invitations/boards/:boardId – Invite user via email
GET /invitations/accept – Accept invitation using token (used by /accept-invite frontend page)
7.6. User Routes (/v1/users)
GET /users/me – Current user
PATCH /users/me – Update profile
Additional profile / stats endpoints (for profile overview page)
For exact request/response formats, check the controllers & services in src/controllers and src/services.
8. Authentication Flow
Register
POST /v1/auth/register with email, username, displayName, password.
User stored in MongoDB with hashed password.
Login
POST /v1/auth/login with email & password.
On success: returns JWT access token (and optionally refresh token).
Frontend stores tokens (e.g. HTTP‑only cookie / local storage).
Authenticated Requests
Every protected endpoint expects header:
http
Copy code
Authorization: Bearer <access_token>
Token Expiry
When access token expires, frontend may:
Call refresh endpoint (if implemented), or
Redirect user back to login.
Google Login
Frontend calls /v1/auth/google → API returns Google auth URL.
User logs in with Google → Google redirects to /v1/auth/google/callback.
API exchanges code for profile & email, then:
Creates user (if first time), or
Re‑uses existing account.
Returns JWT tokens, frontend redirects to boards page.
Forgot / Reset Password
POST /v1/auth/forgot-password with email.
API sends email with reset link including a token.
Frontend reset page calls /v1/auth/reset-password with token + new password.
9. Development Notes
Env / Config
src/config/environment.js reads .env and exposes config.
src/config/cors.js controls allowed origins.
Make sure FRONTEND_URL and the actual domain are in the whitelist array.
Error Handling
Express error‑handling middleware returns JSON responses with appropriate HTTP status codes.
Use try/catch in controllers and forward errors to next(err).
Validation
src/validations contains request validators (e.g. Joi / custom).
Apply validation middleware in routes before hitting controllers.
Migrations & Utilities
Scripts like migrate_boards.js, migrate_cards.js, reset_password.js are CLI helpers.
Do not run them in production unless you know exactly what they do.
Security
Keep JWT_SECRET strong & private.
Use Gmail App Password (not your real password) if you use Gmail SMTP.
Consider rate limiting & helmet middleware for a real production deployment.
10. Troubleshooting
API not starting / MongoDB error
Check .env:
MONGODB_URI points to a running MongoDB instance.
DATABASE_NAME is valid.
If using Docker, ensure mongo container is up (docker ps).
CORS error from frontend
Make sure FRONTEND_URL is set correctly in .env.
Ensure that same URL is added to whitelist in src/config/cors.js.
Restart API after changing env/CORS.
Google Login not working
In Google Cloud Console:
Authorized JavaScript origins: set to your frontend URL
e.g. http://localhost:8080 or https://your-frontend-domain.com
Authorized redirect URIs: set to your backend callback
e.g. http://localhost:8017/v1/auth/google/callback or production domain.
GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env must match.
Password reset emails not sent
Check SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
For Gmail:
Use an App Password, not your regular account password.
Check server logs for errors thrown by EmailProvider.
