# Product Requirements Document (PRD)

## User Personas
* **Super Admin**: System-level administrator with access to all tenants.
* **Tenant Admin**: Organization administrator with full control over their specific tenant.
* **End User**: Regular team member with permissions limited to their assigned projects.

## Functional Requirements
* **FR-001**: The system shall allow tenant registration with a unique subdomain.
* **FR-002**: The system shall enforce data isolation via a mandatory `tenant_id` on all records.
* **FR-003**: The system shall support JWT-based stateless authentication with 24-hour expiry.
* **FR-004**: The system shall implement Role-Based Access Control (RBAC) at the API level.
* **FR-005**: The system shall enforce a limit of 5 users for the 'Free' plan.
* **FR-006**: The system shall enforce a limit of 3 projects for the 'Free' plan.
* **FR-007**: The system shall allow Tenant Admins to add new users to their organization.
* **FR-008**: The system shall allow users to create and manage projects.
* **FR-009**: The system shall allow users to create tasks within projects.
* **FR-010**: The system shall allow users to update task status (Todo, In Progress, Completed).
* **FR-011**: The system shall provide a dashboard showing recent activity and statistics.
* **FR-012**: The system shall log all major actions (CRUD) in an `audit_logs` table.
* **FR-013**: The system shall prevent Tenant Admins from deleting themselves.
* **FR-014**: The system shall return all API responses in a `{success, message, data}` format.
* **FR-015**: The system shall provide a `/api/health` endpoint to monitor database connectivity.

## Non-Functional Requirements
* **NFR-001**: Security: All passwords must be hashed using bcrypt/argon2.
* **NFR-002**: Availability: The system must be fully dockerized for single-command deployment.
* **NFR-003**: Performance: Database queries must be optimized using indexes on `tenant_id`.
* **NFR-004**: Usability: The frontend must be responsive for desktop and mobile.
* **NFR-005**: Scalability: Support shared database, shared schema architecture.