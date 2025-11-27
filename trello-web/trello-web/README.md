# Boardify Web (Frontend)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73C9D?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Boardify Web is the frontend of a Trello‑like task management application.

## Table of Contents

- [1. Tech Stack](#1-tech-stack)
- [2. Project Structure](#2-project-structure)
- [3. Getting Started](#3-getting-started)
- [4. Run with Docker](#4-run-with-docker-optional)
- [5. Main User Flows](#5-main-user-flows-ux-overview)
- [6. Development Notes](#6-development-notes)
- [7. Troubleshooting](#7-troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 📸 Screenshots

*(Add your application screenshots here to showcase the UI.)*

| Board View | Card Detail |
| :--------: | :---------: |
| ![Board View](https://via.placeholder.com/600x400?text=Board+View) | ![Card Detail](https://via.placeholder.com/600x400?text=Card+Detail) |

Main user flows:

- Sign up / Sign in with email & password
- Google Sign‑in
- Forgot password & reset password via email link
- “Empty state” onboarding with templates when the user has no boards
- Board view with columns & cards, drag‑and‑drop
- Detailed card modal: description, labels, members, checklist, due date, cover, attachments
- Board filters, simple automations, Google Drive integration (UI)
- User profile with overview stats, quick actions, security & settings

---

## 1. Tech Stack

- **React 18**
- **Vite**
- **React Router v6**
- **Redux Toolkit** (board, card, notifications, automation slices)
- **Material UI (MUI)** + Emotion
- **Axios** for API calls
- **@dnd-kit** (drag & drop for cards & columns)
- **Docker** (multi‑stage build + Nginx)

---

## 2. Project Structure

```txt
trello-web/
  trello-web/
    src/
      apis/
        index.js             # Axios instance & interceptors
        mock-data.js         # Local mock data (if used)

      assets/                # Illustration images, logos, SVGs

      components/
        AppBar/              # Top navigation bar
          Menus/
            MyBoards.jsx
            Recent.jsx
            Starred.jsx
            WordSpaces.jsx
            TemplatesMenu.jsx
            Notifications.jsx
          HelpDialog.jsx
          SearchResults.jsx
          UserMenu.jsx
          AppBar.jsx

        Auth/
          AuthLayout.jsx      # Shared layout for auth pages
          AuthPage.jsx        # Login / register tabs

        Board/
          Automation/         # Automation dialog
          Filter/             # Filter dialog
          CreateBoardDialog.jsx
          CreateBoardFromTemplateDialog.jsx
          InviteMemberDialog.jsx

        BoardBar/             # Bar inside board page (board name, controls)

        Modal/
          ActiveCard/
            CardSections/     # Description, Checklist, DueDate, Labels, Members, Attachments, ...
            ActiveCardModal.jsx
            AddChecklistPopover.jsx
            AttachmentList.jsx
            CardCover.jsx
            Checklist.jsx
            CommentSection.jsx
            CoverSelector.jsx
            DueDatePicker.jsx
            LabelPicker.jsx
            MemberPicker.jsx

        ModeSelect/
          ModeSelect.jsx      # Light / Dark theme switch

        ShortcutsModal/
          ShortcutsModal.jsx  # Keyboard shortcuts help

        customHooks/
          index.js
          useAuthContext.jsx

        hooks/
          useCardUpdate.js    # Encapsulates card update logic

      pages/
        Auth/
          index.jsx           # Route wrapper for /auth/*
          ForgotPassword.jsx
          ResetPassword.jsx
          AuthCallback.jsx    # Google OAuth callback handler

        Boards/
          BoardBar.jsx
          BoardContent/
            ListColumns/
              Column/
                ListCards/
            EmptyBoardsHero.jsx  # “Start with your first board” screen
          BoardsList.jsx         # List of user's boards
          _id.jsx
          index.jsx              # Board detail page entry

        Profile/
          ProfilePage.jsx
          ProfileOverviewStats.jsx
          ProfileQuickActions.jsx
          ProfileRecentActivity.jsx
          ProfileSettings.jsx
          ProfileSecurity.jsx

        AcceptInvite/
          AcceptInvite.jsx       # Accept board invitations from email link

      redux/
        activeCard/
          activeCardSlice.js
        automation/
          automationSlice.js
        board/
          boardSlice.js
          boardFilterSlice.js
        notifications/
          notificationsSlice.js
        store.js

      services/
        boardsService.js
        profileService.js

      utilities/
        boardTemplates.js    # Sample board templates (Kanban, Study Plan, Marketing, etc.)
        constans.js          # App‑wide constants (API root, configs)
        formatters.js
        recentBoards.js
        sorts.js
        starredBoards.js

      App.jsx
      main.jsx
      theme.js               # MUI theme configuration

    .env.example
    .env.local               # Local env (ignored by Git)
    Dockerfile
    nginx.conf
    vite.config.ts
    package.json
3. Getting Started
3.1. Prerequisites
Node.js ≥ 18
npm or yarn
Backend API running (Boardify API) – default: http://localhost:8017
3.2. Install Dependencies
bash
Copy code
cd trello-web/trello-web
cp .env.example .env.local   # or create .env.local manually
npm install                  # or: yarn
3.3. Configure Environment Variables
Edit .env.local:
env
Copy code
# App
VITE_APP_NAME=Boardify

# Backend API root (no trailing slash)
VITE_API_ROOT=http://localhost:8017

# Google OAuth client ID (optional – for Google login)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
3.4. Run in Development Mode
bash
Copy code
npm run dev
# Vite dev server -> http://localhost:5173 by default
If you use Docker & docker-compose, the frontend is usually exposed as http://localhost:8080.
3.5. Build for Production
bash
Copy code
npm run build    # Output to dist/
npm run preview  # Test production build locally
4. Run Frontend with Docker (optional)
The multi‑stage build is already configured in Dockerfile:
Stage 1: Build React app with Vite.
Stage 2: Serve static files with Nginx (using nginx.conf).
Build & run manually:
bash
Copy code
cd trello-web/trello-web
docker build -t boardify-web .
docker run -d --name boardify-web -p 8080:80 boardify-web
Or using the root docker-compose.yml (recommended during development):
bash
Copy code
# from repo root
docker-compose up -d --build

# Frontend: http://localhost:8080
# Backend : http://localhost:8017
5. Main User Flows (UX Overview)
5.1. Authentication
Sign up
Fields: email, username, display name, password, confirm password
Inline validation (red error text, helper text such as “ít nhất 3 ký tự”, “ít nhất 6 ký tự”)
Hint: “Use an email you check often to recover your password.”
Sign in
Email + password
“Remember me” checkbox
“Forgot password?” link → ForgotPassword page
“Continue with Google” button (optional)
Forgot / Reset password
Enter registered email → show neutral message:
“If your email is valid, we’ve sent you a link to reset the password.”
Reset form: new password + confirm password
Auth callback (Google)
Handle code from Google
Call backend to exchange tokens
Redirect to boards page after success
5.2. Boards & Empty State
If the user has no boards:
Show EmptyBoardsHero:
Mini example sprint board
Greeting with user name
Bullet points:
“Tạo board trong 10 giây”
“Giao việc, đặt hạn, nhắc lịch”
“Đồng bộ Google Drive & nhãn màu”
Two primary buttons:
Create your first board
Choose from template
BoardsList page
Grid of board tiles (background color, title)
“Create board” button at top right
Create Board Dialog
Board title, background color, visibility (private/public), optional description
Create Board From Template
Templates from boardTemplates.js:
Kanban, Project management, Study plan, Personal goals, Weekly planner, Marketing campaign, etc.
5.3. Board View & Drag‑and‑Drop
Columns represent stages (e.g. Cần làm, Đang làm, Hoàn thành). Each card shows:
Title
Label badges
Member avatars
Checklist progress, due date status, etc.
Drag & drop:
Reorder columns
Move cards within a column
Move cards between columns
5.4. Card Detail Modal
ActiveCardModal contains multiple sections (CardSections):
Card title & board / column breadcrumb
Description editor
Checklists
Multiple checklists with progress
Add / remove checklist items
Labels
Color tags, quick add / remove
Members
Add / remove members from board member list
Due date
Pick date & time, mark as completed
Attachments
Upload files / images
Set an image as card cover (CoverSelector)
Activity
Comments & recent actions summary
Right sidebar buttons (quick actions):
Card cover
Members
Labels
Checklist
Due date
Attachment
5.5. AppBar (Top Navigation)
Logo + app name
Menus
“My boards”
“Recent boards”
“Starred boards”
“Templates”
Actions
Save to Google Drive (UI integration)
Automation dialog (rules / quick automations)
Filter (by text, labels, members, due date)
Mode (Light / Dark)
Notifications
Help (opens HelpDialog with usage tips)
User menu
Profile
Keyboard shortcuts
Log out
5.6. Profile Pages
Overview
Cards with: number of boards, completed cards, lists, active items
Recent activity feed
Quick actions (create board, open recent boards)
Settings
Display name, avatar, contact info (optional)
Security
Change password
Login & session information
Security hints (2FA UI, etc.)
6. Development Notes
Global Redux store is defined in redux/store.js.
API base URL is taken from VITE_API_ROOT defined in .env.local.
All network calls should go through apis/index.js or services/*Service.js.
Theming
Custom MUI theme is defined in theme.js.
Mode switch is integrated in the ModeSelect component.
When modifying board / card logic
Update both UI components and Redux slices (boardSlice, activeCardSlice, etc.).
Keep drag‑and‑drop indices in sync with backend ordering.
7. Troubleshooting
Frontend cannot reach API
Check VITE_API_ROOT in .env.local.
Verify backend is running on that URL.
Check browser DevTools → Network for CORS errors.
Google login pop‑up closes with error
Verify Google Cloud Console configuration:
Authorized JavaScript origin = frontend URL
Authorized redirect URI = backend /v1/auth/google/callback
Ensure VITE_GOOGLE_CLIENT_ID matches the backend config.
Board or card actions cause full page reload
Make sure <form> elements call event.preventDefault().
Use React Router <Link> or navigate() instead of <a href> for internal routes.
Contributing
Contributions are always welcome!
Fork the repository.
Create a new branch (git checkout -b feature/improve-feature).
Commit your changes (git commit -am "Add some feature").
Push to the branch (git push origin feature/improve-feature).
Create a new Pull Request.