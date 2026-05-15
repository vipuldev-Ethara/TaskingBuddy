# Team Task Manager

A production-ready Full Stack Team Task Manager Web Application built with Django, Django REST Framework, React (Vite), and Tailwind CSS.

## Features
- **Role-based Authentication**: JWT-based auth with Admin and Member roles.
- **Modern SaaS UI**: Glassmorphism cards, dark/light mode toggle, responsive design.
- **Dashboard Analytics**: Overview of projects, tasks, productivity trends, and activity logs.
- **Project Management**: Create, edit, delete projects and assign team members.
- **Task Kanban Board**: Organize tasks by status (To Do, In Progress, Completed).
- **Advanced Filtering**: Filter tasks by status, priority, and due dates.
- **Email Notifications**: Get notified when assigned a new task.

## Tech Stack
- **Backend**: Django 5.x, Django REST Framework, SQLite (dev), PostgreSQL (prod)
- **Frontend**: React 18, Vite, Tailwind CSS v3, Axios, Context API, React Router DOM
- **Deployment**: Configured for Railway deployment via Nixpacks.

## Local Development Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Team Task Manager"
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt

# Run migrations
python manage.py makemigrations authentication projects tasks dashboard
python manage.py migrate

# Seed dummy data
python manage.py seed_data

# Start dev server
python manage.py runserver
```
*Note: The seeded admin user is `admin@example.com` with password `admin123`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment
The repository is structured as a monorepo for easy deployment on Railway.

1. **Backend**: Create a new service on Railway pointing to the `backend/` directory. Set `DATABASE_URL` and `DJANGO_SECRET_KEY` env variables. The `railway.json` and `Procfile` are already configured.
2. **Frontend**: Create a new static site service pointing to the `frontend/` directory. The `railway.json` handles the build command.

See `API_DOCS.md` for detailed API endpoints.
