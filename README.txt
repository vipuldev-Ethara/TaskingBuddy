================================================================================
  TASKINGBUDDY — Team Task Manager
  Project Submission Details
================================================================================

------------------------------------------------------------------------
1. LIVE APPLICATION URL
------------------------------------------------------------------------

  Frontend (Web App):
  https://frontend-production-20219.up.railway.app

  Backend API:
  https://taskingbuddy-production.up.railway.app/api/

  Django Admin Panel:
  https://taskingbuddy-production.up.railway.app/admin/

------------------------------------------------------------------------
2. GITHUB REPOSITORY LINK
------------------------------------------------------------------------

  https://github.com/vipuldev-Ethara/TaskingBuddy

------------------------------------------------------------------------
3. DEFAULT LOGIN CREDENTIALS (for testing)
------------------------------------------------------------------------

  Admin Account:
    Email   : admin@example.com
    Password: admin123

  Note: Login at https://frontend-production-20219.up.railway.app/login

------------------------------------------------------------------------
4. PROJECT OVERVIEW
------------------------------------------------------------------------

TaskingBuddy is a production-ready Full Stack Team Task Manager Web
Application with role-based access control for Admin and Member users.

------------------------------------------------------------------------
5. KEY FEATURES
------------------------------------------------------------------------

  - Role-Based Authentication  : JWT-based login with Admin / Member roles
  - Dashboard Analytics        : Project stats, task counts, activity feed
  - Project Management (Admin) : Create, edit, delete projects
  - Team Management (Admin)    : Add/remove team members, assign roles
  - Kanban Board               : Drag-free task management (To Do, In Progress, Done)
  - Task Assignment            : Assign tasks to project members
  - Task Charts                : Donut chart + bar chart showing task breakdown
  - Dark / Light Mode          : Full theme toggle
  - Responsive Design          : Works on desktop and mobile

------------------------------------------------------------------------
6. TECH STACK
------------------------------------------------------------------------

  Backend:
    - Python 3.12
    - Django 5.x
    - Django REST Framework
    - Simple JWT (Authentication)
    - PostgreSQL (Production via Railway)
    - SQLite (Local Development)
    - Gunicorn (WSGI Server)
    - WhiteNoise (Static Files)

  Frontend:
    - React 19
    - Vite 5
    - Tailwind CSS v3
    - Axios
    - React Router DOM v7
    - Lucide React (Icons)
    - Context API (State Management)

  Deployment:
    - Railway.app (Backend + Frontend)
    - GitHub (Source Control + Auto-Deploy)
    - Nixpacks (Build System)

------------------------------------------------------------------------
7. LOCAL DEVELOPMENT SETUP
------------------------------------------------------------------------

  Step 1 — Clone the Repository
  --------------------------------
  git clone https://github.com/vipuldev-Ethara/TaskingBuddy.git
  cd TaskingBuddy

  Step 2 — Backend Setup
  --------------------------------
  cd backend
  python -m venv venv

  # Activate virtual environment:
  # Windows : venv\Scripts\activate
  # Mac/Linux: source venv/bin/activate

  pip install -r requirements.txt
  python manage.py migrate
  python manage.py seed_data       # Creates admin + sample data
  python manage.py runserver       # Starts at http://localhost:8000

  Step 3 — Frontend Setup
  --------------------------------
  cd frontend
  npm install
  npm run dev                      # Starts at http://localhost:5173

------------------------------------------------------------------------
8. ENVIRONMENT VARIABLES (Production)
------------------------------------------------------------------------

  Backend (Railway Service):
    DJANGO_SETTINGS_MODULE  = config.settings.production
    DJANGO_SECRET_KEY       = <strong-random-key>
    DATABASE_URL            = <auto-injected by Railway PostgreSQL>
    CORS_ALLOWED_ORIGINS    = https://frontend-production-20219.up.railway.app

  Frontend (Railway Service):
    VITE_API_URL            = https://taskingbuddy-production.up.railway.app/api

------------------------------------------------------------------------
9. API DOCUMENTATION
------------------------------------------------------------------------

  Base URL : https://taskingbuddy-production.up.railway.app/api/

  Auth Endpoints:
    POST /api/auth/login/          — Login (returns JWT tokens)
    POST /api/auth/register/       — Register new user
    POST /api/auth/logout/         — Logout (blacklists token)
    GET  /api/auth/profile/        — Get current user profile
    GET  /api/auth/users/          — List all users (auth required)
    POST /api/auth/users/invite/   — Admin: create new member

  Project Endpoints:
    GET    /api/projects/               — List all projects
    POST   /api/projects/               — Create project (admin)
    GET    /api/projects/{id}/          — Project detail
    PUT    /api/projects/{id}/          — Update project (admin)
    DELETE /api/projects/{id}/          — Delete project (admin)
    POST   /api/projects/{id}/add-member/    — Add member
    POST   /api/projects/{id}/remove-member/ — Remove member

  Task Endpoints:
    GET    /api/tasks/              — List tasks
    POST   /api/tasks/              — Create task (admin)
    GET    /api/tasks/{id}/         — Task detail
    PUT    /api/tasks/{id}/         — Update task
    DELETE /api/tasks/{id}/         — Delete task (admin)
    PATCH  /api/tasks/{id}/status/  — Update status only

  Dashboard Endpoints:
    GET /api/dashboard/stats/       — Summary stats
    GET /api/dashboard/activity/    — Recent activity log

================================================================================
  END OF DOCUMENT
================================================================================
