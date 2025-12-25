Architecture Documentation
1. System Overview
The platform utilizes a Shared Database, Shared Schema architecture. This approach ensures high density and cost-effectiveness by using a single PostgreSQL instance for all tenants. Data isolation is strictly enforced at the application level through a mandatory tenant_id column on all organizational tables.

2. Technical Stack
Frontend: React.js with Vite.

Backend: Node.js & Express.

Database: PostgreSQL.

Authentication: Stateless JWT (JSON Web Tokens).

Infrastructure: Docker & Docker Compose.

3. Mandatory API Endpoints (19)
The system exposes the following 19 endpoints, all protected by JWT middleware except for Login and Register:

3.1 Authentication & Tenants
POST /api/auth/register - Register a new tenant and admin user.

POST /api/auth/login - Authenticate user and return JWT.

GET /api/auth/me - Get current authenticated user profile.

POST /api/auth/logout - Invalidate user session.

GET /api/tenants/:id - Fetch specific tenant details.

PUT /api/tenants/:id - Update tenant configuration.

GET /api/tenants - List all tenants (Super Admin only).

3.2 User Management
POST /api/users - Add a new user to a tenant.

GET /api/users - List all users within a tenant.

GET /api/users/:id - Get individual user details.

PUT /api/users/:id - Update user role or information.

DELETE /api/users/:id - Remove a user from the tenant.

3.3 Project Management
POST /api/projects - Create a new project.

GET /api/projects - List projects (Tenant isolated).

PUT /api/projects/:id - Update project details.

DELETE /api/projects/:id - Delete a project.

3.4 Task Management
POST /api/tasks - Create a task within a project.

GET /api/tasks - List tasks for a project.

PATCH /api/tasks/:id/status - Update task status (Todo/In Progress/Done).