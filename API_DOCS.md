# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

### `POST /auth/register/`
Register a new user.
- **Body**: `first_name`, `last_name`, `email`, `password`, `password_confirm`

### `POST /auth/login/`
Login and get JWT tokens.
- **Body**: `email`, `password`
- **Response**: `access`, `refresh`, `user`

### `POST /auth/login/refresh/`
Refresh access token.
- **Body**: `refresh`

### `POST /auth/logout/`
Blacklist refresh token.
- **Body**: `refresh_token`

### `GET /auth/profile/`
Get current user profile.

### `PUT /auth/profile/`
Update profile.
- **Body**: `first_name`, `last_name`, `phone`, `bio`

## Projects

### `GET /projects/`
List projects (filtered by user membership).

### `POST /projects/` (Admin only)
Create a new project.
- **Body**: `title`, `description`, `deadline`, `status`, `members` (array of user IDs)

### `GET /projects/:id/`
Get project details.

### `POST /projects/:id/add-member/` (Admin only)
- **Body**: `user_id`

## Tasks

### `GET /tasks/`
List tasks. Supports filtering `?project=1&status=todo&priority=high`.

### `POST /tasks/` (Admin only)
Create task.
- **Body**: `title`, `description`, `priority`, `status`, `due_date`, `project`, `assigned_to`

### `PATCH /tasks/:id/update-status/`
Update task status.
- **Body**: `status`

## Dashboard

### `GET /dashboard/stats/`
Get overview stats (projects count, task breakdown).

### `GET /dashboard/activity/`
Get recent activity logs.
