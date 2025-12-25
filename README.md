# Multi-Tenant SaaS Project Management Platform video link
https://drive.google.com/file/d/10APhEuquw9W-IRZnNAHRWZuQkoDbbDfe/view?usp=sharing
A robust, production-ready SaaS platform built with Node.js, React, and PostgreSQL, featuring strict data isolation and containerized deployment.

## 🚀 Quick Start
1. **Clone the repository**: `git clone <your-repo-link>`
2. **Launch the platform**: Run `docker-compose up --build -d` from the root directory.
3. **Access the App**: 
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - Health Check: `http://localhost:5000/api/health`

## 🔑 Test Credentials
The system comes pre-seeded with the following accounts:
* **Super Admin**: `superadmin@system.com` / `Admin@123`
* **Tenant Admin**: `admin@demo.com` / `Demo@123` (Subdomain: `demo`)
* **Regular User**: `user1@demo.com` / `User@123` (Subdomain: `demo`)

## ✨ Key Features
* **Multi-Tenancy**: Shared database, shared schema architecture with `tenant_id` isolation.
* **Authentication**: Stateless JWT-based auth with Role-Based Access Control (RBAC).
* **Project Management**: Create and track projects with plan-based limits.
* **Task Management**: Granular task tracking within projects including status updates.
* **Security**: Bcrypt password hashing and mandatory tenant-scoped middleware.

## 📁 Documentation
Comprehensive documentation is available in the `/docs` folder:
* [Research & Analysis](./docs/research.md) (1,700+ words)
* [Product Requirements (PRD)](./docs/PRD.md) (15+ Requirements)
* [Architecture & ERD](./docs/architecture.md)
* [API Reference](./docs/API.md) (19 Endpoints)

## 🎥 Demo Video
[Link to your YouTube Demo Video]