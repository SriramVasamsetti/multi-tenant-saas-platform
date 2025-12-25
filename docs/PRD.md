# Product Requirements Document (PRD)

## 1. Project Objective
To build a highly scalable, multi-tenant Project and Task Management SaaS that ensures total data isolation and role-based access control for diverse organizational structures.

## 2. Functional Requirements (15+)
### 2.1 Authentication & Multi-Tenancy
1.  **Tenant Registration**: System must allow new organizations to register with a unique subdomain.
2.  **Stateless Login**: Users must authenticate via email, password, and subdomain to receive a JWT.
3.  **Super Admin Oversight**: A system-level admin must be able to view all active tenants.
4.  **Session Management**: Users must be able to securely log out and invalidate their local tokens.
5.  **Profile Access**: Users must be able to view their own profile and organizational context.

### 2.2 Project & Task Management
6.  **Project Creation**: Tenant admins must be able to create new projects with titles and descriptions.
7.  **Data Isolation**: Projects created in one tenant must never be visible to users in another tenant.
8.  **Project Modification**: Authorized users must be able to edit project details.
9.  **Project Deletion**: Admins must be able to remove projects and all associated tasks.
10. **Task Creation**: Users must be able to add tasks to specific projects.
11. **Status Updates**: Tasks must support transitions between 'Todo', 'In Progress', and 'Done'.
12. **Task Listing**: Users must be able to view a filtered list of tasks belonging to their tenant.

### 2.3 User & Access Control
13. **User Invitation**: Tenant admins must be able to add new users to their specific organization.
14. **Role Assignment**: System must support roles including Tenant Admin, User, and Super Admin.
15. **User Deletion**: Admins must have the authority to revoke user access from the tenant.