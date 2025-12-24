# Multi-Tenant SaaS Platform with Project & Task Management

A production-ready, multi-tenant SaaS application where multiple organizations (tenants) can independently register, manage their teams, create projects, and track tasks. The system ensures complete data isolation between tenants, implements role-based access control (RBAC), and enforces subscription plan limits.

## Features

- **Multi-Tenancy Architecture**: Complete data isolation with per-tenant databases using shared schema
- **Role-Based Access Control (RBAC)**: Three roles - Super Admin, Tenant Admin, User
- **Authentication**: JWT-based authentication with 24-hour token expiry
- **Subscription Management**: Free, Pro, and Enterprise plans with configurable user/project limits
- **Project & Task Management**: Create projects, manage tasks with status and priority tracking
- **Audit Logging**: Track all important actions for security and compliance
- **Responsive Design**: Mobile-friendly frontend supporting all major devices
- **Docker Support**: Fully containerized application deployable with `docker-compose up -d`

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Vite

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL 15
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Database Migration**: Custom migration system

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

## Architecture Overview

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌──────────────────────┐
│  React Frontend      │
│  (Port 3000)         │
│  - Login/Register    │
│  - Dashboard         │
│  - Projects/Tasks    │
│  - User Management   │
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────────────┐
│  Node.js Express Backend     │
│  (Port 5000)                 │
│  - Authentication            │
│  - Tenant Management         │
│  - User Management           │
│  - Project Management        │
│  - Task Management           │
│  - Audit Logging             │
└──────────┬────────────────────┘
           │ PostgreSQL Driver
           ▼
┌──────────────────────┐
│  PostgreSQL Database │
│  (Port 5432)         │
│  - Tenants           │
│  - Users             │
│  - Projects          │
│  - Tasks             │
│  - Audit Logs        │
└──────────────────────┘
```

## Database Schema

Core tables with multi-tenant isolation:

1. **tenants** - Organization data with subscription plans
2. **users** - User accounts with role-based access
3. **projects** - Projects within tenants
4. **tasks** - Tasks within projects
5. **audit_logs** - Action tracking for security

Key constraint: Email is unique per tenant, not globally.

## Installation & Setup

### Prerequisites

- Node.js v18+ and npm v9+
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-tenant-saas-platform.git
   cd multi-tenant-saas-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb saas_db
   
   # Run migrations
   npm run migrate
   
   # Seed data
   npm run seed
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

Access the application at `http://localhost:3000`

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check health
curl http://localhost:5000/api/health
```

Access the application at `http://localhost:3000`

### Docker Services

- **Database**: PostgreSQL (Port 5432)
- **Backend**: Node.js Express (Port 5000)
- **Frontend**: React (Port 3000)

All services start automatically with automatic database initialization.

## Environment Variables

### Backend (.env)

```
# Database
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://frontend:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://backend:5000/api
```

## API Documentation

See [docs/API.md](./docs/API.md) for comprehensive API endpoint documentation.

### API Endpoints Overview

**Authentication (4 endpoints)**
- POST /api/auth/register-tenant
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

**Tenant Management (3 endpoints)**
- GET /api/tenants/:tenantId
- PUT /api/tenants/:tenantId
- GET /api/tenants

**User Management (4 endpoints)**
- POST /api/tenants/:tenantId/users
- GET /api/tenants/:tenantId/users
- PUT /api/users/:userId
- DELETE /api/users/:userId

**Project Management (4 endpoints)**
- POST /api/projects
- GET /api/projects
- PUT /api/projects/:projectId
- DELETE /api/projects/:projectId

**Task Management (4 endpoints)**
- POST /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks
- PATCH /api/tasks/:taskId/status
- PUT /api/tasks/:taskId

## Frontend Pages

1. **Registration Page** (/register) - Tenant registration with subdomain creation
2. **Login Page** (/login) - User authentication
3. **Dashboard** (/dashboard) - Overview with statistics and recent items
4. **Projects List** (/projects) - Browse and manage projects
5. **Project Details** (/projects/:id) - View and manage tasks
6. **Users List** (/users) - Manage tenant users (Admin only)

## Test Credentials

Default seed data includes:

- **Super Admin**: superadmin@system.com / Admin@123
- **Tenant Admin**: admin@demo.com / Demo@123
- **Regular Users**: user1@demo.com / User@123, user2@demo.com / User@123

## Project Structure

```
multi-tenant-saas-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── app.js
│   ├── migrations/
│   ├── seeds/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   └── API.md
├── docker-compose.yml
└── README.md
```

## Security Features

- **Data Isolation**: Complete tenant data separation at database level
- **Password Security**: bcrypt hashing with salt rounds 10
- **JWT Authentication**: Stateless authentication with token expiry
- **RBAC**: Role-based authorization on all API endpoints
- **CORS Configuration**: Restricted to frontend domain
- **Audit Logging**: All sensitive actions logged with user and IP information

## Subscription Plans

| Plan | Max Users | Max Projects | Price |
|------|-----------|--------------|-------|
| Free | 5 | 3 | $0 |
| Pro | 25 | 15 | $99/month |
| Enterprise | 100 | 50 | Custom |

## API Response Format

All API responses follow a consistent format:

**Success Response (200/201):**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Development Guidelines

### Making API Calls from Frontend

```javascript
import api from './services/api';

// Get current user
const user = await api.get('/auth/me');

// Create project
const project = await api.post('/projects', {
  name: 'New Project',
  description: 'Description'
});
```

### Database Queries

All queries must include tenant isolation:

```javascript
// ✓ Correct - Filters by tenant
SELECT * FROM projects WHERE tenant_id = $1

// ✗ Wrong - Missing tenant filter
SELECT * FROM projects WHERE id = $1
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## Deployment

The application is ready for deployment to:

- **Heroku**: Using Procfile and Docker
- **AWS**: Using ECS or Elastic Beanstalk
- **DigitalOcean**: Using App Platform or Droplets
- **Google Cloud**: Using Cloud Run or App Engine
- **Azure**: Using Container Instances or App Service

## Troubleshooting

### Port Already in Use
```bash
# Free port 3000, 5000, or 5432
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
lsof -ti:5432 | xargs kill -9
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres -h localhost

# Check .env file has correct credentials
```

### Docker Issues
```bash
# Rebuild images
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feedback, please create an GitHub issue.

## Demo Video

Watch the full demo: [YouTube Link](https://youtube.com)

---

**Last Updated**: December 2025
**Version**: 1.0.0
