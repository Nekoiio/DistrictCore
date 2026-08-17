# DistrictCore

A full-stack ERP system built to learn how enterprise applications are actually put together — centralized data, department/employee/position management, and permission-based access control, backed by Oracle and secured with Keycloak.

I built this specifically to get hands-on with the concepts real ERP platforms are built on, not just to make another CRUD app.

## Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** Oracle (relational schema, foreign keys, transactions)
- **Auth:** Keycloak (OIDC, OAuth 2.0, PKCE), JWT verification via `jose`
- **Infra:** Docker Compose

## Architecture

```
React (Vite) → Express REST API → Oracle
                    ↑
                Keycloak (OIDC/JWT)
```

The backend is layered — **controllers → services → repositories** — so HTTP handling, business rules, and database access stay separate. Auth is split the same way:

- **`authenticate`** verifies the Keycloak JWT (signature, issuer, audience, expiration) and resolves it to an internal user via `sub`.
- **`authorize`** checks that user's permissions against the route (e.g. `department.manage`) and returns 401 vs. 403 accordingly.

The API never trusts an identity claimed by the client — only a verified Keycloak token. A dev-only header shortcut (`X-Dev-Identity-Id`) existed during early development and has since been removed in favor of requiring a real bearer token everywhere.

## Data model

```
Departments ─┬─ Employees ── Users ── Roles ── Permissions
             └─ Job Positions
```

Foreign keys enforce integrity at the database level, and the service layer double-checks relationships that matter for business logic — e.g. an employee's job position has to belong to their department, not just exist somewhere in the table.

## What's working

- Department, employee, job position, and user management (CRUD) through a protected REST API
- Keycloak login (OIDC + PKCE) with JWT verification on every request
- Role- and permission-based authorization, enforced in middleware rather than per-screen
- Local dev environment fully containerized (Oracle + Keycloak via Docker Compose)

## Not there yet

- Dashboard and admin UI for users/permissions (API works, UI doesn't exist)
- Audit logging
- Automated tests
- Production Docker config / CI pipeline

## Running it locally

```bash
docker compose up -d          # Oracle + Keycloak

cd backend && npm install && npm run dev   # http://127.0.0.1:30001
cd frontend && npm install && npm run dev  # http://127.0.0.1:30000
```

---

**Guillermo Luis Delgado Laboy** — [github.com/Nekoiio](https://github.com/Nekoiio)
