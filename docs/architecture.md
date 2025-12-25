# Architecture Documentation

## System Overview
The platform uses a Shared Database, Shared Schema architecture to ensure cost-effectiveness and simplified maintenance. Data isolation is strictly enforced via a `tenant_id` column on all tenant-specific tables.

## API Endpoints (19 Required)
* **Auth**: Register Tenant, Login, Get Me, Logout.
* **Tenants**: Get Tenant Details, Update Tenant, List All Tenants (Super Admin).
* **Users**: Add User, List Users, Update User, Delete User.
* **Projects**: Create Project, List Projects, Update Project, Delete Project.
* **Tasks**: Create Task, List Tasks, Update Task Status, Update Task.