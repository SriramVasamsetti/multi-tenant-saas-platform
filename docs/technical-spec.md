Technical Specification
1. Project Overview
This platform is a multi-tenant SaaS application designed for Project and Task Management. It utilizes a Shared Database, Shared Schema architecture to ensure high performance and strict data isolation across multiple organizations.

2. Folder Structure
The repository is organized into three main sections to support a clean separation of concerns:

/backend: The Node.js Express API.

/migrations: SQL scripts for schema definition.

/scripts: Database migration logic.

/seeds: Automated data seeding for evaluation.

/src: Core application logic, including controllers, routes, and middleware.

/frontend: The React-based user interface.

/docs: Comprehensive documentation and system diagrams.

3. Development Setup
Prerequisites
Docker Desktop installed and running.

Git Bash or a similar terminal for command execution.

Installation Steps
Navigate to the project root: cd multi-tenant-saas-platform.

Launch via Docker: docker-compose up --build -d.

Verify Backend Health: Access http://localhost:5000/api/health. You should see {"status": "ok", "database": "connected"}.

Access the Frontend: Navigate to http://localhost:3000 to interact with the UI.

4. Key Technical Implementations
Authentication: Implemented using JWT (JSON Web Tokens) with a 24-hour expiration.

Data Isolation: Every database query is scoped by a mandatory tenant_id filter applied at the middleware level.

Containerization: Three services (Postgres, Express, React) orchestrated via Docker Compose.

Database: PostgreSQL 15-Alpine for reliable relational data management.
## System Diagrams
### Architecture Flow
![System Architecture](./images/system-architecture.png)

### Database Schema (ERD)
![Database ERD](./images/database-erd.png)