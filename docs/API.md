# API Documentation

## Auth Module
* **POST** `/api/auth/register-tenant`: Create a new tenant and admin user.
* **POST** `/api/auth/login`: Authenticate user and return JWT.
* **GET** `/api/auth/me`: Return current user profile.
* **POST** `/api/auth/logout`: Invalidate session.

## Tenant Module
* **GET** `/api/tenants/:id`: Get specific tenant info.
* **PUT** `/api/tenants/:id`: Update tenant settings.
* **GET** `/api/tenants`: List all tenants (Super Admin only).

## User Module
* **POST** `/api/users`: Add user to current tenant.
* **GET** `/api/users`: List all users in tenant.
* **PUT** `/api/users/:id`: Update user details.
* **DELETE** `/api/users/:id`: Remove user from tenant.

## Project Module
* **POST** `/api/projects`: Create new project (Enforces plan limits).
* **GET** `/api/projects`: List tenant projects.
* **PUT** `/api/projects/:id`: Update project.
* **DELETE** `/api/projects/:id`: Delete project and tasks.

## Task Module
* **POST** `/api/projects/:projectId/tasks`: Add task to project.
* **GET** `/api/projects/:projectId/tasks`: List project tasks.
* **PATCH** `/api/tasks/:taskId/status`: Update task status (Todo/Progress/Done).
* **PUT** `/api/tasks/:taskId`: Edit task details.