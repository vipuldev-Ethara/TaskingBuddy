# TaskingBuddy — Team Task Manager

> A production-ready Full Stack Team Task Manager built with Django REST Framework + React (Vite) + Tailwind CSS, deployed on Railway.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-blueviolet?logo=railway)](https://frontend-production-20219.up.railway.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Railway-blueviolet?logo=railway)](https://taskingbuddy-production.up.railway.app/api/)
[![GitHub](https://img.shields.io/badge/GitHub-TaskingBuddy-black?logo=github)](https://github.com/vipuldev-Ethara/TaskingBuddy)

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| **Frontend (Web App)** | https://frontend-production-20219.up.railway.app |
| **Backend API** | https://taskingbuddy-production.up.railway.app/api/ |
| **Django Admin** | https://taskingbuddy-production.up.railway.app/admin/ |

### 🔑 Default Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin123` |

---

## ✨ Features

- **Role-Based Authentication** — JWT-based login with `Admin` and `Member` roles
- **Dashboard Analytics** — Project stats, task counts, productivity trends, and activity logs
- **Project Management** — Create, edit, delete projects and assign team members (Admin only)
- **Task Management** — Create, assign, and track tasks with priority levels
- **Kanban-style Board** — Organize tasks by status: `To Do → In Progress → Done`
- **Advanced Filtering** — Filter tasks by status, priority, and due date
- **Task Charts** — Donut chart + bar chart for task breakdown visualization
- **Team Management** — Invite members, assign roles, manage project access (Admin only)
- **Email Notifications** — Notify members when assigned a new task
- **Dark / Light Mode** — Full theme toggle with system preference detection
- **Responsive Design** — Fully responsive across desktop and mobile

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3.12 | Runtime |
| Django 5.x | Web Framework |
| Django REST Framework | REST API |
| Simple JWT | Authentication |
| PostgreSQL | Production Database (Railway) |
| SQLite | Local Development Database |
| Gunicorn | WSGI Production Server |
| WhiteNoise | Static File Serving |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS v3 | Styling |
| Axios | HTTP Client |
| React Router DOM v7 | Client-side Routing |
| Lucide React | Icon Library |
| Context API | State Management |
| Chart.js / React-Chartjs-2 | Data Visualization |

### Deployment
| Technology | Purpose |
|---|---|
| Railway.app | Hosting (Backend + Frontend) |
| GitHub | Source Control + Auto-Deploy |
| Nixpacks | Build System |

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/vipuldev-Ethara/TaskingBuddy.git
cd TaskingBuddy
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed sample data (creates admin user + sample projects/tasks)
python manage.py seed_data

# Start development server
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

> **Seeded admin credentials:** `admin@example.com` / `admin123`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_SECRET_KEY=your-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### Production (Railway)

**Backend Service:**
```
DJANGO_SETTINGS_MODULE = config.settings.production
DJANGO_SECRET_KEY      = <strong-random-key>
DATABASE_URL           = <auto-injected by Railway PostgreSQL addon>
CORS_ALLOWED_ORIGINS   = https://frontend-production-20219.up.railway.app
```

**Frontend Service:**
```
VITE_API_URL = https://taskingbuddy-production.up.railway.app/api
```

See `.env.example` in the root for a full reference.

---

## 📡 API Reference

**Base URL:** `https://taskingbuddy-production.up.railway.app/api/`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login/` | Login — returns JWT access + refresh tokens |
| `POST` | `/auth/register/` | Register a new user |
| `POST` | `/auth/logout/` | Logout — blacklists the refresh token |
| `GET` | `/auth/profile/` | Get current user's profile |
| `GET` | `/auth/users/` | List all users (auth required) |
| `POST` | `/auth/users/invite/` | Admin: create a new team member |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/` | List all accessible projects |
| `POST` | `/projects/` | Create a new project (Admin) |
| `GET` | `/projects/{id}/` | Get project detail |
| `PUT` | `/projects/{id}/` | Update project (Admin) |
| `DELETE` | `/projects/{id}/` | Delete project (Admin) |
| `POST` | `/projects/{id}/add-member/` | Add a member to project |
| `POST` | `/projects/{id}/remove-member/` | Remove a member from project |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks/` | List tasks (filtered by role) |
| `POST` | `/tasks/` | Create a new task (Admin) |
| `GET` | `/tasks/{id}/` | Get task detail |
| `PUT` | `/tasks/{id}/` | Update task |
| `DELETE` | `/tasks/{id}/` | Delete task (Admin) |
| `PATCH` | `/tasks/{id}/status/` | Update task status only |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats/` | Get summary statistics |
| `GET` | `/dashboard/activity/` | Get recent activity log |

---

## 🗂 Project Structure

```
TaskingBuddy/
├── backend/
│   ├── apps/
│   │   ├── authentication/   # User auth, JWT, roles
│   │   ├── projects/         # Project CRUD + membership
│   │   ├── tasks/            # Task CRUD + status management
│   │   └── dashboard/        # Stats + activity feed
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py       # Shared settings
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── Procfile              # Gunicorn start command
│   └── nixpacks.toml         # Railway build config
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios API clients
│   │   ├── contexts/         # Auth, Theme, Toast contexts
│   │   ├── layouts/          # Sidebar, Header, DashboardLayout
│   │   └── pages/            # All page components
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env.example
├── API_DOCS.md
└── README.md
```

---

## 🚢 Railway Deployment

This project is configured as a **monorepo** with two separate Railway services:

1. **Backend Service** — root directory: `backend/`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn config.wsgi:application`
   - Add a PostgreSQL addon and set required env vars

2. **Frontend Service** — root directory: `frontend/`
   - Build: `npm install && npm run build`
   - Serve: `npm run preview` (or serve the `dist/` folder)

Railway auto-deploys on every push to the `master` branch via GitHub integration.

---

## 📄 License

This project is for educational and demonstration purposes.

---

*Built with ❤️ using Django + React | Deployed on Railway*
