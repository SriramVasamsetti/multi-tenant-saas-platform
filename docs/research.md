Research Document: Multi-Tenancy and SaaS Security
1. Multi-Tenancy Architecture Analysis
Comparison of Approaches
We evaluated three primary patterns for managing multiple organizations (tenants) in a single system:

Shared Database, Shared Schema (The Chosen Approach): This model uses a single database instance and a single set of tables for all tenants. Data isolation is achieved by adding a tenant_id column to every table.

Pros: This is the most cost-effective model, as it minimizes the hardware resources needed for Postgres. It simplifies maintenance because one schema change updates the entire application at once.

Cons: It requires strict coding discipline to ensure the tenant_id filter is never missed in a query, which could lead to data leakage.

Justification: For this Project & Task Management system, we chose this approach to maximize performance and scalability for a high density of users.

Shared Database, Separate Schema: Each tenant has its own private namespace (schema) within one database.

Pros: Offers better logical isolation at the database layer.

Cons: Becomes difficult to manage hundreds of migrations across different schemas as the tenant list grows.

Separate Database: Each tenant has their own physical database instance.

Pros: Total data isolation and zero "noisy neighbor" effects.

Cons: The most expensive and complex to maintain; unsuitable for a standard SaaS platform unless serving high-security enterprise clients.

2. Technology Stack Justification
Backend (Node.js & Express): We chose Node.js for its non-blocking I/O, which is ideal for a collaborative task management system where multiple users are updating data simultaneously.

Database (Postgres): PostgreSQL provides superior support for relational constraints and UUIDs, which are essential for the unique email requirements per tenant in this project.

Authentication (JWT): JSON Web Tokens allow for stateless authentication. By encoding the tenant_id and role in the token, we ensure the backend can verify a user's identity without a database lookup for every request.

DevOps (Docker): Docker is mandatory for ensuring the system runs the same way on the evaluator’s machine as it does in development, meeting the requirement for a one-command deployment via docker-compose up -d.

3. Security Considerations
Data Isolation: We implemented a centralized middleware that automatically extracts the tenant_id from the JWT and applies it as a filter to all database queries.

Password Hashing: We utilized bcryptjs with a cost factor of 10 to ensure user credentials remain secure against brute-force attacks.

RBAC (Role-Based Access Control): Three roles (Super Admin, Tenant Admin, User) ensure the principle of least privilege is maintained.

API Security: All 19 endpoints require a valid JWT, and critical administrative functions are restricted to super_admin or tenant_admin roles only.