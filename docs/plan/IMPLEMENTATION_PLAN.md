# ProManage — Implementation Plan

**Multi-Tenant SaaS Project Management & Billing Platform**

| Field        | Value                                                                              |
| ------------ | ---------------------------------------------------------------------------------- |
| Document     | Technical Implementation Plan (Master)                                             |
| Version      | 1.0                                                                                |
| Status       | Approved for execution                                                             |
| Owner        | Engineering (solo build, mentor-reviewed)                                          |
| Created      | 2026-09-06                                                                         |
| Scope source | `idea.txt`                                                                         |
| Stack        | MERN + Redis (React, Node/Express, MongoDB, Redis, Socket.IO, BullMQ, Docker, AWS) |

---

## Table of Contents

1. [Purpose & Working Agreement](#1-purpose--working-agreement)
2. [Product Vision & Scope](#2-product-vision--scope)
3. [Personas, Roles & Key User Journeys](#3-personas-roles--key-user-journeys)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture](#6-system-architecture)
7. [Multi-Tenancy Strategy](#7-multi-tenancy-strategy)
8. [Data Model & Index Design](#8-data-model--index-design)
9. [API Design Standards](#9-api-design-standards)
10. [Authentication Design](#10-authentication-design)
11. [Authorization & RBAC](#11-authorization--rbac)
12. [Caching Strategy (Redis)](#12-caching-strategy-redis)
13. [Background Jobs & Queues](#13-background-jobs--queues)
14. [Real-Time Layer](#14-real-time-layer)
15. [File Storage & Uploads](#15-file-storage--uploads)
16. [Search, Filtering & Pagination](#16-search-filtering--pagination)
17. [Subscriptions, Plans & Usage Limits](#17-subscriptions-plans--usage-limits)
18. [Notifications](#18-notifications)
19. [Activity & Audit Logs](#19-activity--audit-logs)
20. [Frontend Architecture](#20-frontend-architecture)
21. [Testing Strategy](#21-testing-strategy)
22. [Security Plan & Threat Model](#22-security-plan--threat-model)
23. [Observability & Operations](#23-observability--operations)
24. [Infrastructure, Docker & CI/CD](#24-infrastructure-docker--cicd)
25. [Delivery Plan — 10 Phases](#25-delivery-plan--10-phases)
26. [Repository Structure & Engineering Conventions](#26-repository-structure--engineering-conventions)
27. [Risk Register](#27-risk-register)
28. [Appendices](#28-appendices)

---

## 1. Purpose & Working Agreement

### 1.1 Purpose of this document

This is the master engineering plan for **ProManage**. It defines _what_ is built, _why_ each architectural decision was taken, and _in what order_ the work happens. It is written as a specification, not a tutorial: every phase states its deliverables, its Definition of Done, and its acceptance criteria, so progress is measurable rather than felt.

The project has two goals, and both are first-class:

1. **Product goal** — ship a working, deployable, multi-tenant SaaS product.
2. **Engineering goal** — rebuild production-level full-stack capability: architecture, data modelling, authorization, caching, queues, real-time, testing, security, deployment.

A decision is only "done" when it can be defended. For every arrow in the architecture diagram you should be able to answer: _why does the request go here, why is Redis in this path, why is this data shaped this way, why a queue instead of an inline call?_

### 1.2 Working agreement (how this project is executed)

This is deliberately **not** an AI-generated codebase.

| Rule            | Detail                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Code authorship | All application code is written by hand by the developer.                                       |
| AI role         | Senior reviewer / mentor / architect — never the implementer.                                   |
| Getting unstuck | Ask for a **hint**, not a solution.                                                             |
| Debugging       | Ask "which layer is this bug in, and what are the debugging steps?" — not "fix my code".        |
| Reviews         | Every phase ends with a review pass against that phase's Definition of Done.                    |
| Design first    | No feature is coded before its data model, API contract, and permission rules are written down. |

**Rationale:** the value of this project is the reasoning, and reasoning is not transferable by paste.

### 1.3 How to use this plan

- **Sections 4 and 25** are the working documents — requirements and phase execution.
- **Sections 6–24** are reference specs; consult them while implementing the relevant phase.
- Anything marked **[Decide in Phase N]** is an open decision deliberately deferred until enough context exists.
- Requirement IDs (`FR-xx-nn`, `NFR-nn`) are stable — reference them in commits, tests, and PR descriptions.

---

## 2. Product Vision & Scope

### 2.1 Vision

> ProManage lets a company create an isolated workspace, invite its team with scoped roles, run projects on a Kanban board, collaborate in real time, and operate within the limits of a subscription plan.

Positioning: a simplified but production-grade Linear/Jira, including the SaaS spine — tenancy, roles, billing limits, audit — that toy clones always omit.

### 2.2 Product pillars

| Pillar                   | What it means                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Tenant isolation**     | A workspace's data is unreachable from another workspace — enforced server-side, on every query. |
| **Role-scoped access**   | Five roles with a real permission matrix, enforced in the API and only _mirrored_ in the UI.     |
| **Collaboration**        | Kanban, comments, @mentions, attachments, presence, live updates.                                |
| **Operational maturity** | Queues, caching, rate limits, audit trail, health checks, structured logs, CI/CD.                |
| **Commercial model**     | Plans with hard usage limits enforced by the backend, not the UI.                                |

### 2.3 In scope (v1.0)

- Authentication: register, email verification, login, logout, refresh-token rotation, forgot/reset/change password, session management.
- Workspaces (tenants) with settings and ownership transfer.
- Membership and invitations — email-based, tokenized, expiring, sent by a worker.
- RBAC: `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`.
- Projects: CRUD, members, status, priority, dates, archive.
- Tasks: CRUD, status, priority, assignee, due date, labels, ordering, Kanban drag-and-drop.
- Comments with @mentions; attachments on tasks and comments.
- Notifications: in-app real-time plus queued email.
- Activity feed and immutable audit log.
- Global search, advanced filtering, sorting, pagination.
- Subscription plans (`FREE`, `PRO`, `BUSINESS`) with enforced usage limits.
- Dashboard with workspace metrics and charts.
- Platform admin panel: workspaces, users, plans, job health.
- API versioning (`/api/v1`) and OpenAPI documentation.
- Rate limiting, security hardening, structured logging, health and readiness endpoints.
- Unit, integration, and E2E test suites.
- Docker Compose local environment; GitHub Actions CI; AWS deployment behind Nginx.

### 2.4 Explicitly out of scope (v1.0)

Recorded so that scope creep is a conscious decision, not an accident.

| Excluded                                 | Why                                                                                                                                   | Revisit                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Real payment processing (card charges)   | Billing _limits_ carry the SaaS lesson; card handling adds compliance surface without new learning. Plans change via an admin action. | v1.1 — Stripe Checkout + webhooks |
| Sprints / epics / story points           | Kanban already exercises the hard parts.                                                                                              | v1.2                              |
| Time tracking & timesheets               | Additive CRUD, low learning yield.                                                                                                    | v1.2                              |
| Gantt / dependency graphs                | High UI cost, low backend learning.                                                                                                   | Later                             |
| Native mobile apps                       | Responsive web only.                                                                                                                  | Later                             |
| SSO / SAML / social login                | Own the JWT lifecycle first — that is the lesson.                                                                                     | v1.1 — Google OAuth               |
| Third-party integrations (Slack, GitHub) | Webhook ingestion is a separate project.                                                                                              | Later                             |
| i18n / localization                      | English only.                                                                                                                         | Later                             |
| Multi-region, sharding, read replicas    | Single-region is honest for the expected load.                                                                                        | Later                             |

### 2.5 Success criteria

The project is complete when all of the following are true:

1. Two workspaces exist in production and **cannot** read each other's data — proven by a written IDOR test suite, not by inspection.
2. Every role's permissions are enforced by integration tests asserting both the `200` and the `403` path.
3. A `FREE` workspace receives `403 LIMIT_REACHED` on its 4th project — enforced by the API, not the UI.
4. Inviting 100 members returns in under 500 ms, and the emails are delivered by a worker with retries.
5. Moving a task on User A's board moves it on User B's board with no page refresh.
6. `docker compose up` produces a complete working environment from a clean clone.
7. A push to `main` runs lint, tests, build, image publish, and deploy with no manual steps.
8. Production serves HTTPS through Nginx with health checks, structured logs, and a **tested** backup/restore procedure.
9. Coverage meets the targets in §21.6.
10. You can whiteboard the architecture and defend every component from memory.

---

## 3. Personas, Roles & Key User Journeys

### 3.1 Personas

| Persona                         | Goal                                                     | Primary surfaces                         |
| ------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| **Workspace Owner** (founder)   | Set up the company workspace, control billing and admins | Onboarding, settings, billing, audit log |
| **Admin** (ops lead)            | Manage members and projects                              | Members, invitations, projects, activity |
| **Manager** (team lead)         | Plan projects, assign work, track progress               | Projects, Kanban, dashboard, reports     |
| **Member** (developer/designer) | Do assigned work, communicate                            | My Tasks, Kanban, task detail, comments  |
| **Viewer** (stakeholder/client) | Observe progress without touching anything               | Read-only board and dashboard            |
| **Platform Admin** (you)        | Operate the SaaS itself                                  | Admin panel, queue dashboard, metrics    |

### 3.2 Reference scenario

```
ABC Software House  →  workspace "abc-software"   [PRO plan]

Members:
  Ali    → OWNER      Abeer  → MANAGER
  Hamza  → MEMBER     Sara   → MEMBER
  Client → VIEWER

Projects:
  Website Redesign   (IN_PROGRESS, HIGH)
  Mobile App         (PLANNING,    MEDIUM)
  CRM System         (IN_PROGRESS, URGENT)
```

### 3.3 Critical user journeys (CUJs)

These flows must never break; they drive the E2E suite (§21.4).

| ID        | Journey               | Steps                                                                                                      |
| --------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **CUJ-1** | Sign-up to first task | Register → verify email → login → create workspace → create project → create task                          |
| **CUJ-2** | Onboard a teammate    | Invite by email + role → invitee receives email → accepts → lands in the workspace with the correct role   |
| **CUJ-3** | Daily task flow       | Open board → drag task `TODO → IN_PROGRESS` → comment with @mention → attach file → assignee notified live |
| **CUJ-4** | Permission boundary   | `VIEWER` attempts to create a task → UI hides the control **and** the API returns `403`                    |
| **CUJ-5** | Tenant boundary       | A user of Workspace A requests a Workspace B task id → `404`, never data                                   |
| **CUJ-6** | Plan limit            | `FREE` workspace creates a 4th project → `403 LIMIT_REACHED` + upgrade prompt                              |
| **CUJ-7** | Account recovery      | Forgot password → email → reset → all refresh tokens invalidated → login with the new password             |

---

## 4. Functional Requirements

Requirements are grouped by module. Priority uses MoSCoW: **M** = Must (v1.0), **S** = Should (v1.0 if time allows), **C** = Could (deferred).

### 4.1 Authentication — `FR-AUTH`

| ID         | Requirement                                                                                          | Pri | Phase |
| ---------- | ---------------------------------------------------------------------------------------------------- | --- | ----- |
| FR-AUTH-01 | Register with name, email, password; password strength enforced server-side                          | M   | 5     |
| FR-AUTH-02 | Email verification via single-use expiring token; unverified users cannot create or join a workspace | M   | 5     |
| FR-AUTH-03 | Login issues a short-lived access token and a long-lived refresh token                               | M   | 5     |
| FR-AUTH-04 | Refresh rotates the refresh token and detects reuse of a revoked token                               | M   | 5     |
| FR-AUTH-05 | Logout revokes the current refresh token; "log out everywhere" revokes all sessions                  | M   | 5     |
| FR-AUTH-06 | Forgot password sends a single-use reset token valid 30 minutes                                      | M   | 5     |
| FR-AUTH-07 | Password reset revokes every session and emails a confirmation                                       | M   | 5     |
| FR-AUTH-08 | Change password (authenticated) requires the current password                                        | M   | 5     |
| FR-AUTH-09 | Session list showing device/UA, IP, last used, created; revoke individually                          | S   | 5     |
| FR-AUTH-10 | Brute-force protection: per-IP and per-account throttling with progressive lockout                   | M   | 7     |
| FR-AUTH-11 | Profile: display name, avatar upload, timezone                                                       | S   | 6     |

### 4.2 Workspace / Tenant — `FR-WS`

| ID       | Requirement                                                               | Pri | Phase |
| -------- | ------------------------------------------------------------------------- | --- | ----- |
| FR-WS-01 | Create a workspace with name and unique slug; the creator becomes `OWNER` | M   | 5     |
| FR-WS-02 | A user may belong to multiple workspaces and switch between them          | M   | 5     |
| FR-WS-03 | Every request is scoped to exactly one active workspace                   | M   | 5     |
| FR-WS-04 | Workspace settings: name, logo, timezone, default task status             | S   | 6     |
| FR-WS-05 | Transfer ownership (`OWNER` only, password confirmation required)         | S   | 6     |
| FR-WS-06 | Delete workspace: soft delete plus a 30-day purge job; `OWNER` only       | S   | 8     |
| FR-WS-07 | Cross-tenant access attempts are denied and audit-logged                  | M   | 5     |

### 4.3 Members & Invitations — `FR-MEM`

| ID        | Requirement                                                                                            | Pri | Phase |
| --------- | ------------------------------------------------------------------------------------------------------ | --- | ----- |
| FR-MEM-01 | Invite by email with a role; the token expires in 7 days                                               | M   | 6     |
| FR-MEM-02 | Invitation emails are queued, never sent inline                                                        | M   | 8     |
| FR-MEM-03 | Bulk invite (up to 100 addresses per request) fans out to individual jobs                              | M   | 8     |
| FR-MEM-04 | Accepting an invitation creates the membership; existing users join directly, new users register first | M   | 6     |
| FR-MEM-05 | Resend or revoke a pending invitation                                                                  | S   | 6     |
| FR-MEM-06 | Change a member's role, never above your own level; `OWNER` is unique per workspace                    | M   | 6     |
| FR-MEM-07 | Remove a member: their tasks are unassigned, their comments retained                                   | M   | 6     |
| FR-MEM-08 | Member list with search, role filter, pagination                                                       | M   | 6     |
| FR-MEM-09 | Seat count enforced against the plan limit                                                             | M   | 9     |

### 4.4 Projects — `FR-PRJ`

| ID        | Requirement                                                                  | Pri | Phase |
| --------- | ---------------------------------------------------------------------------- | --- | ----- |
| FR-PRJ-01 | CRUD: name, key (e.g. `WEB`), description, status, priority, start/due dates | M   | 6     |
| FR-PRJ-02 | Project members are a subset of workspace members                            | M   | 6     |
| FR-PRJ-03 | Statuses: `PLANNING`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `ARCHIVED`      | M   | 6     |
| FR-PRJ-04 | Archive instead of hard delete; archived projects are read-only              | M   | 6     |
| FR-PRJ-05 | Progress = completed tasks ÷ total tasks, computed server-side               | M   | 6     |
| FR-PRJ-06 | List with search, status/priority filters, sorting, pagination               | M   | 6     |
| FR-PRJ-07 | Project count enforced against the plan limit                                | M   | 9     |
| FR-PRJ-08 | Per-project custom Kanban columns                                            | C   | v1.1  |

### 4.5 Tasks — `FR-TSK`

| ID        | Requirement                                                                                       | Pri | Phase |
| --------- | ------------------------------------------------------------------------------------------------- | --- | ----- |
| FR-TSK-01 | CRUD: title, description, status, priority, assignee, reporter, due date, labels                  | M   | 6     |
| FR-TSK-02 | Human-readable key per project (`WEB-101`), generated atomically                                  | M   | 6     |
| FR-TSK-03 | Statuses `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`; priorities `LOW`, `MEDIUM`, `HIGH`, `URGENT` | M   | 6     |
| FR-TSK-04 | Kanban board grouped by status with drag-and-drop                                                 | M   | 6     |
| FR-TSK-05 | Stable manual ordering within a column (fractional rank, no full re-index)                        | M   | 6     |
| FR-TSK-06 | Optimistic UI on move, with rollback when the API fails                                           | M   | 6     |
| FR-TSK-07 | Assignment notifies the assignee                                                                  | M   | 8     |
| FR-TSK-08 | Subtasks / checklist items                                                                        | S   | 6     |
| FR-TSK-09 | Task history: field-level change log                                                              | M   | 6     |
| FR-TSK-10 | "My Tasks" view spanning all projects in the workspace                                            | M   | 6     |
| FR-TSK-11 | Overdue detection plus a daily reminder job                                                       | S   | 8     |
| FR-TSK-12 | Task count enforced against the plan limit                                                        | M   | 9     |

### 4.6 Comments & Mentions — `FR-CMT`

| ID        | Requirement                                                                          | Pri | Phase |
| --------- | ------------------------------------------------------------------------------------ | --- | ----- |
| FR-CMT-01 | Threaded comments on a task                                                          | M   | 6     |
| FR-CMT-02 | Edit (recording `editedAt`) and soft-delete own comments; `ADMIN` may delete any     | M   | 6     |
| FR-CMT-03 | `@mention` autocomplete restricted to project members                                | M   | 6     |
| FR-CMT-04 | Mentions produce notifications; the mention list is parsed and validated server-side | M   | 8     |
| FR-CMT-05 | Comment bodies are sanitized and rendered without raw HTML injection                 | M   | 9     |
| FR-CMT-06 | Real-time comment delivery to everyone viewing the task                              | M   | 8     |

### 4.7 Attachments — `FR-FILE`

| ID         | Requirement                                                       | Pri | Phase |
| ---------- | ----------------------------------------------------------------- | --- | ----- |
| FR-FILE-01 | Upload attachments to tasks and comments                          | M   | 6     |
| FR-FILE-02 | Type allowlist and maximum size (10 MB default, plan-dependent)   | M   | 6     |
| FR-FILE-03 | Files live in object storage; only metadata is stored in MongoDB  | M   | 6     |
| FR-FILE-04 | Deleting the parent entity enqueues deletion of the stored object | M   | 8     |
| FR-FILE-05 | Downloads are authorized — no public, guessable URLs              | M   | 9     |
| FR-FILE-06 | Avatar and workspace-logo upload with server-side resize          | S   | 8     |
| FR-FILE-07 | Storage usage counted toward the plan quota                       | S   | 9     |

### 4.8 Notifications — `FR-NTF`

| ID        | Requirement                                                                              | Pri | Phase |
| --------- | ---------------------------------------------------------------------------------------- | --- | ----- |
| FR-NTF-01 | In-app notification centre with an unread badge                                          | M   | 8     |
| FR-NTF-02 | Real-time delivery over Socket.IO                                                        | M   | 8     |
| FR-NTF-03 | Triggers: assigned, mentioned, comment on your task, status change, invitation, deadline | M   | 8     |
| FR-NTF-04 | Mark one / mark all as read                                                              | M   | 8     |
| FR-NTF-05 | Per-user preferences (in-app vs email, by event type)                                    | S   | 8     |
| FR-NTF-06 | Daily email digest of unread notifications via a repeatable job                          | S   | 8     |
| FR-NTF-07 | Notifications older than 90 days are pruned by a scheduled job                           | S   | 8     |

### 4.9 Activity & Audit — `FR-AUD`

| ID        | Requirement                                                                               | Pri | Phase |
| --------- | ----------------------------------------------------------------------------------------- | --- | ----- |
| FR-AUD-01 | Activity feed per workspace and per project                                               | M   | 6     |
| FR-AUD-02 | Audit records capture actor, action, entity, before/after diff, IP, user agent, timestamp | M   | 6     |
| FR-AUD-03 | Audit entries are append-only; no update or delete API exists                             | M   | 6     |
| FR-AUD-04 | Security events (failed logins, permission denials, role changes) are audited             | M   | 9     |
| FR-AUD-05 | Audit log filterable by actor, action, entity type, date range; `ADMIN`+ only             | M   | 6     |
| FR-AUD-06 | CSV export of the audit log via a background job                                          | C   | v1.1  |

### 4.10 Search & Filtering — `FR-SRCH`

| ID         | Requirement                                                                       | Pri | Phase |
| ---------- | --------------------------------------------------------------------------------- | --- | ----- |
| FR-SRCH-01 | Global search across projects, tasks, comments, members — always tenant-scoped    | M   | 7     |
| FR-SRCH-02 | Advanced task filters: status, priority, assignee, label, due-date range, project | M   | 6     |
| FR-SRCH-03 | Multi-field sorting against a whitelist of sortable fields                        | M   | 6     |
| FR-SRCH-04 | Cursor pagination for feeds, offset pagination for tables                         | M   | 6     |
| FR-SRCH-05 | Debounced search returning in under 300 ms p95 on seeded data                     | M   | 7     |
| FR-SRCH-06 | Saved filter views                                                                | C   | v1.1  |

### 4.11 Dashboard & Reporting — `FR-DASH`

| ID         | Requirement                                                         | Pri | Phase |
| ---------- | ------------------------------------------------------------------- | --- | ----- |
| FR-DASH-01 | Workspace KPIs: projects, active tasks, completed, overdue, members | M   | 7     |
| FR-DASH-02 | Tasks-completed-over-time chart (aggregation pipeline)              | M   | 7     |
| FR-DASH-03 | Task distribution by status and by priority                         | M   | 7     |
| FR-DASH-04 | Member workload (open tasks per assignee)                           | S   | 7     |
| FR-DASH-05 | Dashboard responses cached in Redis and invalidated on write        | M   | 7     |
| FR-DASH-06 | Project report: progress, open-task burn-down, overdue list         | S   | 7     |

### 4.12 Subscription & Limits — `FR-SUB`

| ID        | Requirement                                                                                      | Pri | Phase |
| --------- | ------------------------------------------------------------------------------------------------ | --- | ----- |
| FR-SUB-01 | Three plans with defined quotas (§17.1)                                                          | M   | 9     |
| FR-SUB-02 | Every workspace has exactly one active subscription; new workspaces default to `FREE`            | M   | 9     |
| FR-SUB-03 | Limits enforced in a service layer before any write                                              | M   | 9     |
| FR-SUB-04 | Exceeding a quota returns `403 LIMIT_REACHED` with current and limit values                      | M   | 9     |
| FR-SUB-05 | Usage counters maintained incrementally, not counted per request                                 | M   | 9     |
| FR-SUB-06 | Usage page showing consumption against each quota                                                | M   | 9     |
| FR-SUB-07 | Plan change applies immediately; a downgrade below current usage is blocked with a clear message | M   | 9     |
| FR-SUB-08 | Nightly reconciliation job recomputes counters and corrects drift                                | S   | 9     |
| FR-SUB-09 | Stripe Checkout and webhooks                                                                     | C   | v1.1  |

### 4.13 Platform Admin — `FR-ADM`

| ID        | Requirement                                                    | Pri | Phase |
| --------- | -------------------------------------------------------------- | --- | ----- |
| FR-ADM-01 | Platform-admin area, separate from workspace roles             | M   | 9     |
| FR-ADM-02 | List and search workspaces with plan, usage, member count      | M   | 9     |
| FR-ADM-03 | Suspend and reactivate a workspace                             | S   | 9     |
| FR-ADM-04 | Change a workspace's plan                                      | M   | 9     |
| FR-ADM-05 | Queue health: waiting/active/failed counts, retry a failed job | M   | 9     |
| FR-ADM-06 | Platform metrics: signups, active workspaces, task volume      | S   | 9     |

### 4.14 Platform Requirements — `FR-PLT`

| ID        | Requirement                                                                       | Pri | Phase |
| --------- | --------------------------------------------------------------------------------- | --- | ----- |
| FR-PLT-01 | All endpoints under `/api/v1`; version carried in the path                        | M   | 3     |
| FR-PLT-02 | Uniform success and error envelope (§9.2)                                         | M   | 3     |
| FR-PLT-03 | Every request carries a correlation id, echoed in the response header and in logs | M   | 3     |
| FR-PLT-04 | Validation of every input at the edge — body, params, query                       | M   | 3     |
| FR-PLT-05 | Rate limiting: global, per user, and stricter on sensitive endpoints              | M   | 7     |
| FR-PLT-06 | OpenAPI spec served at `/api/docs`, kept in sync with the routes                  | M   | 3     |
| FR-PLT-07 | `/healthz` (liveness) and `/readyz` (Mongo and Redis reachable)                   | M   | 10    |
| FR-PLT-08 | Graceful shutdown: stop accepting, drain in-flight work, close pools              | M   | 10    |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID     | Requirement                               | Target                 | Verified by                 |
| ------ | ----------------------------------------- | ---------------------- | --------------------------- |
| NFR-01 | API read latency (p95), warm cache        | ≤ 200 ms               | k6 load script, Phase 9     |
| NFR-02 | API write latency (p95)                   | ≤ 400 ms               | k6 load script              |
| NFR-03 | Dashboard aggregate (cached)              | ≤ 100 ms               | Manual + load test          |
| NFR-04 | Board load, 500 tasks                     | ≤ 1.5 s to interactive | Lighthouse                  |
| NFR-05 | Bulk invite of 100 members (API response) | ≤ 500 ms               | Integration test            |
| NFR-06 | Socket event fan-out to a room            | ≤ 500 ms end to end    | Manual, two browsers        |
| NFR-07 | No unindexed query on a hot path          | 0 `COLLSCAN`           | `explain()` review, Phase 9 |

**Reference dataset for testing:** 3 workspaces × 20 members × 15 projects × 3,000 tasks × 10,000 comments, produced by a seed script.

### 5.2 Scalability

| ID     | Requirement                                                                                |
| ------ | ------------------------------------------------------------------------------------------ |
| NFR-08 | The API is stateless — no in-process session or cache that breaks under multiple replicas. |
| NFR-09 | Socket.IO uses the Redis adapter so real-time works across replicas.                       |
| NFR-10 | Workers scale independently of the API.                                                    |
| NFR-11 | Every list endpoint is paginated; no unbounded result set is ever returned.                |
| NFR-12 | Design target: 100 workspaces, 2,000 users, 100k tasks on a single modest instance.        |

### 5.3 Reliability & availability

| ID     | Requirement                                                                       |
| ------ | --------------------------------------------------------------------------------- |
| NFR-13 | Target availability 99.5% (single region, honest for the deployment).             |
| NFR-14 | Redis being down degrades performance but does not break reads (cache-miss path). |
| NFR-15 | Email failures retry with exponential backoff, then land in a dead-letter set.    |
| NFR-16 | Jobs are idempotent — a retry must not double-send or double-write.               |
| NFR-17 | Nightly automated MongoDB backup; restore procedure tested at least once.         |
| NFR-18 | RPO ≤ 24 h, RTO ≤ 4 h.                                                            |

### 5.4 Security

| ID     | Requirement                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| NFR-19 | Every request is authenticated and authorized; there is no implicitly trusted path.                        |
| NFR-20 | Every tenant-scoped query filters by `workspaceId` server-side — never from a client-supplied value alone. |
| NFR-21 | Passwords hashed with bcrypt, cost ≥ 12.                                                                   |
| NFR-22 | Refresh tokens are stored hashed and rotated on use.                                                       |
| NFR-23 | All traffic over HTTPS; HSTS enabled.                                                                      |
| NFR-24 | Secrets come from the environment; none is committed to the repository.                                    |
| NFR-25 | OWASP Top 10 reviewed and each item explicitly addressed (§22).                                            |
| NFR-26 | Dependency audit runs in CI; the build fails on a high-severity advisory.                                  |

### 5.5 Maintainability

| ID     | Requirement                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------ |
| NFR-27 | Layered backend: route → middleware → controller → service → repository/model. Controllers hold no business logic. |
| NFR-28 | ESLint + Prettier enforced in CI.                                                                                  |
| NFR-29 | Coverage thresholds enforced in CI (§21.6).                                                                        |
| NFR-30 | Every module has a short README explaining its responsibility.                                                     |
| NFR-31 | Architecture Decision Records for every significant choice (§26.5).                                                |

### 5.6 Usability & accessibility

| ID     | Requirement                                                                 |
| ------ | --------------------------------------------------------------------------- |
| NFR-32 | Responsive from 360 px upward.                                              |
| NFR-33 | Keyboard-accessible primary flows; visible focus states.                    |
| NFR-34 | Colour contrast meets WCAG AA.                                              |
| NFR-35 | Every async surface has explicit loading, empty, error, and success states. |
| NFR-36 | Destructive actions require confirmation and state the consequence.         |

---

## 6. System Architecture

### 6.1 Component view

```
                              INTERNET
                                 │
                                 │ HTTPS (443)
                                 ▼
                    ┌────────────────────────┐
                    │         NGINX          │
                    │  TLS · gzip · routing  │
                    └───────┬────────┬───────┘
                            │        │
              /  (static)   │        │  /api/*, /socket.io
                            ▼        ▼
                 ┌──────────────┐  ┌──────────────────────┐
                 │ React SPA    │  │  Node / Express API  │
                 │ (built, CDN- │  │  + Socket.IO server  │
                 │  cacheable)  │  │  stateless, N replicas│
                 └──────────────┘  └───┬───────┬──────┬───┘
                                       │       │      │
                        ┌──────────────┘       │      └──────────────┐
                        ▼                      ▼                     ▼
                 ┌─────────────┐        ┌─────────────┐       ┌─────────────┐
                 │  MongoDB    │        │   Redis     │       │ S3 /        │
                 │ (system of  │        │ cache ·     │       │ Cloudinary  │
                 │  record)    │        │ rate limit ·│       │ (blobs)     │
                 └─────────────┘        │ pub/sub ·   │       └─────────────┘
                                        │ queue       │
                                        └──────┬──────┘
                                               │ BullMQ
                                               ▼
                                     ┌───────────────────┐
                                     │  Worker process   │
                                     │ email · files ·   │
                                     │ digests · cleanup │
                                     └─────────┬─────────┘
                                               ▼
                                     ┌───────────────────┐
                                     │  Email provider   │
                                     └───────────────────┘
```

### 6.2 Why each component exists

| Component              | Responsibility                                                                    | Why not do it elsewhere                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Nginx**              | TLS termination, static serving, reverse proxy, compression, connection limits    | Node should not terminate TLS or serve static assets in production — Nginx is faster and lets the app restart without dropping the edge. |
| **React SPA**          | Rendering, client routing, optimistic UI, local view state                        | Server rendering adds complexity the product does not need; the app is behind a login and not SEO-sensitive.                             |
| **Express API**        | HTTP contract, validation, authN/authZ, business logic, persistence orchestration | Single source of truth for rules. The client is never trusted.                                                                           |
| **Socket.IO**          | Push of task/comment/notification/presence events                                 | Polling would be wasteful and laggy; these events are server-originated.                                                                 |
| **MongoDB**            | System of record                                                                  | Flexible document shape fits nested task/comment data; the team knows it.                                                                |
| **Redis — cache**      | Hot read acceleration (dashboard, permissions, member lists)                      | Repeating expensive aggregations on every request is the wrong default.                                                                  |
| **Redis — rate limit** | Shared counters across API replicas                                               | In-process counters break the moment there are two replicas.                                                                             |
| **Redis — pub/sub**    | Socket.IO adapter across replicas                                                 | Without it, a socket connected to replica A never sees an event emitted on replica B.                                                    |
| **Redis — queue**      | BullMQ job backing store                                                          | Already present, and gives durability, retries, delays, and priorities.                                                                  |
| **Worker**             | Slow, retryable, failure-tolerant work                                            | An HTTP request must not wait on 100 emails or an image resize.                                                                          |
| **Object storage**     | Binary blobs                                                                      | Databases are bad, expensive file servers. Mongo stores only metadata.                                                                   |

### 6.3 Request lifecycle (canonical path)

```
HTTP request
   │
   ├─ nginx                  TLS, proxy headers, body-size cap
   ├─ helmet                 security headers
   ├─ cors                   origin allowlist
   ├─ requestId              correlation id → AsyncLocalStorage
   ├─ httpLogger             structured request log
   ├─ bodyParser             size-limited JSON / multipart
   ├─ rateLimiter            Redis counter → 429
   ├─ authenticate           verify access token → req.user
   ├─ resolveWorkspace       header/param → membership lookup → req.workspace, req.role
   ├─ authorize(permission)  RBAC matrix check → 403
   ├─ validate(schema)       Zod parse of body/params/query
   ├─ enforcePlanLimit()     (writes only) quota check → 403 LIMIT_REACHED
   │
   ├─ controller             HTTP in, HTTP out. No business logic.
   │     └─ service          business rules, transactions, cache, events
   │           ├─ repository / Mongoose model
   │           ├─ cache      Redis get/set/invalidate
   │           ├─ queue      enqueue background jobs
   │           └─ events     emit socket + audit events
   │
   ├─ response envelope      { success, data, message }
   └─ errorHandler           AppError → typed envelope; unknown → 500 + log
```

**Rule:** every layer has one job. If a controller queries Mongo, or a service formats an HTTP status, the layering has been violated.

### 6.4 Runtime processes

| Process     | Command                                       | Scales on                    |
| ----------- | --------------------------------------------- | ---------------------------- |
| `api`       | `node src/server.js`                          | Request volume               |
| `worker`    | `node src/worker.js`                          | Job backlog                  |
| `scheduler` | Repeatable BullMQ jobs registered at API boot | Single instance (use a lock) |

The API and the worker share the `src/` codebase but have different entry points. The worker never listens on HTTP.

### 6.5 Environments

| Environment  | Purpose                     | Data                                          | Deploy                  |
| ------------ | --------------------------- | --------------------------------------------- | ----------------------- |
| `local`      | Development                 | Seeded, disposable                            | `docker compose up`     |
| `test`       | Automated tests             | Ephemeral (in-memory Mongo / test containers) | CI                      |
| `staging`    | Pre-production verification | Anonymised seed                               | Auto on merge to `main` |
| `production` | Live                        | Real                                          | Manual promotion / tag  |

---

## 7. Multi-Tenancy Strategy

Multi-tenancy is the spine of this product. Get it wrong and every other feature inherits the bug.

### 7.1 Model chosen

**Shared database, shared collections, row-level isolation by `workspaceId`.**

| Option                                  | Isolation            | Cost   | Ops burden                     | Verdict                |
| --------------------------------------- | -------------------- | ------ | ------------------------------ | ---------------------- |
| Database per tenant                     | Strongest            | High   | High (N migrations, N backups) | Rejected — wrong scale |
| Collection per tenant                   | Strong               | Medium | High (unbounded collections)   | Rejected               |
| **Shared, `workspaceId` discriminator** | Application-enforced | Low    | Low                            | **Chosen**             |

**Consequence accepted:** isolation is now an _application_ guarantee, not an infrastructure one. That raises the bar on discipline — hence the rules below.

### 7.2 Isolation rules (non-negotiable)

1. Every tenant-owned document carries `workspaceId`, and it is **required and immutable**.
2. Every compound index begins with `workspaceId`.
3. The active workspace is resolved from an authenticated **membership lookup**, never trusted from the request body.
4. Every read and write filters by `req.workspace._id` — no exceptions, including "internal" helper functions.
5. `findById` is banned for tenant-owned entities. Use `findOne({ _id, workspaceId })`.
6. A miss on a tenant-scoped lookup returns **`404`**, not `403` — do not confirm the existence of another tenant's records.
7. Cross-tenant attempts are audit-logged as security events.
8. Repository helpers take the workspace scope as a required argument, so forgetting it is a type/arity error rather than a silent leak.

### 7.3 Workspace resolution middleware

```
Request
  ↓ authenticate                → req.user
  ↓ read X-Workspace-Id header (or :workspaceSlug route param)
  ↓ Redis lookup  membership:{userId}:{workspaceId}   (TTL 5 min)
      hit  → role
      miss → Mongo Membership.findOne({ userId, workspaceId, status: ACTIVE })
             → cache it
  ↓ not found / suspended → 403 NOT_A_MEMBER
  ↓ req.workspace = { id, slug, plan }
  ↓ req.role = OWNER | ADMIN | MANAGER | MEMBER | VIEWER
  ↓ next()
```

Membership cache is invalidated on role change, member removal, and workspace suspension.

### 7.4 Verification strategy

Isolation is only real if it is tested. A dedicated suite (`tests/security/tenant-isolation.spec.js`) runs against **every** tenant-scoped endpoint:

```
Setup:  Workspace A (userA)   Workspace B (userB, owns entity X)

For each endpoint E and entity X of Workspace B:
    userA calls E with X's id
    ASSERT status is 404 or 403
    ASSERT the response body contains no field of X
    ASSERT a security audit entry was written
```

This suite is generated from the route table so that a new endpoint without a test is a visible gap. **A new tenant-scoped endpoint may not merge without an entry here.**

---

## 8. Data Model & Index Design

### 8.1 Entity relationships

```
User ─────────< Membership >───── Workspace
                                     │
                                     ├──< Project ──< Task ──< Comment
                                     │                 │         └──< Attachment
                                     │                 └──< Attachment
                                     ├──< Invitation
                                     ├──< Notification
                                     ├──< ActivityLog / AuditLog
                                     └──1 Subscription
```

### 8.2 Modelling principles

| Principle                                                | Application here                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Embed what is read together and bounded**              | Task labels, checklist items, denormalised `assigneeName` for board rendering.                        |
| **Reference what is unbounded or shared**                | Comments, attachments, memberships — these grow without limit.                                        |
| **Never embed an unbounded array**                       | Comments on a task can reach thousands; embedding invites the 16 MB document limit and rewrite churn. |
| **Denormalise deliberately, and record the update path** | If `assigneeName` is stored on a task, a rename must fan out — that job is specified, not assumed.    |
| **Index for the query, not for the field**               | Indexes are derived from the actual access patterns in §8.11.                                         |
| **Tenant key first**                                     | Every compound index starts with `workspaceId`.                                                       |

### 8.3 `users`

| Field                     | Type     | Notes                                                         |
| ------------------------- | -------- | ------------------------------------------------------------- |
| `_id`                     | ObjectId |                                                               |
| `name`                    | String   | 2–60 chars                                                    |
| `email`                   | String   | lowercased, **unique**, immutable after verification          |
| `passwordHash`            | String   | bcrypt, never selected by default                             |
| `avatarUrl`               | String?  | object-storage URL                                            |
| `isEmailVerified`         | Boolean  | default `false`                                               |
| `emailVerifiedAt`         | Date?    |                                                               |
| `timezone`                | String   | IANA, default `UTC`                                           |
| `isPlatformAdmin`         | Boolean  | default `false` — platform role, unrelated to workspace roles |
| `status`                  | Enum     | `ACTIVE`, `SUSPENDED`, `DELETED`                              |
| `passwordChangedAt`       | Date     | used to invalidate tokens issued before it                    |
| `lastLoginAt`             | Date?    |                                                               |
| `createdAt` / `updatedAt` | Date     |                                                               |

> **Not stored here:** roles. Role is a property of the _membership_, not the user — a user can be `OWNER` in one workspace and `VIEWER` in another. Putting a role on the user is the single most common multi-tenant modelling mistake.

### 8.4 `workspaces`

| Field                     | Type            | Notes                                                                    |
| ------------------------- | --------------- | ------------------------------------------------------------------------ |
| `_id`                     | ObjectId        | tenant key                                                               |
| `name`                    | String          |                                                                          |
| `slug`                    | String          | **unique**, URL-safe                                                     |
| `ownerId`                 | ObjectId → User | exactly one                                                              |
| `logoUrl`                 | String?         |                                                                          |
| `settings`                | Object          | `{ timezone, defaultTaskStatus, allowMemberInvites }`                    |
| `status`                  | Enum            | `ACTIVE`, `SUSPENDED`, `PENDING_DELETION`                                |
| `deletionScheduledAt`     | Date?           | drives the purge job                                                     |
| `counters`                | Object          | `{ projects, tasks, members, storageBytes }` — incremental usage (§17.3) |
| `createdAt` / `updatedAt` | Date            |                                                                          |

### 8.5 `memberships`

The join between users and workspaces, and the home of the role.

| Field         | Type                 | Notes                                           |
| ------------- | -------------------- | ----------------------------------------------- |
| `userId`      | ObjectId → User      |                                                 |
| `workspaceId` | ObjectId → Workspace |                                                 |
| `role`        | Enum                 | `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER` |
| `status`      | Enum                 | `ACTIVE`, `INVITED`, `REMOVED`                  |
| `invitedBy`   | ObjectId? → User     |                                                 |
| `joinedAt`    | Date                 |                                                 |

**Constraint:** unique on `{ userId, workspaceId }`. Exactly one `OWNER` per workspace, enforced in the service layer on transfer.

### 8.6 `projects`

| Field                   | Type             | Notes                                                                                                     |
| ----------------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `workspaceId`           | ObjectId         | required, immutable                                                                                       |
| `name`                  | String           |                                                                                                           |
| `key`                   | String           | e.g. `WEB` — unique per workspace, used in task keys                                                      |
| `description`           | String?          |                                                                                                           |
| `status`                | Enum             | `PLANNING`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `ARCHIVED`                                             |
| `priority`              | Enum             | `LOW`, `MEDIUM`, `HIGH`, `URGENT`                                                                         |
| `startDate` / `dueDate` | Date?            |                                                                                                           |
| `leadId`                | ObjectId? → User |                                                                                                           |
| `memberIds`             | [ObjectId]       | bounded (≤ plan seat limit) → embedding an array of ids is safe and makes membership checks a single read |
| `taskCounter`           | Number           | last issued task number, incremented atomically for `WEB-101`                                             |
| `stats`                 | Object           | `{ totalTasks, completedTasks }` — maintained incrementally for progress without a count query            |
| `isArchived`            | Boolean          |                                                                                                           |
| `createdBy`             | ObjectId → User  |                                                                                                           |

### 8.7 `tasks`

The hottest collection; model it for the board query.

| Field             | Type             | Notes                                                                        |
| ----------------- | ---------------- | ---------------------------------------------------------------------------- |
| `workspaceId`     | ObjectId         | required, immutable                                                          |
| `projectId`       | ObjectId         | required, immutable                                                          |
| `key`             | String           | `WEB-101`, unique per project                                                |
| `title`           | String           |                                                                              |
| `description`     | String?          |                                                                              |
| `status`          | Enum             | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`                                   |
| `priority`        | Enum             | `LOW`, `MEDIUM`, `HIGH`, `URGENT`                                            |
| `assigneeId`      | ObjectId? → User |                                                                              |
| `assignee`        | Object?          | `{ name, avatarUrl }` — denormalised for board rendering without a `$lookup` |
| `reporterId`      | ObjectId → User  |                                                                              |
| `dueDate`         | Date?            |                                                                              |
| `labels`          | [String]         | bounded, embedded                                                            |
| `checklist`       | [{ text, done }] | bounded, embedded — always read with the task                                |
| `rank`            | String           | fractional/lexicographic rank for ordering within a column                   |
| `attachmentCount` | Number           | avoids a count query per card                                                |
| `commentCount`    | Number           | same                                                                         |
| `completedAt`     | Date?            | powers completion charts                                                     |
| `isDeleted`       | Boolean          | soft delete                                                                  |
| `createdBy`       | ObjectId → User  |                                                                              |

**Ordering decision.** A numeric `position` per column forces rewriting every card below the insertion point. A **lexicographic rank string** (`LexoRank`-style) means a move writes exactly one document. Rebalancing runs as a rare background job when ranks converge.

### 8.8 `comments`

| Field                                | Type            | Notes                                                                        |
| ------------------------------------ | --------------- | ---------------------------------------------------------------------------- |
| `workspaceId`, `projectId`, `taskId` | ObjectId        | denormalised ancestry — allows a workspace-wide comment search without joins |
| `authorId`                           | ObjectId → User |                                                                              |
| `body`                               | String          | sanitized on write                                                           |
| `mentions`                           | [ObjectId]      | parsed and validated server-side against project members                     |
| `parentId`                           | ObjectId?       | one level of threading                                                       |
| `editedAt`                           | Date?           |                                                                              |
| `isDeleted`                          | Boolean         | soft delete keeps thread continuity                                          |

### 8.9 Supporting collections

| Collection      | Purpose                       | Key fields                                                                                                     |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `attachments`   | File metadata                 | `workspaceId`, `taskId?`, `commentId?`, `uploaderId`, `filename`, `mimeType`, `sizeBytes`, `storageKey`, `url` |
| `invitations`   | Pending invites               | `workspaceId`, `email`, `role`, `tokenHash`, `expiresAt`, `status`, `invitedBy`                                |
| `notifications` | In-app inbox                  | `workspaceId`, `userId`, `type`, `title`, `body`, `entity {type,id}`, `isRead`, `createdAt`                    |
| `activitylogs`  | Human-readable feed           | `workspaceId`, `projectId?`, `actorId`, `action`, `entity`, `metadata`, `createdAt`                            |
| `auditlogs`     | Append-only compliance record | `workspaceId?`, `actorId?`, `action`, `entity`, `before`, `after`, `ip`, `userAgent`, `requestId`, `createdAt` |
| `subscriptions` | Plan state                    | `workspaceId` (unique), `plan`, `status`, `limits`, `currentPeriodStart/End`, `changedBy`                      |
| `refreshtokens` | Session store                 | `userId`, `tokenHash`, `family`, `userAgent`, `ip`, `expiresAt`, `revokedAt?`, `replacedBy?`                   |
| `taskhistory`   | Field-level change log        | `workspaceId`, `taskId`, `actorId`, `field`, `from`, `to`, `createdAt`                                         |

### 8.10 Access patterns → index design

Indexes are derived from queries, not guessed. The dominant queries:

| #   | Query                                                                  | Frequency                 |
| --- | ---------------------------------------------------------------------- | ------------------------- |
| Q1  | Board: tasks by project + status, ordered by rank                      | Very high                 |
| Q2  | My Tasks: tasks by workspace + assignee, open only                     | High                      |
| Q3  | Task list with filters (status, priority, assignee, due) + sort + page | High                      |
| Q4  | Comments for a task, newest first, paged                               | High                      |
| Q5  | Unread notifications for a user in a workspace                         | Very high (polling badge) |
| Q6  | Membership by user + workspace                                         | Every request (cached)    |
| Q7  | Activity feed by workspace, newest first                               | Medium                    |
| Q8  | Global text search over tasks/projects/comments                        | Medium                    |
| Q9  | Dashboard aggregates by workspace                                      | Medium (cached)           |

### 8.11 Index catalogue

| Collection      | Index                                                       | Serves          | Notes                               |
| --------------- | ----------------------------------------------------------- | --------------- | ----------------------------------- |
| `users`         | `{ email: 1 }` unique                                       | login           |                                     |
| `workspaces`    | `{ slug: 1 }` unique                                        | routing         |                                     |
| `memberships`   | `{ userId: 1, workspaceId: 1 }` unique                      | Q6              | the hottest index in the system     |
| `memberships`   | `{ workspaceId: 1, role: 1, status: 1 }`                    | member list     |                                     |
| `projects`      | `{ workspaceId: 1, isArchived: 1, updatedAt: -1 }`          | project list    |                                     |
| `projects`      | `{ workspaceId: 1, key: 1 }` unique                         | key generation  |                                     |
| `tasks`         | `{ workspaceId: 1, projectId: 1, status: 1, rank: 1 }`      | **Q1**          | covers the board query and its sort |
| `tasks`         | `{ workspaceId: 1, assigneeId: 1, status: 1, dueDate: 1 }`  | **Q2**          |                                     |
| `tasks`         | `{ workspaceId: 1, projectId: 1, priority: 1, dueDate: 1 }` | Q3              |                                     |
| `tasks`         | `{ workspaceId: 1, completedAt: -1 }` sparse                | Q9 charts       |                                     |
| `tasks`         | text index on `title`, `description`                        | Q8              |                                     |
| `comments`      | `{ taskId: 1, createdAt: -1 }`                              | Q4              |                                     |
| `comments`      | `{ workspaceId: 1, createdAt: -1 }`                         | search/feed     |                                     |
| `notifications` | `{ userId: 1, workspaceId: 1, isRead: 1, createdAt: -1 }`   | **Q5**          |                                     |
| `notifications` | `{ createdAt: 1 }` TTL 90 days                              | pruning         | TTL index replaces a cleanup job    |
| `activitylogs`  | `{ workspaceId: 1, createdAt: -1 }`                         | Q7              |                                     |
| `auditlogs`     | `{ workspaceId: 1, action: 1, createdAt: -1 }`              | audit filter    |                                     |
| `invitations`   | `{ tokenHash: 1 }` unique                                   | accept flow     |                                     |
| `invitations`   | `{ workspaceId: 1, email: 1, status: 1 }`                   | duplicate check |                                     |
| `refreshtokens` | `{ tokenHash: 1 }` unique                                   | refresh         |                                     |
| `refreshtokens` | `{ expiresAt: 1 }` TTL                                      | auto-cleanup    |                                     |
| `subscriptions` | `{ workspaceId: 1 }` unique                                 | limit checks    |                                     |

**Index review gate (Phase 9):** run `explain("executionStats")` on Q1–Q9 against the seed dataset. Any `COLLSCAN` on a hot path, or `totalDocsExamined` far exceeding `nReturned`, is a defect to fix before the phase closes.

### 8.12 Transactions & concurrency

| Situation                                                                     | Approach                                                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Task key generation (`WEB-101`)                                               | `findOneAndUpdate` with `$inc` on `projects.taskCounter` — atomic, no read-then-write race |
| Accept invitation (create membership + update invitation + increment counter) | Multi-document transaction (requires a replica set — enabled in Compose)                   |
| Usage counters                                                                | Atomic `$inc` on the workspace document; never read-modify-write                           |
| Concurrent task edits                                                         | Optimistic concurrency via a `version` field; conflicting write returns `409 CONFLICT`     |
| Board move                                                                    | Single-document update of `status` + `rank`                                                |

---

## 9. API Design Standards

### 9.1 Resource map

```
/api/v1
├── /auth
│   ├── POST   /register              POST /login            POST /logout
│   ├── POST   /refresh               POST /verify-email     POST /resend-verification
│   ├── POST   /forgot-password       POST /reset-password   PATCH /change-password
│   └── GET    /sessions              DELETE /sessions/:id   DELETE /sessions
├── /users
│   ├── GET    /me                    PATCH /me              POST  /me/avatar
├── /workspaces
│   ├── GET    /                      POST  /
│   ├── GET    /:id                   PATCH /:id             DELETE /:id
│   ├── POST   /:id/transfer-ownership
│   ├── GET    /:id/members           PATCH /:id/members/:memberId   DELETE /:id/members/:memberId
│   ├── GET    /:id/invitations       POST  /:id/invitations         DELETE /:id/invitations/:invId
│   ├── GET    /:id/activity          GET   /:id/audit
│   ├── GET    /:id/dashboard         GET   /:id/search
│   └── GET    /:id/usage
├── /invitations
│   ├── GET    /:token                POST  /:token/accept
├── /projects
│   ├── GET    /                      POST  /
│   ├── GET    /:id                   PATCH /:id             DELETE /:id
│   ├── POST   /:id/archive           GET   /:id/members     POST /:id/members
│   └── GET    /:id/stats
├── /tasks
│   ├── GET    /                      POST  /
│   ├── GET    /:id                   PATCH /:id             DELETE /:id
│   ├── PATCH  /:id/move              PATCH /:id/assign
│   ├── GET    /:id/history           GET   /:id/attachments  POST /:id/attachments
├── /comments
│   ├── GET    /?taskId=              POST  /
│   ├── PATCH  /:id                   DELETE /:id
├── /notifications
│   ├── GET    /                      PATCH /:id/read         PATCH /read-all
│   └── GET    /preferences           PATCH /preferences
├── /subscriptions
│   ├── GET    /current               GET   /plans            PATCH /plan
└── /admin
    ├── GET    /workspaces            PATCH /workspaces/:id
    ├── GET    /users                 GET   /metrics
    └── GET    /queues                POST  /queues/:name/retry
```

### 9.2 Response envelope

Every response, without exception, uses one of these two shapes.

**Success**

```json
{
  "success": true,
  "data": {},
  "message": "Task created successfully"
}
```

**Paginated success**

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 143,
    "totalPages": 8,
    "hasNext": true
  },
  "message": "Tasks retrieved"
}
```

**Error**

```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task does not exist",
    "details": [{ "field": "title", "issue": "Title must be at least 3 characters" }]
  },
  "requestId": "b8f2c1a4-..."
}
```

`details` appears only for validation errors. `requestId` appears on every error so a user-reported failure maps to a log line.

### 9.3 Status code policy

| Code  | Used for                                                   |
| ----- | ---------------------------------------------------------- |
| `200` | Successful read or update                                  |
| `201` | Resource created (with `Location` header)                  |
| `204` | Successful delete, no body                                 |
| `400` | Malformed request / validation failure                     |
| `401` | Missing, expired, or invalid credentials                   |
| `403` | Authenticated but not permitted — includes `LIMIT_REACHED` |
| `404` | Not found **or** not visible to this tenant                |
| `409` | Conflict — duplicate slug/key, version conflict            |
| `413` | Payload/file too large                                     |
| `422` | Semantically invalid (e.g. `dueDate` before `startDate`)   |
| `429` | Rate limit exceeded (includes `Retry-After`)               |
| `500` | Unhandled server error — never leaks a stack trace         |
| `503` | Dependency unavailable (readiness failure)                 |

### 9.4 Conventions

| Concern         | Rule                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Naming          | Plural, lower-case, kebab-case resources; camelCase JSON fields                                                                |
| Verbs           | `POST` create, `GET` read, `PATCH` partial update, `PUT` avoided, `DELETE` remove                                              |
| Tenant scope    | `X-Workspace-Id` header on every workspace-scoped call                                                                         |
| Idempotency     | `Idempotency-Key` header honoured on `POST /invitations` and `POST /tasks`                                                     |
| Filtering       | Query params, whitelisted per endpoint: `?status=&priority=&assigneeId=&dueFrom=&dueTo=`                                       |
| Sorting         | `?sort=-createdAt,title` — leading `-` is descending; fields whitelisted                                                       |
| Pagination      | `?page=&limit=` (max 100) for tables; `?cursor=&limit=` for feeds                                                              |
| Field selection | `?fields=id,title,status` where supported                                                                                      |
| Dates           | ISO 8601 UTC in, ISO 8601 UTC out. The client localises.                                                                       |
| Ids             | Serialised as `id` (string), never leaking `_id`/`__v`                                                                         |
| Versioning      | Path-based `/api/v1`. Breaking changes create `/v2`; both run during a deprecation window announced by a `Deprecation` header. |

### 9.5 Documentation

OpenAPI 3.1 spec assembled from per-route definitions and served at `/api/docs` (Swagger UI, non-production only by default). CI fails when a route exists without a spec entry — documentation drift is a build error, not a chore.

---

## 10. Authentication Design

### 10.1 Token strategy

| Token                             | Lifetime | Storage                                                                       | Contents                                                           |
| --------------------------------- | -------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Access token** (JWT)            | 15 min   | Memory in the SPA (never `localStorage`)                                      | `sub`, `email`, `isPlatformAdmin`, `iat`, `exp`, `jti`             |
| **Refresh token** (opaque random) | 7 days   | `httpOnly`, `Secure`, `SameSite=Strict` cookie, path-scoped to `/api/v1/auth` | Nothing — it is a random 256-bit value; its hash is a database row |

**Why the access token carries no role.** Roles are per workspace and can change mid-session. Embedding them would either force re-login on every role change or allow a stale privileged token. The role is resolved per request from the (cached) membership.

**Why the refresh token is opaque, not a JWT.** It must be revocable. A stateless JWT cannot be revoked without a blocklist, which is a session store wearing a disguise — so store the session honestly.

### 10.2 Flows

**Registration**

```
POST /auth/register
  → validate input (Zod)
  → check email uniqueness            → 409 EMAIL_IN_USE
  → hash password (bcrypt, cost 12)
  → create user (isEmailVerified=false)
  → generate verification token (random 32B), store SHA-256 hash + 24h expiry
  → enqueue email job                 ← never sent inline
  → 201 { message: "Check your email" }
```

Registration never reveals whether an email already exists through timing or message differences — the response is uniform and the work is constant-ish.

**Login**

```
POST /auth/login
  → rate limit: 5 attempts / 15 min per IP+email      → 429
  → find user (+passwordHash)
  → bcrypt.compare                    → 401 INVALID_CREDENTIALS (same message for
                                          unknown email and wrong password)
  → require isEmailVerified           → 403 EMAIL_NOT_VERIFIED
  → require status ACTIVE             → 403 ACCOUNT_SUSPENDED
  → issue access token (15 min)
  → issue refresh token: random → store hash + family id + UA + IP
  → Set-Cookie refreshToken (httpOnly, Secure, SameSite=Strict)
  → audit LOGIN_SUCCESS
  → 200 { accessToken, user, workspaces[] }
```

**Refresh with rotation and reuse detection**

```
POST /auth/refresh   (cookie only)
  → hash the presented token, look it up
  → not found                → 401, audit REFRESH_TOKEN_INVALID
  → found but revoked        → REUSE DETECTED:
                                 revoke the entire token family,
                                 audit TOKEN_REUSE_DETECTED (security event),
                                 force re-login → 401
  → expired                  → 401
  → valid:
       revoke the current token, set replacedBy
       issue a new refresh token in the same family
       issue a new access token
  → 200 { accessToken }
```

Reuse detection is the point of rotation: a stolen refresh token is used twice — once by the attacker, once by the legitimate client — and the second use kills the family.

**Password reset**

```
POST /auth/forgot-password
  → ALWAYS respond 200 with a neutral message (no account enumeration)
  → if the user exists: token (32B) → store hash, 30 min expiry → enqueue email

POST /auth/reset-password
  → validate token hash + expiry     → 400 INVALID_RESET_TOKEN
  → set new password hash, set passwordChangedAt
  → revoke ALL refresh tokens for the user
  → enqueue "your password was changed" email
  → audit PASSWORD_RESET
```

### 10.3 Access-token validation middleware

```
Authorization: Bearer <jwt>
  → verify signature and expiry           → 401 TOKEN_EXPIRED / TOKEN_INVALID
  → load user (cached in Redis, TTL 60s)
  → reject if user.status !== ACTIVE
  → reject if token.iat < user.passwordChangedAt   ← kills tokens issued before a reset
  → req.user = { id, email, isPlatformAdmin }
```

### 10.4 Security controls

| Control            | Implementation                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Password policy    | ≥ 10 chars, not in a common-password list, checked server-side                                                                       |
| Hashing            | bcrypt cost 12; re-hash on login if the cost factor has increased                                                                    |
| Brute force        | Redis counters: 5 attempts / 15 min per IP+email, then a 15-minute lockout                                                           |
| Token theft        | Rotation + family revocation + UA/IP recorded per session                                                                            |
| CSRF               | Refresh cookie is `SameSite=Strict` and path-scoped; the access token travels in a header, so it is not auto-attached by the browser |
| Session visibility | Users can list and revoke their own sessions                                                                                         |
| Enumeration        | Uniform responses on register, login, and forgot-password                                                                            |

---

## 11. Authorization & RBAC

### 11.1 The distinction

```
Authentication  →  "Who are you?"       →  401 if unanswered
Authorization   →  "What may you do?"   →  403 if not permitted
Tenancy         →  "Is it yours?"       →  404 if not
```

All three are checked, in that order, on every protected request. Passing one never implies passing another.

### 11.2 Roles

| Role      | Intent                                                                                 |
| --------- | -------------------------------------------------------------------------------------- |
| `OWNER`   | The workspace belongs to them: billing, deletion, ownership transfer, admin management |
| `ADMIN`   | Operates the workspace: members, all projects, settings, audit                         |
| `MANAGER` | Runs delivery: creates projects, assigns work, manages project members                 |
| `MEMBER`  | Does the work: creates and updates tasks, comments, uploads                            |
| `VIEWER`  | Observes: read-only across everything they can see                                     |

Roles are **hierarchical in level** (`OWNER 50 > ADMIN 40 > MANAGER 30 > MEMBER 20 > VIEWER 10`) but permissions are granted **explicitly per role**, not by inheritance alone — an explicit matrix is auditable, whereas inheritance hides surprises.

### 11.3 Permission matrix

Permissions are named `resource:action`. ✅ = allowed, ⚠️ = allowed with a scope condition, ❌ = denied.

| Permission               | OWNER | ADMIN | MANAGER | MEMBER | VIEWER |
| ------------------------ | :---: | :---: | :-----: | :----: | :----: |
| `workspace:read`         |  ✅   |  ✅   |   ✅    |   ✅   |   ✅   |
| `workspace:update`       |  ✅   |  ✅   |   ❌    |   ❌   |   ❌   |
| `workspace:delete`       |  ✅   |  ❌   |   ❌    |   ❌   |   ❌   |
| `workspace:transfer`     |  ✅   |  ❌   |   ❌    |   ❌   |   ❌   |
| `billing:read`           |  ✅   |  ✅   |   ❌    |   ❌   |   ❌   |
| `billing:manage`         |  ✅   |  ❌   |   ❌    |   ❌   |   ❌   |
| `member:read`            |  ✅   |  ✅   |   ✅    |   ✅   |   ✅   |
| `member:invite`          |  ✅   |  ✅   |   ⚠️¹   |   ❌   |   ❌   |
| `member:update_role`     |  ✅   |  ⚠️²  |   ❌    |   ❌   |   ❌   |
| `member:remove`          |  ✅   |  ⚠️²  |   ❌    |   ❌   |   ❌   |
| `project:read`           |  ✅   |  ✅   |   ✅    |  ⚠️³   |  ⚠️³   |
| `project:create`         |  ✅   |  ✅   |   ✅    |   ❌   |   ❌   |
| `project:update`         |  ✅   |  ✅   |   ⚠️⁴   |   ❌   |   ❌   |
| `project:archive`        |  ✅   |  ✅   |   ⚠️⁴   |   ❌   |   ❌   |
| `project:delete`         |  ✅   |  ✅   |   ❌    |   ❌   |   ❌   |
| `project:manage_members` |  ✅   |  ✅   |   ⚠️⁴   |   ❌   |   ❌   |
| `task:read`              |  ✅   |  ✅   |   ✅    |  ⚠️³   |  ⚠️³   |
| `task:create`            |  ✅   |  ✅   |   ✅    |   ✅   |   ❌   |
| `task:update`            |  ✅   |  ✅   |   ✅    |  ⚠️⁵   |   ❌   |
| `task:assign`            |  ✅   |  ✅   |   ✅    |  ⚠️⁶   |   ❌   |
| `task:delete`            |  ✅   |  ✅   |   ⚠️⁴   |   ❌   |   ❌   |
| `comment:create`         |  ✅   |  ✅   |   ✅    |   ✅   |   ❌   |
| `comment:update`         |  ⚠️⁷  |  ⚠️⁷  |   ⚠️⁷   |  ⚠️⁷   |   ❌   |
| `comment:delete`         |  ✅   |  ✅   |   ⚠️⁷   |  ⚠️⁷   |   ❌   |
| `attachment:upload`      |  ✅   |  ✅   |   ✅    |   ✅   |   ❌   |
| `attachment:delete`      |  ✅   |  ✅   |   ⚠️⁷   |  ⚠️⁷   |   ❌   |
| `activity:read`          |  ✅   |  ✅   |   ✅    |   ✅   |   ✅   |
| `audit:read`             |  ✅   |  ✅   |   ❌    |   ❌   |   ❌   |

**Scope conditions**

1. Only if `settings.allowMemberInvites` is enabled, and only at a role at or below `MEMBER`.
2. Cannot act on a member whose role level is ≥ their own; cannot create another `OWNER`.
3. Only projects where the user is in `memberIds`.
4. Only projects they lead or are a member of.
5. Only tasks assigned to them, or which they reported.
6. Only self-assign or unassign themselves.
7. Only their own resource (author check).

### 11.4 Enforcement design

A single permission module is the only source of truth, consumed by both the API and (read-only) the UI:

```
permissions.js
  ROLE_LEVELS       = { OWNER: 50, ADMIN: 40, MANAGER: 30, MEMBER: 20, VIEWER: 10 }
  PERMISSIONS       = { OWNER: [...], ADMIN: [...], ... }
  can(role, permission) -> boolean          ← pure function, unit-tested exhaustively

authorize(permission)                        ← Express middleware, coarse role gate
requireScope(check)                          ← resource-level gate, runs after the entity loads
```

**Two-stage checking, always in this order:**

```
1. Coarse:  can(req.role, 'task:update')            → 403 if false, no DB hit
2. Load:    task = findOne({ _id, workspaceId })    → 404 if null   ← tenancy
3. Fine:    scope condition (assignee? author? project member?) → 403 if false
```

Stage 2 sits deliberately between the two authorization checks: the tenancy filter runs before any ownership logic, so another tenant's entity is never even loaded into a comparison.

**The UI is a mirror, not a gate.** The frontend imports the same `can()` function to hide controls, purely for ergonomics. Hiding a button is never a security control; the test suite asserts the API `403` independently of the UI.

### 11.5 Testing requirement

For every permission in the matrix, an integration test asserts:

- the allowed role receives `2xx`;
- each denied role receives `403`;
- each scope condition is exercised on both sides of its boundary.

This produces roughly 130 assertions and is the highest-value test suite in the project.

---

## 12. Caching Strategy (Redis)

### 12.1 Principle

Cache is added in response to a **measured** cost, never by reflex. Each entry below names what it saves and how it is invalidated. **An entry with no invalidation plan is not permitted.**

### 12.2 Key catalogue

| Key pattern                    | Contents                               | TTL    | Invalidated by                                    |
| ------------------------------ | -------------------------------------- | ------ | ------------------------------------------------- |
| `ws:{wsId}:dashboard`          | Dashboard aggregate result             | 5 min  | Task create/update/delete, project create/archive |
| `ws:{wsId}:members`            | Member list with roles                 | 10 min | Invite accepted, role change, removal             |
| `member:{userId}:{wsId}`       | `{ role, status }` for request scoping | 5 min  | Role change, removal, workspace suspension        |
| `user:{userId}`                | Minimal user for token validation      | 60 s   | Profile update, suspension, password change       |
| `proj:{projectId}:stats`       | `{ total, completed, overdue }`        | 5 min  | Task status change                                |
| `ws:{wsId}:sub`                | Plan + limits                          | 30 min | Plan change                                       |
| `notif:{userId}:{wsId}:unread` | Unread count                           | 60 s   | Notification create / mark-read                   |
| `search:{wsId}:{queryHash}`    | Search results                         | 60 s   | TTL only (short by design)                        |

### 12.3 Patterns

**Cache-aside (the default)**

```
read(key):
   value = redis.get(key)
   if hit    → parse and return
   value = database query
   redis.setex(key, ttl, serialize(value))
   return value
```

**Write-through invalidation.** On a write, delete the affected keys rather than trying to update them — deletion is idempotent and cannot go stale, and the next read repopulates.

**Tag-style invalidation.** Keys are namespaced by workspace so a broad change can clear a set:

```
invalidateWorkspace(wsId) → SCAN + UNLINK on  ws:{wsId}:*
```

`SCAN` with `UNLINK`, never `KEYS` with `DEL` — `KEYS` blocks the Redis event loop and `DEL` frees memory synchronously.

**Stampede protection.** Hot keys (dashboard) use a short lock: the first miss acquires `lock:{key}` with `NX PX 5000` and recomputes while other requests briefly serve stale data or wait.

### 12.4 Rate limiting

Sliding-window counters in Redis, shared across all API replicas.

| Scope                  | Limit             | Key                         |
| ---------------------- | ----------------- | --------------------------- |
| Global per IP          | 300 req / 15 min  | `rl:ip:{ip}`                |
| Authenticated per user | 1000 req / 15 min | `rl:user:{userId}`          |
| Login                  | 5 / 15 min        | `rl:login:{ip}:{emailHash}` |
| Register               | 3 / hour          | `rl:register:{ip}`          |
| Forgot password        | 3 / hour          | `rl:pwreset:{emailHash}`    |
| Invitations            | 50 / hour         | `rl:invite:{wsId}`          |
| File upload            | 30 / hour         | `rl:upload:{userId}`        |
| Search                 | 60 / min          | `rl:search:{userId}`        |

Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` on a `429`.

### 12.5 Other Redis uses

| Use                          | Structure                                            | Notes                                         |
| ---------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| Email/OTP verification codes | `otp:{purpose}:{userId}` string, TTL 5–15 min        | Expiry is the feature — no cleanup job needed |
| Socket.IO adapter            | Pub/Sub channels                                     | Enables multi-replica real-time               |
| Presence                     | `presence:{wsId}` sorted set, score = last heartbeat | Trim entries older than 60 s                  |
| BullMQ                       | Lists/streams managed by the library                 | §13                                           |
| Idempotency keys             | `idem:{key}` → response hash, TTL 24 h               | Prevents duplicate creates on retry           |

### 12.6 Failure policy

Redis is a **performance dependency, not a correctness dependency**, with one deliberate exception.

| Redis down    | Behaviour                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Cache reads   | Fall through to MongoDB; log a warning; the app stays correct                                                                |
| Rate limiting | **Fail closed** on auth endpoints (reject), fail open elsewhere — an outage must not become an open brute-force window       |
| Queues        | Enqueue fails → the API returns `503` for actions that require it (e.g. invitations), rather than silently dropping the work |
| Sockets       | Real-time degrades; the client falls back to polling on reconnect                                                            |

---

## 13. Background Jobs & Queues

### 13.1 The rule

> If work is slow, external, retryable, or scheduled, it does not belong in the request cycle.

```
BAD                                  GOOD
POST /invitations                    POST /invitations
  → send 100 emails (30 s)             → create 100 invitation records (1 write)
  → respond                            → enqueue 100 email jobs
                                       → respond 202 in ~200 ms
Client times out. Emails half-sent.  Worker sends, retries failures, reports.
No retry. No visibility.             Full visibility in the queue dashboard.
```

### 13.2 Queue topology

| Queue          | Concurrency | Jobs                                                                 |
| -------------- | ----------- | -------------------------------------------------------------------- |
| `email`        | 5           | verification, invitation, password reset, notification email, digest |
| `notification` | 10          | fan-out of in-app notifications, socket emit                         |
| `file`         | 3           | image resize, storage deletion, orphan sweep                         |
| `maintenance`  | 1           | usage reconciliation, purge, rank rebalance, cache warm              |
| `analytics`    | 2           | dashboard pre-computation                                            |

### 13.3 Job catalogue

| Job                          | Trigger                                   | Payload                             | Retries | Backoff   | Idempotency key                |
| ---------------------------- | ----------------------------------------- | ----------------------------------- | ------- | --------- | ------------------------------ |
| `email.verification`         | Register / resend                         | `{ userId, token }`                 | 3       | exp 2s    | `verify:{userId}:{tokenHash}`  |
| `email.invitation`           | Invite created                            | `{ invitationId }`                  | 5       | exp 5s    | `invite:{invitationId}`        |
| `email.passwordReset`        | Forgot password                           | `{ userId, token }`                 | 3       | exp 2s    | `reset:{tokenHash}`            |
| `email.notification`         | Notification with email preference        | `{ notificationId }`                | 3       | exp 10s   | `notif-email:{notificationId}` |
| `email.digest`               | Repeatable, daily 08:00 per user timezone | `{ userId, workspaceId }`           | 2       | fixed 60s | `digest:{userId}:{yyyy-mm-dd}` |
| `notification.fanout`        | Task assigned / mention / status change   | `{ event, entityId, recipientIds }` | 3       | exp 2s    | `fanout:{eventId}`             |
| `file.resize`                | Avatar or logo upload                     | `{ attachmentId }`                  | 3       | exp 5s    | `resize:{attachmentId}`        |
| `file.delete`                | Entity deleted                            | `{ storageKey }`                    | 5       | exp 30s   | `del:{storageKey}`             |
| `file.orphanSweep`           | Repeatable, weekly                        | —                                   | 1       | —         | date-based                     |
| `maintenance.reconcileUsage` | Repeatable, nightly                       | `{ workspaceId }`                   | 2       | fixed     | `recon:{wsId}:{date}`          |
| `maintenance.purgeWorkspace` | Delete + 30 days                          | `{ workspaceId }`                   | 3       | exp 60s   | `purge:{wsId}`                 |
| `maintenance.rebalanceRanks` | Ranks converge                            | `{ projectId, status }`             | 2       | fixed     | `rank:{projectId}:{status}`    |
| `task.overdueScan`           | Repeatable, hourly                        | —                                   | 2       | fixed     | hour-based                     |

### 13.4 Reliability rules

| Rule                                                                                                   | Why                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **Every job is idempotent.** Before acting, check an idempotency marker or a state flag on the record. | At-least-once delivery is the norm; a retry after a partial success must not double-send. |
| **Payloads carry ids, not objects.**                                                                   | The worker re-reads current state; a stale embedded snapshot causes wrong output.         |
| **Jobs validate their own preconditions.**                                                             | The invitation may have been revoked between enqueue and execution.                       |
| `removeOnComplete: 1000`, `removeOnFail: 5000`                                                         | Keeps the recent history for debugging without unbounded Redis growth.                    |
| Exponential backoff with jitter                                                                        | Prevents a retry stampede against a struggling provider.                                  |
| Failed jobs are inspectable and re-runnable from the admin panel                                       | A silent dead job is an outage you find out about from a customer.                        |
| Graceful shutdown drains active jobs before exit                                                       | Otherwise a deploy kills in-flight work mid-write.                                        |
| Worker failures log with `requestId` and `jobId`                                                       | Traceability from an HTTP request through to the job that it spawned.                     |

### 13.5 Dead-letter handling

After the final retry the job is marked failed and kept. A daily `maintenance` job counts failures per queue and, above a threshold, raises an alert (log + email to the platform admin). The admin panel exposes retry and discard.

---

## 14. Real-Time Layer

### 14.1 When real-time is used

| Use real-time                                                                | Do **not** use real-time                                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Someone else changes shared state you are looking at (board, task, comments) | Your own actions — those update optimistically from the response          |
| Notifications arriving                                                       | Anything the user must be able to reload to see (that is a read endpoint) |
| Presence                                                                     | Bulk data loads — sockets are not a data-fetch API                        |

### 14.2 Connection and authorization

```
Client connects
   ↓ handshake carries the access token (auth payload, not a query string)
   ↓ server verifies the JWT           → disconnect on failure
   ↓ socket.data.userId = sub
   ↓ client emits "workspace:join" { workspaceId }
   ↓ server verifies membership (same cached lookup as HTTP)   → error if not a member
   ↓ socket joins rooms:
        ws:{workspaceId}              broadcast to the workspace
        user:{userId}                 personal notifications
   ↓ on opening a project/task:
        project:{projectId}           board updates
        task:{taskId}                 comment stream, presence
```

**A socket is authorized exactly as strictly as an HTTP request.** Room membership is granted only after the same membership check — the socket layer is a second front door and must not be a weaker one.

### 14.3 Event catalogue

**Server → client**

| Event                                 | Room           | Payload                                  | Triggered by                                          |
| ------------------------------------- | -------------- | ---------------------------------------- | ----------------------------------------------------- |
| `task:created`                        | `project:{id}` | task summary                             | Task create                                           |
| `task:updated`                        | `project:{id}` | `{ taskId, changes }`                    | Task patch                                            |
| `task:moved`                          | `project:{id}` | `{ taskId, fromStatus, toStatus, rank }` | Board move                                            |
| `task:deleted`                        | `project:{id}` | `{ taskId }`                             | Delete                                                |
| `comment:created`                     | `task:{id}`    | comment                                  | Comment create                                        |
| `comment:updated` / `comment:deleted` | `task:{id}`    | `{ commentId }`                          | Edit/delete                                           |
| `notification:new`                    | `user:{id}`    | notification                             | Fan-out job                                           |
| `presence:update`                     | `task:{id}`    | `{ userIds }`                            | Join/leave/heartbeat                                  |
| `member:role_changed`                 | `user:{id}`    | `{ workspaceId, role }`                  | Role change — the client refetches permissions        |
| `workspace:suspended`                 | `ws:{id}`      | —                                        | Admin action — clients force-logout of that workspace |

**Client → server**

| Event                                | Payload           | Purpose              |
| ------------------------------------ | ----------------- | -------------------- |
| `workspace:join` / `workspace:leave` | `{ workspaceId }` | Scope the connection |
| `project:subscribe` / `unsubscribe`  | `{ projectId }`   | Board room           |
| `task:subscribe` / `unsubscribe`     | `{ taskId }`      | Detail room          |
| `presence:heartbeat`                 | `{ taskId }`      | Every 30 s           |

### 14.4 Multi-replica correctness

`@socket.io/redis-adapter` is mandatory from the moment there is more than one API replica: without it, an event emitted on replica A never reaches a socket held by replica B. This is configured from the start, not retrofitted after a confusing production bug.

### 14.5 Client-side rules

| Rule                                                                             | Reason                                                                   |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Real-time updates patch the React Query cache; they never trigger a full refetch | A refetch storm on every event defeats the purpose                       |
| Ignore events whose `actorId` is the current user                                | The optimistic update already applied them; re-applying causes flicker   |
| Reconnect with backoff; on reconnect, refetch the active view once               | Events emitted while disconnected are lost by design — resync explicitly |
| Sockets never carry authorization decisions                                      | The UI still asks the API before mutating                                |

---

## 15. File Storage & Uploads

### 15.1 Flow

```
React
  ↓ client-side pre-check (type, size)      ← convenience only, never trusted
  ↓ multipart POST /tasks/:id/attachments
Express
  ↓ multer memoryStorage, 10 MB hard limit  → 413 on exceed
  ↓ authorize attachment:upload + tenancy check on the task
  ↓ verify MIME by magic bytes, not by the client-supplied header or extension
  ↓ extension allowlist
  ↓ generate a random storage key: ws/{wsId}/tasks/{taskId}/{uuid}.{ext}
  ↓ plan storage quota check                → 403 LIMIT_REACHED
  ↓ upload to S3 / Cloudinary (private ACL)
  ↓ persist metadata document
  ↓ $inc workspace.counters.storageBytes, task.attachmentCount
  ↓ enqueue file.resize (images only)
  ↓ 201 { id, filename, size, url }
```

### 15.2 Rules

| Concern                 | Decision                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is stored in Mongo | Metadata only: `filename`, `mimeType`, `sizeBytes`, `storageKey`, `uploaderId`                                                                                            |
| Type validation         | Magic-byte sniff **and** extension allowlist. A `.png` that is really a `.html` is rejected.                                                                              |
| Allowlist               | `png, jpg, jpeg, gif, webp, pdf, txt, csv, doc(x), xls(x), zip`                                                                                                           |
| Size                    | 10 MB default; the plan may raise it                                                                                                                                      |
| Filenames               | Never used as storage keys — a UUID is. The original name is stored for display only, sanitized on render.                                                                |
| Access                  | Objects are private. Downloads go through `GET /attachments/:id/download`, which authorizes and then redirects to a short-lived signed URL (5 min).                       |
| Deletion                | Metadata soft-deleted immediately; the object removed by a `file.delete` job (retryable).                                                                                 |
| Orphans                 | A weekly sweep reconciles storage against metadata in both directions.                                                                                                    |
| Untrusted content       | Uploaded files are never served from the application origin — a stored HTML/SVG file must not execute in the app's origin. `Content-Disposition: attachment` on download. |

---

## 16. Search, Filtering & Pagination

### 16.1 Query contract

```
GET /api/v1/tasks
    ?projectId=652f...
    &search=payment
    &status=IN_PROGRESS,IN_REVIEW
    &priority=HIGH,URGENT
    &assigneeId=651a...
    &labels=backend
    &dueFrom=2026-09-01&dueTo=2026-09-30
    &sort=-priority,dueDate
    &page=2&limit=20
```

### 16.2 Building the query safely

```
1. Parse and validate every param with a Zod schema      ← unknown params rejected
2. Start from the mandatory tenant filter:
       filter = { workspaceId: req.workspace.id, isDeleted: false }
3. Apply visibility scope (MEMBER/VIEWER → only their projects)
4. Map each whitelisted filter param to a Mongo clause explicitly
5. Never spread req.query into the filter object     ← this is the NoSQL-injection vector
6. Cast every id with a validated ObjectId conversion
7. Resolve sort from a whitelist map; reject anything else
8. Enforce limit ≤ 100
9. Run the query with .lean() and an explicit projection
```

Rule 5 is not stylistic. `{ ...req.query }` lets a caller send `?status[$ne]=null` and change the meaning of the query. Every filter is constructed field by field.

### 16.3 Pagination

| Style                         | Where                                                        | Why                                                            |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| **Offset** (`page`/`limit`)   | Tables where the user jumps pages: task list, members, audit | Users expect page numbers and totals                           |
| **Cursor** (`cursor`/`limit`) | Feeds and infinite scroll: activity, notifications, comments | Stable under inserts, and does not degrade as the offset grows |

Totals are returned for offset pagination but **counted with a capped `countDocuments`** — an exact count over a huge collection is itself a slow query.

### 16.4 Global search

Phase 7 implementation: MongoDB text indexes over tasks (`title`, `description`), projects (`name`, `description`), and comments (`body`), run in parallel with `Promise.all`, each capped at 5 results per type, all filtered by `workspaceId`.

Results are cached for 60 s under `search:{wsId}:{queryHash}`.

**Documented limitation:** text indexes give no fuzzy matching, no typo tolerance, and no relevance tuning. If search quality becomes a product problem, the migration path is Atlas Search or OpenSearch. This is recorded as ADR-009 rather than discovered later.

---

## 17. Subscriptions, Plans & Usage Limits

### 17.1 Plans

| Quota              | FREE    | PRO    | BUSINESS  |
| ------------------ | ------- | ------ | --------- |
| Projects           | 3       | 50     | Unlimited |
| Members (seats)    | 5       | 50     | Unlimited |
| Tasks              | 100     | 10,000 | Unlimited |
| Storage            | 100 MB  | 10 GB  | 100 GB    |
| File size cap      | 5 MB    | 25 MB  | 100 MB    |
| Activity retention | 30 days | 1 year | Unlimited |
| Advanced analytics | ❌      | ✅     | ✅        |
| Audit log export   | ❌      | ❌     | ✅        |
| API rate limit     | 1×      | 3×     | 10×       |

`Unlimited` is stored as `-1`, not `null` or a large number, so the check is explicit.

### 17.2 Enforcement

Enforcement happens in the **service layer, before the write**, never in a controller and never only in the UI.

```
createProject(workspaceId, data):
    subscription = getSubscription(workspaceId)          ← Redis, 30 min TTL
    usage        = workspace.counters.projects           ← incremental counter
    limit        = subscription.limits.projects

    if limit !== -1 and usage >= limit:
        throw new AppError(403, 'LIMIT_REACHED', {
            resource: 'projects', current: usage, limit,
            message: 'Project limit reached for the FREE plan'
        })

    project = create(...)
    Workspace.updateOne({_id}, { $inc: { 'counters.projects': 1 } })   ← atomic
    invalidate(`ws:${workspaceId}:*`)
```

The error body carries `current` and `limit` so the UI can render "3 of 3 projects used — upgrade to add more" without a second request.

### 17.3 Why counters, not counts

Calling `countDocuments()` on every create is an O(n) query on the hot write path. Instead:

- counters live on the workspace document and move by atomic `$inc`;
- deletes decrement;
- a **nightly reconciliation job** recomputes the true counts and corrects any drift, logging the delta.

Drift is expected in any incremental-counter design; the job is the answer, and its log is the early warning that a code path forgot to decrement.

### 17.4 Plan changes

| Direction  | Behaviour                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upgrade    | Applies immediately; new limits cached; audit entry written                                                                                                                                                |
| Downgrade  | Blocked if current usage exceeds the target plan; the response names exactly what must be reduced ("You have 12 projects; the PRO plan allows 50 — remove 0" / "FREE allows 3 — archive 9 projects first") |
| Suspension | Workspace becomes read-only; writes return `403 WORKSPACE_SUSPENDED`                                                                                                                                       |

### 17.5 v1.1 payment path (designed for, not built)

The subscription document already models `status`, `currentPeriodStart/End`, and `externalCustomerId`, so adding Stripe means adding a checkout endpoint and an idempotent webhook handler — not reshaping the data model.

---

## 18. Notifications

### 18.1 Pipeline

```
Domain event (task assigned)
      ↓ service emits an internal event — the domain does not know about
        channels, only that something happened
      ↓ notification service resolves recipients (assignee, mentioned users,
        watchers) and de-duplicates them
      ↓ excludes the actor            ← never notify someone of their own action
      ↓ applies per-user preferences
      ↓
      ├─ IN-APP: insert notification document
      │            ↓ socket emit to  user:{id}
      │            ↓ invalidate the unread-count key
      └─ EMAIL: enqueue email.notification (immediate) or mark for digest
```

### 18.2 Types

| Type                  | Recipients                              | Default channels |
| --------------------- | --------------------------------------- | ---------------- |
| `TASK_ASSIGNED`       | New assignee                            | in-app + email   |
| `TASK_STATUS_CHANGED` | Assignee, reporter                      | in-app           |
| `TASK_DUE_SOON`       | Assignee (24 h before)                  | in-app + email   |
| `TASK_OVERDUE`        | Assignee, project lead                  | in-app + email   |
| `COMMENT_ADDED`       | Assignee, reporter, thread participants | in-app           |
| `MENTIONED`           | Mentioned users                         | in-app + email   |
| `INVITATION_RECEIVED` | Invitee                                 | email            |
| `MEMBER_JOINED`       | Admins                                  | in-app           |
| `ROLE_CHANGED`        | Affected member                         | in-app + email   |
| `PROJECT_DEADLINE`    | Project members                         | in-app + email   |

### 18.3 Design rules

- The domain service emits an event; it never calls the email provider. Channels are a notification-layer concern.
- The actor is always excluded.
- The unread count is cached with a 60 s TTL and invalidated on write — this endpoint is polled by every open tab.
- Digest emails batch unread notifications per user per day, cutting email volume by roughly an order of magnitude for busy workspaces.
- A TTL index expires notifications after 90 days — a database feature instead of a cron job.

---

## 19. Activity & Audit Logs

Two logs with different jobs. Conflating them is a common mistake: the activity feed is a product feature, the audit log is a compliance record.

|                              | Activity Log                         | Audit Log                                                   |
| ---------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| **Audience**                 | All workspace members                | `ADMIN` and above                                           |
| **Purpose**                  | "What is happening in this project?" | "Who did what, when, from where?"                           |
| **Content**                  | Human-readable summary               | Actor, action, entity, before/after diff, IP, UA, requestId |
| **Retention**                | Plan-dependent (30 d – unlimited)    | Minimum 1 year                                              |
| **Mutability**               | Append-only                          | Append-only, **no update or delete API exists at all**      |
| **Includes security events** | No                                   | Yes — failed logins, denials, token reuse, role changes     |

### 19.1 Writing

Both are written by a single service call at the end of a successful mutation, inside the same service method that performed it, so the log cannot drift from the action. Writes are non-blocking for activity (fire-and-forget with error logging) but awaited for audit — losing an audit record silently is unacceptable.

### 19.2 Audited actions (minimum set)

```
AUTH      login.success · login.failed · logout · password.reset ·
          token.reuse_detected · email.verified
TENANCY   workspace.created/updated/deleted · ownership.transferred ·
          cross_tenant.attempt
MEMBERS   invitation.sent/accepted/revoked · role.changed · member.removed
PROJECTS  project.created/updated/archived/deleted
TASKS     task.created/updated/deleted · task.assigned · task.status_changed
BILLING   plan.changed · limit.reached
SECURITY  permission.denied · rate_limit.exceeded · upload.rejected
ADMIN     workspace.suspended · admin.action
```

---

## 20. Frontend Architecture

### 20.1 Structure (feature-first)

Organising by feature rather than by file type keeps everything a change touches in one folder.

```
src/
├── app/
│   ├── App.jsx                  providers, router
│   ├── router.jsx               route tree, lazy boundaries
│   ├── queryClient.js           React Query defaults
│   └── store.js                 Redux Toolkit (auth + UI only)
├── features/
│   ├── auth/          api/ components/ hooks/ pages/ schemas/
│   ├── workspace/
│   ├── members/
│   ├── projects/
│   ├── tasks/         board/ detail/ list/
│   ├── comments/
│   ├── notifications/
│   ├── dashboard/
│   ├── billing/
│   └── admin/
├── components/
│   ├── ui/            Button Input Select Modal Dropdown Toast Badge Avatar Skeleton
│   ├── layout/        AppShell Sidebar Topbar WorkspaceSwitcher
│   └── feedback/      ErrorBoundary EmptyState LoadingState ErrorState
├── hooks/             useDebounce useAuth usePermissions useSocket useInfiniteList
├── lib/
│   ├── apiClient.js   axios instance, interceptors, refresh queue
│   ├── socket.js      singleton connection manager
│   ├── permissions.js MIRROR of the backend permission module
│   └── format.js      dates, relative time, byte sizes
├── styles/
└── config/
```

### 20.2 State ownership

The most consequential frontend decision: **server state and client state are different problems and use different tools.**

| State               | Owner                      | Examples                                                     |
| ------------------- | -------------------------- | ------------------------------------------------------------ |
| Server data         | **React Query**            | Projects, tasks, comments, notifications, dashboard          |
| Global client state | **Redux Toolkit**          | Access token, current user, active workspace, theme, sidebar |
| Local UI state      | `useState` / `useReducer`  | Modal open, form draft, drag state                           |
| URL state           | React Router search params | Filters, page, active tab, opened task                       |

**Rule:** server data never enters Redux. Caching, invalidation, refetching, and stale handling are React Query's job; duplicating that in Redux is how frontends rot.

Filters live in the URL so a filtered board is shareable and survives a refresh — a small decision with a large usability payoff.

### 20.3 Routing

```
/login  /register  /verify-email  /forgot-password  /reset-password
/invitations/:token                                    (public)

/  → redirect to the last active workspace              (protected)
/workspaces/new
/w/:slug
    /dashboard
    /projects
    /projects/:projectId          → /board | /list | /settings
    /tasks/:taskId                (modal over the board, deep-linkable)
    /my-tasks
    /members
    /activity
    /settings   → /general | /members | /billing | /audit
/admin  → /workspaces | /users | /queues | /metrics     (platform admin)
```

Route guards: `<RequireAuth>` → `<RequireWorkspace>` → `<RequirePermission permission="...">`.

### 20.4 API client

```
axios instance
  ├─ request:  attach Bearer access token
  ├─ request:  attach X-Workspace-Id from the store
  ├─ response: unwrap the { success, data } envelope
  └─ response 401:
        if already refreshing → queue this request
        else → POST /auth/refresh (cookie)
               success → replay every queued request with the new token
               failure → clear auth state, redirect to /login
```

The refresh queue matters: without it, five parallel requests hitting an expired token fire five refreshes, and with rotation enabled four of them present an already-rotated token — which the reuse detector correctly treats as a breach and logs the user out. This is a real bug that this design prevents.

### 20.5 Component conventions

| Concern        | Convention                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Component size | One responsibility; extract at roughly 150 lines                                                |
| Data fetching  | Only in page-level components and custom hooks, never in leaf presentational components         |
| Forms          | React Hook Form + Zod, sharing the schema shape with the backend contract                       |
| Async states   | Every query surface renders loading / empty / error / success — never a bare spinner-or-nothing |
| Lists          | Virtualised beyond 100 rows                                                                     |
| Errors         | `ErrorBoundary` per route; a crash in the board never blanks the app shell                      |
| Memoisation    | `useMemo`/`useCallback` applied to measured cost, not sprinkled by habit                        |
| Accessibility  | Semantic elements, labelled inputs, focus traps in modals, `aria-live` for toasts               |

### 20.6 Optimistic updates

Applied where the failure rate is low and the latency is visible — the board drag being the primary case.

```
onMutate:   cancel in-flight queries for the key
            snapshot the previous cache
            write the expected new state
onError:    restore the snapshot, show a toast explaining the rollback
onSettled:  invalidate to reconcile with the server
```

Not applied to creates that need a server-generated id (task keys), or to anything the user must trust as committed (plan change, member removal).

---

## 21. Testing Strategy

### 21.1 Shape

```
        /\        E2E (Playwright)          ~15 specs   — the 7 CUJs, happy paths
       /  \       Integration (Jest+Supertest) ~150 specs — every endpoint × role
      /    \      Unit (Jest)                  ~200 specs — pure logic
     /______\
```

Weighted toward integration deliberately: in this system the bugs that matter live at the boundaries — authorization, tenancy, validation, limits — and those are exactly what integration tests cover.

### 21.2 Unit tests

Pure functions, no I/O, sub-second.

| Target                       | Cases                                                            |
| ---------------------------- | ---------------------------------------------------------------- |
| `can(role, permission)`      | Every role × every permission — the full matrix                  |
| `checkSubscriptionLimit()`   | Under, at, over, unlimited (`-1`)                                |
| `calculateProjectProgress()` | Zero tasks, all done, partial, rounding                          |
| `generateRank()`             | Between two ranks, at the head, at the tail, convergence trigger |
| `buildTaskFilter()`          | Each param, injection attempts, unknown params rejected          |
| `parseMentions()`            | Valid, unknown user, duplicate, non-member, escaped text         |
| `sanitizeHtml()`             | Script tags, event handlers, `javascript:` URLs                  |
| Token helpers                | Sign, verify, expire, tamper                                     |

### 21.3 Integration tests

Real Express app, real MongoDB (in-memory or a test container), real Redis (test database), external services mocked.

Each endpoint is tested for:

```
✓ 200/201  valid request, permitted role
✓ 401      no token / expired token
✓ 403      each denied role                        ← from the matrix
✓ 403      scope condition violated
✓ 404      entity from another workspace           ← tenant isolation
✓ 400      each validation rule
✓ 409      conflict cases
✓ 429      rate limit
✓          side effects: audit written, cache invalidated, job enqueued
```

Fixtures build the reference scenario (§3.2) so tests read like the product.

### 21.4 E2E tests

Playwright against the Docker Compose stack; one spec per CUJ plus:

- multi-user real-time (two browser contexts: A moves a card, B observes it move);
- the permission boundary (a `VIEWER` context sees no create controls);
- the plan limit (a `FREE` workspace hits the wall and sees the upgrade prompt).

### 21.5 Specialist suites

| Suite                                     | Purpose                                                    |
| ----------------------------------------- | ---------------------------------------------------------- |
| `tests/security/tenant-isolation.spec.js` | Generated from the route table (§7.4)                      |
| `tests/security/authz.spec.js`            | The full permission matrix, both directions                |
| `tests/security/injection.spec.js`        | NoSQL operator injection, XSS payloads in every text field |
| `tests/performance/`                      | k6 scripts asserting NFR-01…NFR-06                         |

### 21.6 Coverage and gates

| Area                      | Line coverage target |
| ------------------------- | -------------------- |
| Services (business logic) | 85%                  |
| Permission module         | 100%                 |
| Controllers               | 70%                  |
| Utilities                 | 90%                  |
| Overall backend           | 75%                  |
| Frontend (hooks + logic)  | 60%                  |

CI fails below threshold. Coverage is a floor for confidence, not a score to farm — a 100% covered module with no boundary assertions is worthless, and reviews check assertions, not percentages.

### 21.7 Test data

- `npm run seed` — the reference scenario for manual testing.
- `npm run seed:load` — the performance dataset from §5.1.
- Factories (not fixtures files) for unit and integration tests, so a test states only what it cares about.

---

## 22. Security Plan & Threat Model

### 22.1 Threat model (STRIDE, abbreviated)

| Threat                     | Scenario                                       | Mitigation                                                                                     |
| -------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Spoofing**               | Stolen access token replayed                   | 15-minute expiry; `passwordChangedAt` invalidation; sessions revocable                         |
| **Tampering**              | Client sends `role: OWNER` in a profile update | Role is never accepted from a request body; server-side allowlist on every update              |
| **Repudiation**            | "I never removed that member"                  | Immutable audit log with actor, IP, UA, requestId                                              |
| **Information disclosure** | Cross-tenant id probing (IDOR)                 | Every query filtered by `workspaceId`; `404` on a miss; generated isolation suite              |
| **Denial of service**      | Credential stuffing, upload flooding           | Redis rate limits per IP, user, and endpoint; body and file size caps; Nginx connection limits |
| **Elevation of privilege** | `MEMBER` calls an admin endpoint directly      | Server-side RBAC on every route; UI hiding is never the control                                |

### 22.2 OWASP Top 10 — explicit disposition

| Risk                                  | How it is addressed here                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A01 Broken Access Control**         | The primary risk in this product. Two-stage authorization, mandatory tenant filter, `findById` banned for tenant entities, generated IDOR suite, permission matrix tests. |
| **A02 Cryptographic Failures**        | bcrypt cost 12; tokens hashed at rest; HTTPS + HSTS; secure cookie flags; secrets from the environment only.                                                              |
| **A03 Injection**                     | Zod validation at every edge; explicit filter construction (never spreading `req.query`); Mongoose `sanitizeFilter`; output sanitisation for comment bodies.              |
| **A04 Insecure Design**               | This document. Threat model before code; limits, quotas, and abuse cases designed in.                                                                                     |
| **A05 Security Misconfiguration**     | Helmet; CORS allowlist (no wildcard with credentials); stack traces suppressed in production; Swagger disabled in production; non-root Docker user.                       |
| **A06 Vulnerable Components**         | `npm audit` in CI with a high-severity failure gate; Dependabot; pinned base images.                                                                                      |
| **A07 Auth Failures**                 | Rate limiting and lockout; refresh rotation with reuse detection; no enumeration; session management; strong password policy.                                             |
| **A08 Data Integrity Failures**       | Signed JWTs; lockfile committed and `npm ci` in CI; image digests pinned.                                                                                                 |
| **A09 Logging & Monitoring Failures** | Structured logs with correlation ids; security events audited; failed-job alerting; health checks.                                                                        |
| **A10 SSRF**                          | No user-supplied URL is fetched server-side in v1.0. If added later, an allowlist plus DNS-rebinding protection is required — recorded as a constraint.                   |

### 22.3 Manual security review checklist (Phase 9 gate)

Each item is executed by hand against a running stack, and the result recorded.

```
[ ] Take a task id from Workspace B, call every task endpoint as a Workspace A user
[ ] Call every admin endpoint as MEMBER and as VIEWER
[ ] PATCH /users/me with { role, isPlatformAdmin, workspaceId } and confirm they are ignored
[ ] Send ?status[$ne]=null and similar operator injections on every list endpoint
[ ] Post <script>, <img onerror>, javascript: and SVG payloads in every text field
[ ] Upload a .png that is actually HTML; upload a 100 MB file; upload a double extension
[ ] Reuse a rotated refresh token and confirm family revocation
[ ] Use an access token issued before a password reset
[ ] Hammer /auth/login 100 times and confirm 429 plus lockout
[ ] Confirm no secret, stack trace, or Mongo error text appears in any response body
[ ] Confirm CORS rejects an unknown origin with credentials
[ ] Confirm the FREE plan limit cannot be bypassed by calling the API directly
[ ] Confirm an attachment URL is unusable without authorization and expires
[ ] Confirm a removed member's cached membership stops working immediately
```

### 22.4 Secrets management

Local: `.env` (git-ignored), with a committed `.env.example` listing every key with a dummy value. CI: GitHub Actions secrets. Production: AWS SSM Parameter Store / Secrets Manager, injected as environment variables. A secret is never logged, never returned by an API, and never committed — enforced by a `gitleaks` scan in CI.

---

## 23. Observability & Operations

### 23.1 Logging

Structured JSON via Pino, one line per event.

```json
{
  "level": "info",
  "time": "2026-09-06T10:31:22.104Z",
  "requestId": "b8f2c1a4-...",
  "userId": "651a...",
  "workspaceId": "652f...",
  "method": "PATCH",
  "route": "/api/v1/tasks/:id/move",
  "status": 200,
  "durationMs": 47,
  "msg": "request completed"
}
```

| Rule        | Detail                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| Correlation | `requestId` generated at the edge, propagated via `AsyncLocalStorage`, attached to job payloads, returned on errors |
| Redaction   | `password`, `token`, `authorization`, `cookie`, `passwordHash` redacted by configuration                            |
| Levels      | `error` needs action · `warn` degraded but handled · `info` lifecycle · `debug` local only                          |
| Volume      | No logging inside loops over collections; sample high-frequency events                                              |

### 23.2 Metrics

| Metric                                                                | Why it matters                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| Request rate, error rate, duration (p50/p95/p99) by route             | The core service health signal                               |
| 4xx by code                                                           | A spike in `403` means a permission regression or an attack  |
| Mongo query duration, connection pool saturation                      | The first place latency appears                              |
| Redis hit ratio, latency                                              | A collapsing hit ratio means an invalidation bug             |
| Queue depth, job duration, failure rate by queue                      | Worker health                                                |
| Socket connections, rooms, emit rate                                  | Real-time health                                             |
| Business: signups, active workspaces, tasks/day, limit-reached events | Product signal — `LIMIT_REACHED` is also a conversion signal |

Exposed at `/metrics` (Prometheus format), scraped in production and not exposed publicly.

### 23.3 Health checks

| Endpoint   | Checks                      | Used by                                                   |
| ---------- | --------------------------- | --------------------------------------------------------- |
| `/healthz` | The process is alive        | Container restart policy                                  |
| `/readyz`  | Mongo `ping` + Redis `ping` | Load balancer — drains traffic while a dependency is down |

### 23.4 Alerts (v1 — simple and honest)

| Condition                       | Action                   |
| ------------------------------- | ------------------------ |
| Error rate > 5% for 5 minutes   | Email the platform admin |
| Queue failures > 10 in an hour  | Email                    |
| `/readyz` failing for 2 minutes | Email + restart          |
| Disk > 85%                      | Email                    |
| Nightly backup did not complete | Email                    |

### 23.5 Runbooks (written in Phase 10)

`docs/runbooks/` — one page each for: high error rate, queue backing up, Mongo unreachable, Redis unreachable, restore from backup, rollback a deployment, rotate a leaked secret.

---

## 24. Infrastructure, Docker & CI/CD

### 24.1 Local development

```yaml
# docker-compose.yml — services
frontend    Vite dev server, hot reload, proxies /api to backend
backend     Node with nodemon, debug port exposed
worker      Node with nodemon, shares the backend image
mongodb     mongo:7, single-node replica set (required for transactions)
redis       redis:7-alpine, appendonly enabled
mailhog     SMTP catcher + web UI at :8025 — see every email locally
```

One command, `docker compose up`, produces a complete environment from a clean clone. That is a Phase 1 acceptance criterion, not a Phase 10 nicety — the environment must be reproducible before there is anything to reproduce.

### 24.2 Image strategy

Multi-stage builds; production images run as a non-root user, contain no dev dependencies, and include a `HEALTHCHECK`. The API and worker share one image with different entry commands. `.dockerignore` excludes `node_modules`, `.env`, `.git`, and tests.

### 24.3 CI pipeline (GitHub Actions)

```
on: pull_request, push to main

job: quality           lint · format check · type-aware lint · gitleaks
job: test:unit         jest --coverage, threshold gate
job: test:integration  services: mongo, redis → supertest suite
job: test:e2e          docker compose up → playwright → artifacts on failure
job: audit             npm audit --audit-level=high
job: build             docker build (api, worker, frontend) → push to registry
                       (main only, tagged with the commit sha)
job: deploy:staging    main only, after build
job: deploy:production manual approval, on tag
```

Branch protection on `main`: all checks green, one review, up to date with base, no force push.

### 24.4 Production topology (AWS)

```
Route 53 → ACM certificate → EC2 (or ECS)
   Nginx (host)
      ├── / → static React build (gzip, long-lived cache, hashed filenames)
      └── /api, /socket.io → Node API container(s)
   Worker container(s)
   MongoDB Atlas (managed, automated backups, replica set)
   ElastiCache Redis (or a Redis container for a cost-conscious v1)
   S3 bucket (private) for attachments
   CloudWatch for logs and alarms
```

A pragmatic v1 runs API, worker, Nginx, and Redis on a single EC2 instance with managed MongoDB Atlas, because paying for a multi-node topology before there is traffic is not engineering, it is cosplay. The application is _designed_ to scale out (stateless API, Redis adapter, separate workers) so the move is configuration, not a rewrite.

### 24.5 Deployment procedure

```
1. Tag a release                           2. CI builds and pushes images
3. Manual approval gate                    4. Pull images on the host
5. Run migrations / index sync (idempotent) 6. Rolling restart of API, then worker
7. /readyz verified before traffic returns  8. Smoke test the CUJ-1 path
9. Watch error rate for 15 minutes         10. Rollback = redeploy the previous tag
```

### 24.6 Backups

Nightly automated MongoDB Atlas snapshot with 7-day retention plus a weekly snapshot retained for a month. S3 versioning enabled on the attachments bucket. **Restore is tested once during Phase 10 and the timing recorded** — an untested backup is a belief, not a backup.

---

## 25. Delivery Plan — 10 Phases

### 25.1 Overview

| Phase | Theme                                        | Est.    | Primary risk retired                       |
| ----- | -------------------------------------------- | ------- | ------------------------------------------ |
| 1     | Foundations & environment                    | 3–5 d   | "It works on my machine"                   |
| 2     | React architecture & UI shell                | 7–10 d  | UI rewritten later for lack of structure   |
| 3     | Express API skeleton & contracts             | 5–7 d   | Inconsistent API, logic in controllers     |
| 4     | Data modelling & indexes                     | 5–7 d   | Schema that cannot answer the real queries |
| 5     | Authentication & tenancy                     | 10–14 d | Insecure auth; tenant leakage              |
| 6     | Core domain: projects, tasks, comments       | 14–18 d | Business logic sprawl                      |
| 7     | Redis: cache, rate limits, search, dashboard | 7–10 d  | Cache invalidation bugs                    |
| 8     | Queues, email, real-time                     | 10–12 d | Blocking requests; lost jobs               |
| 9     | Testing, security, performance, billing      | 12–15 d | Shipping something unverified              |
| 10    | Docker, CI/CD, AWS, operations               | 8–10 d  | Undeployable / unoperable                  |

**Total: roughly 80–110 working days** at a steady part-time pace. Estimates assume hand-written code with review, not generated code.

**Sequencing rationale.** The frontend shell comes before the API (Phase 2 before 3) so that the API is designed against real screens instead of imagined ones. Data modelling (4) precedes authentication (5) because auth writes to those collections. Redis (7) is deliberately _after_ the domain works, so caching is applied to measured cost rather than assumed cost. Testing has a dedicated phase (9) but tests are written continuously from Phase 3 onward — Phase 9 is for the specialist suites and the gates.

---

### Phase 1 — Foundations & Environment

**Goal:** a reproducible development environment and the repository skeleton, before any feature exists.

**Deliverables**

- Monorepo layout (`client/`, `server/`, `docker/`, `docs/`).
- ESLint + Prettier + EditorConfig, shared config, enforced by a pre-commit hook.
- `docker-compose.yml`: mongo (replica set), redis, mailhog.
- `.env.example` covering every variable in Appendix A.
- Base Express server: `/healthz`, JSON body parsing, graceful shutdown.
- Base Vite + React + Tailwind app rendering a placeholder shell.
- `README.md` with a from-clone setup path.
- `docs/adr/0001-record-architecture-decisions.md`.
- Git repository initialised, `main` protected, conventional-commit convention documented.

**JavaScript revision focus:** modules (ESM vs CJS), `const`/`let` and scope, destructuring, spread/rest, template literals, the async entry point.

**Definition of Done**

- [ ] A clean clone plus `cp .env.example .env` plus `docker compose up` yields a running stack.
- [ ] `curl localhost:5000/healthz` returns `200`.
- [ ] The React app loads at `localhost:5173`.
- [ ] Lint and format run clean on the whole tree.
- [ ] A committed message that violates the convention is rejected by the hook.

---

### Phase 2 — React Architecture & UI Shell

**Goal:** the full navigational skeleton with mock data — every screen exists and is reachable before any of it is real.

**Deliverables**

- Routing tree per §20.3 with lazy-loaded route groups.
- `AppShell`: sidebar, topbar, workspace switcher, user menu.
- UI primitives: `Button`, `Input`, `Select`, `Textarea`, `Modal`, `Dropdown`, `Toast`, `Badge`, `Avatar`, `Skeleton`, `Table`, `Tabs`.
- Feedback components: `ErrorBoundary`, `EmptyState`, `LoadingState`, `ErrorState`.
- Screens with mock data: login, register, dashboard, project list, Kanban board, task detail, member list, settings.
- Drag-and-drop board working against local state.
- React Query and Redux Toolkit wired with a mock API layer.
- Responsive down to 360 px; dark mode optional.

**React revision focus:** component composition, props, `useState`, `useEffect` and its dependency array, `useMemo`/`useCallback` (applied to measured cost), custom hooks, controlled forms, lifting state, context boundaries, list keys, conditional rendering, portals for modals.

**Definition of Done**

- [ ] Every route in §20.3 renders without console errors.
- [ ] The board supports drag-and-drop across all four columns.
- [ ] Every async surface has visible loading, empty, and error states.
- [ ] No component exceeds ~150 lines without a documented reason.
- [ ] The mock API layer is a single swappable module.
- [ ] Keyboard navigation reaches every interactive control; modals trap focus.

---

### Phase 3 — Express API Skeleton & Contracts

**Goal:** the API's shape, standards, and middleware chain — before there is domain logic to distort them.

**Deliverables**

- Layered structure: `routes/ → middleware/ → controllers/ → services/ → models/`.
- `AppError` class plus a central error handler producing the §9.2 envelope.
- `asyncHandler` wrapper so no route needs a `try/catch` for propagation.
- Request-id middleware with `AsyncLocalStorage` propagation.
- Pino structured logging with redaction.
- Zod validation middleware for `body`, `params`, `query`.
- Response helpers: `ok()`, `created()`, `paginated()`, `noContent()`.
- `/api/v1` router mounting with stub endpoints returning fixed data.
- OpenAPI scaffolding at `/api/docs`.
- Frontend switched from the mock layer to the real axios client against the stubs.

**Node revision focus:** the event loop, `async`/`await` with error propagation, middleware composition, closures in middleware factories, streams vs buffers for uploads, `process` signals for shutdown.

**Definition of Done**

- [ ] Every stub returns the standard envelope.
- [ ] A thrown `AppError` and an unexpected `throw` both produce a correct, non-leaking response.
- [ ] Every response carries `X-Request-Id`, and logs carry the same value.
- [ ] An invalid body returns `400` with per-field `details`.
- [ ] `/api/docs` renders the stubbed spec.
- [ ] The frontend runs end-to-end against the stub API with no mocks left.

---

### Phase 4 — Data Modelling & Indexes

**Goal:** schemas that answer the real queries, with the reasoning written down.

**Deliverables**

- All Mongoose schemas from §8, with validation, enums, defaults, and timestamps.
- Every index from §8.11 declared in the schema and verified as built.
- Seed script producing the reference scenario (§3.2).
- Load-seed script producing the performance dataset (§5.1).
- `explain()` report for queries Q1–Q9, committed to `docs/performance/baseline.md`.
- ADRs for: embed vs reference on comments; the fractional-rank ordering choice; denormalised counters; role on membership rather than user.

**MongoDB revision focus:** embedding vs referencing, compound index prefix rules, covered queries, the aggregation pipeline (`$match`, `$group`, `$lookup`, `$facet`), `.lean()`, projections, atomic `$inc`, TTL indexes, transactions on a replica set.

**Definition of Done**

- [ ] Every tenant-owned schema has a required, immutable `workspaceId`.
- [ ] Every compound index begins with `workspaceId`.
- [ ] Q1–Q9 use an index — zero `COLLSCAN` on the seeded dataset.
- [ ] `npm run seed` and `npm run seed:load` are idempotent and re-runnable.
- [ ] Each modelling ADR states the alternative that was rejected and why.

---

### Phase 5 — Authentication & Multi-Tenancy

**The most security-critical phase.** Nothing here is approximated.

**Deliverables**

- Register, email verification, login, logout, refresh with rotation, forgot/reset/change password, session list and revocation.
- bcrypt hashing; refresh tokens stored hashed with a family id.
- Reuse detection with family revocation.
- `authenticate` middleware including the `passwordChangedAt` check.
- Workspace CRUD; creator becomes `OWNER`.
- `resolveWorkspace` middleware with cached membership lookup.
- Tenant-scoped repository helpers that require a workspace argument.
- Frontend: real auth flows, token in memory, refresh queue, protected routes, workspace switcher.
- Emails sent inline for now, with a `// TODO Phase 8: queue` marker.
- Security audit events for auth and tenancy.

**Definition of Done**

- [ ] Every flow in §10.2 works end to end against MailHog.
- [ ] A rotated refresh token, when replayed, revokes the family and forces re-login.
- [ ] An access token issued before a password reset is rejected.
- [ ] A user in Workspace A receives `404` for every Workspace B entity — proven by tests, not by clicking.
- [ ] Five failed logins produce a `429` and a lockout.
- [ ] Registration, login, and forgot-password reveal nothing about account existence.
- [ ] Refresh cookie is `httpOnly`, `Secure`, `SameSite=Strict`, and path-scoped.
- [ ] Five parallel expired-token requests trigger exactly one refresh.

---

### Phase 6 — Core Domain: Members, Projects, Tasks, Comments

**Goal:** the product becomes real. The largest phase — split into four sub-milestones.

**6a — Members & invitations (3–4 d)**
Invitation create/accept/revoke/resend, role changes with level rules, member removal with task unassignment, member list.

**6b — RBAC (2–3 d)**
The permission module (§11.4), `authorize` and `requireScope` middleware, exhaustive unit tests of `can()`, the mirrored frontend `usePermissions` hook, role-aware UI.

**6c — Projects & tasks (5–6 d)**
Project CRUD and archive, project members, atomic task-key generation, task CRUD, filters/sort/pagination, the move endpoint with fractional ranks, task history, "My Tasks", real Kanban with optimistic updates.

**6d — Comments & attachments (3–4 d)**
Threaded comments, edit/soft-delete, @mention parsing validated against project members, uploads with magic-byte validation, authorized downloads, activity and audit logging on every mutation.

**Definition of Done**

- [ ] Every endpoint in §9.1 for these modules is implemented and documented.
- [ ] Every permission in the §11.3 matrix has a passing allow test and a passing deny test.
- [ ] Task keys are unique and gapless under 50 concurrent creates.
- [ ] A board move writes exactly one document.
- [ ] An upload of a disguised file type is rejected.
- [ ] Every mutation writes an activity entry and, where required, an audit entry.
- [ ] The frontend uses no mock data anywhere.

---

### Phase 7 — Redis: Caching, Rate Limiting, Search, Dashboard

**Goal:** performance work applied to measured cost, not assumed cost.

**Deliverables**

- Cache module: `get`/`set`/`del`/`invalidatePattern` (`SCAN` + `UNLINK`), namespaced keys.
- The cache entries in §12.2 with their invalidation hooks.
- Redis-backed sliding-window rate limiting per §12.4, with standard headers.
- Progressive login lockout.
- Dashboard aggregation pipelines plus caching.
- Global search across four entity types, tenant-scoped, cached.
- Advanced filtering on the frontend with URL-synced state and debounced search.
- Charts on the dashboard.
- A measured before/after report committed to `docs/performance/`.

**Definition of Done**

- [ ] Every cache key has a documented invalidation trigger, and a test proving stale data does not survive a write.
- [ ] Dashboard p95 drops below 100 ms cached, with the before/after numbers recorded.
- [ ] Rate limits return `429` with `Retry-After` and are shared across two API replicas.
- [ ] Redis being stopped degrades performance but does not break reads.
- [ ] Search returns tenant-scoped results in under 300 ms p95 on the load dataset.
- [ ] No `KEYS` command exists anywhere in the codebase.

---

### Phase 8 — Queues, Email & Real-Time

**Goal:** move slow work off the request path and push changes to clients.

**Deliverables**

- BullMQ setup with the five queues in §13.2 and a separate worker entry point.
- Every job in §13.3, each idempotent, each with a retry and backoff policy.
- Email templates (verification, invitation, reset, notification, digest) rendered from a template module.
- All Phase 5 inline emails converted to jobs.
- Bulk invite fan-out.
- Socket.IO server with authenticated handshake, room authorization, and the Redis adapter.
- Every event in §14.3.
- Notification pipeline (§18) with preferences and the daily digest.
- Frontend socket manager: reconnect with backoff, cache patching, self-event filtering, live notification centre, presence indicators.
- Admin queue dashboard.

**Definition of Done**

- [ ] Inviting 100 members responds in under 500 ms and all 100 emails arrive in MailHog.
- [ ] Killing the worker mid-batch and restarting it completes the batch without duplicates.
- [ ] A forced provider failure retries with backoff and lands in failed jobs, visible and retryable in the admin panel.
- [ ] Two browsers: A moves a card, B sees it move in under 500 ms without refreshing.
- [ ] A socket cannot join a room for a workspace the user does not belong to.
- [ ] With two API replicas, an event emitted on one reaches a client on the other.
- [ ] Users never receive notifications for their own actions.

---

### Phase 9 — Testing, Security, Performance & Billing

**Goal:** prove the system, and add the commercial layer that depends on everything else existing.

**Deliverables**

- Unit suite (§21.2) with the permission module at 100%.
- Integration suite covering every endpoint × role × tenant case.
- The generated tenant-isolation suite.
- The injection and XSS suite.
- Playwright E2E for all seven CUJs plus multi-user real-time.
- k6 load scripts asserting NFR-01…NFR-06.
- Manual security checklist (§22.3) executed, with results recorded in `docs/security/review-2026-xx.md`.
- Subscription model, plan definitions, the limit-enforcement service, usage counters, the reconciliation job, billing/usage UI, plan-change flow with downgrade guarding.
- Platform admin panel.
- Index and query review with `explain()`, and fixes.
- Coverage gates enabled in CI.

**Definition of Done**

- [ ] Coverage thresholds (§21.6) met and enforced.
- [ ] Every item on the manual security checklist is executed and recorded, with every finding fixed or explicitly accepted in writing.
- [ ] All NFR performance targets met, with the k6 output committed.
- [ ] A `FREE` workspace is blocked at 3 projects / 5 members / 100 tasks via the API directly, not just the UI.
- [ ] A downgrade below current usage is refused with an actionable message.
- [ ] The reconciliation job corrects deliberately corrupted counters.
- [ ] Zero high-severity findings from `npm audit`.

---

### Phase 10 — Docker, CI/CD, AWS & Operations

**Goal:** the system is deployable, observable, and recoverable by someone other than its author.

**Deliverables**

- Production multi-stage Dockerfiles (non-root, healthchecks, no dev dependencies).
- Production `docker-compose.prod.yml`.
- Nginx configuration: TLS, HTTP/2, gzip, static caching, WebSocket upgrade, security headers, body limits.
- Full GitHub Actions pipeline (§24.3) with branch protection.
- AWS provisioning: EC2, Route 53, ACM, S3 bucket policy, MongoDB Atlas, Redis, CloudWatch.
- Prometheus metrics endpoint and dashboards.
- `/healthz` and `/readyz` wired into the load balancer and restart policy.
- Alerts per §23.4.
- Automated backups plus a **performed and timed** restore drill.
- Runbooks in `docs/runbooks/`.
- Final `ARCHITECTURE.md` with the diagram and the rationale for every component.

**Definition of Done**

- [ ] A push to `main` deploys to staging with no manual step.
- [ ] A tagged release deploys to production after approval.
- [ ] The production site serves HTTPS with a valid certificate and an A-grade TLS configuration.
- [ ] All seven CUJs pass against production.
- [ ] A restore from backup has been performed and the elapsed time recorded.
- [ ] A rollback to the previous tag has been performed successfully.
- [ ] Every runbook exists and has been followed once.
- [ ] You can present the architecture from the diagram alone and justify every component.

---

### 25.2 Phase gate

No phase is closed until:

1. Every Definition-of-Done box is ticked, verifiably.
2. The phase's tests pass in CI.
3. A review pass has been run against the phase's code.
4. Any decision taken during the phase is recorded as an ADR.
5. `docs/progress.md` records what was learned and what was left behind as debt.

---

## 26. Repository Structure & Engineering Conventions

### 26.1 Layout

```
promanage/
├── client/                    React application (§20.1)
├── server/
│   ├── src/
│   │   ├── config/            env loading + validation, db, redis, logger
│   │   ├── models/            Mongoose schemas
│   │   ├── repositories/      tenant-scoped data access
│   │   ├── services/          business logic
│   │   ├── controllers/       HTTP in / HTTP out
│   │   ├── routes/v1/         route definitions + OpenAPI
│   │   ├── middleware/        auth, workspace, rbac, validate, rateLimit, error
│   │   ├── jobs/              queues, workers, processors
│   │   ├── sockets/           io setup, handlers, rooms
│   │   ├── utils/             AppError, asyncHandler, response, permissions
│   │   ├── emails/            templates + sender
│   │   ├── app.js  server.js  worker.js
│   ├── tests/                 unit/ integration/ security/ performance/
│   └── scripts/               seed.js, seed-load.js, reconcile.js
├── docker/                    Dockerfiles, nginx.conf
├── docs/
│   ├── adr/                   architecture decision records
│   ├── api/                   generated OpenAPI
│   ├── runbooks/              operational procedures
│   ├── performance/           explain reports, k6 output
│   ├── security/              review records
│   └── progress.md            phase log
├── .github/workflows/
├── docker-compose.yml         docker-compose.prod.yml
├── .env.example
├── ARCHITECTURE.md            IMPLEMENTATION_PLAN.md            README.md
```

### 26.2 Naming

| Kind                  | Convention               | Example                     |
| --------------------- | ------------------------ | --------------------------- |
| Backend files         | camelCase                | `taskService.js`            |
| React components      | PascalCase               | `TaskCard.jsx`              |
| Hooks                 | `use` prefix             | `usePermissions.js`         |
| Mongoose models       | Singular PascalCase      | `Task` → collection `tasks` |
| Environment variables | SCREAMING_SNAKE          | `MONGO_URI`                 |
| Permissions           | `resource:action`        | `task:update`               |
| Error codes           | SCREAMING_SNAKE          | `LIMIT_REACHED`             |
| Socket events         | `entity:action`          | `task:moved`                |
| Job names             | `queue.job`              | `email.invitation`          |
| Branches              | `type/short-description` | `feat/task-drag-drop`       |

### 26.3 Git workflow

Trunk-based with short-lived branches. Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`, `security:`), referencing a requirement id where one applies:

```
feat(tasks): add fractional-rank ordering for board moves

Implements FR-TSK-05. A move now writes exactly one document instead of
re-indexing the column. Rebalancing is deferred to a maintenance job.
```

### 26.4 Self-review checklist (before every merge)

```
[ ] Is every tenant-scoped query filtered by workspaceId?
[ ] Is authorization enforced server-side, not only in the UI?
[ ] Is every input validated at the edge?
[ ] Does the controller contain any business logic? (it must not)
[ ] Are new queries covered by an index?
[ ] Is any cache entry left without an invalidation path?
[ ] Is slow or external work on the request path? (it must not be)
[ ] Are the error cases returning the right status and code?
[ ] Are the tests asserting the deny path, not only the allow path?
[ ] Does any log line or response leak a secret or internal detail?
```

### 26.5 Architecture Decision Records

One short file per significant decision: context, options considered, decision, consequences. Expected records include: MongoDB over PostgreSQL; shared-collection multi-tenancy; opaque refresh tokens; fractional ranks; React Query for server state; incremental usage counters; Mongo text search with its documented ceiling; Redis as a performance-not-correctness dependency.

**Why this matters:** in six months, "why is this like that?" is the most expensive question in software. An ADR answers it in a paragraph.

---

## 27. Risk Register

| #   | Risk                                                | Likelihood | Impact       | Mitigation                                                                                                                          | Trigger to act                                       |
| --- | --------------------------------------------------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| R1  | A tenant-isolation bug leaks data across workspaces | Medium     | **Critical** | Repository helpers require workspace scope; `findById` banned; generated isolation suite; a route without a test is a merge blocker | Any test in the isolation suite failing              |
| R2  | Scope creep turns a 10-phase plan into 20           | **High**   | High         | §2.4 is a contract; new ideas go to a v1.1 backlog file, not into the current phase                                                 | A phase overruns its estimate by more than 50%       |
| R3  | Cache invalidation bugs serve stale data            | Medium     | High         | Delete-not-update; documented trigger per key; a test per key; short TTLs as a backstop                                             | Any user-visible staleness                           |
| R4  | Performance collapses on the load dataset           | Medium     | Medium       | Load-seed from Phase 4; `explain()` gate; k6 in Phase 9                                                                             | Any hot-path `COLLSCAN`                              |
| R5  | Motivation dips in the long Phase 6                 | **High**   | Medium       | Split into 6a–6d with visible demos; each sub-milestone ends with something clickable                                               | Two weeks without a merged sub-milestone             |
| R6  | Real-time complexity (multi-replica, reconnect)     | Medium     | Medium       | Redis adapter configured from the outset; reconnect refetch; sockets carry no authorization                                         | Duplicated or missing events in the two-browser test |
| R7  | Jobs retry and duplicate side effects               | Medium     | High         | Idempotency keys on every job; ids not objects in payloads; precondition checks                                                     | Any duplicate email in testing                       |
| R8  | Deployment left to the last phase becomes a wall    | Medium     | High         | Docker from Phase 1; CI from Phase 3 onward; deploy staging early rather than at the end                                            | Phase 10 exceeding its estimate                      |
| R9  | Tests skipped under time pressure                   | Medium     | High         | Coverage gates in CI; tests written per phase, not batched                                                                          | Coverage dropping below threshold                    |
| R10 | AWS cost surprise                                   | Low        | Medium       | Single-instance v1; billing alarm at a set threshold; Atlas free/shared tier for staging                                            | Any unexpected bill                                  |
| R11 | Secret committed to the repository                  | Low        | **Critical** | `.env` git-ignored, `gitleaks` in CI, pre-commit scan                                                                               | Any scan hit — rotate immediately                    |
| R12 | AI used as a code generator, defeating the purpose  | Medium     | High         | The working agreement (§1.2): hints not solutions, layer-level debugging guidance                                                   | Catching yourself pasting code you cannot explain    |

---

## 28. Appendices

### Appendix A — Environment variables

| Variable                                                                  | Example                                          | Notes                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| `NODE_ENV`                                                                | `development`                                    |                                       |
| `PORT`                                                                    | `5000`                                           |                                       |
| `API_BASE_URL`                                                            | `http://localhost:5000`                          |                                       |
| `CLIENT_URL`                                                              | `http://localhost:5173`                          | CORS origin, email links              |
| `MONGO_URI`                                                               | `mongodb://mongo:27017/promanage?replicaSet=rs0` | Replica set required for transactions |
| `REDIS_URL`                                                               | `redis://redis:6379`                             |                                       |
| `JWT_ACCESS_SECRET`                                                       | —                                                | ≥ 32 random bytes                     |
| `JWT_ACCESS_EXPIRES`                                                      | `15m`                                            |                                       |
| `REFRESH_TOKEN_EXPIRES_DAYS`                                              | `7`                                              |                                       |
| `BCRYPT_ROUNDS`                                                           | `12`                                             |                                       |
| `COOKIE_DOMAIN`                                                           | `localhost`                                      |                                       |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`                     | MailHog locally                                  |                                       |
| `EMAIL_FROM`                                                              | `ProManage <no-reply@promanage.app>`             |                                       |
| `STORAGE_DRIVER`                                                          | `s3` \| `cloudinary` \| `local`                  |                                       |
| `S3_BUCKET` / `S3_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | —                                                |                                       |
| `MAX_FILE_SIZE_MB`                                                        | `10`                                             |                                       |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`                                 | `900000` / `300`                                 |                                       |
| `LOG_LEVEL`                                                               | `debug`                                          |                                       |
| `ENABLE_SWAGGER`                                                          | `true`                                           | Must be `false` in production         |

Startup validates this set with a Zod schema and **exits on a missing or malformed value** — failing at boot beats failing at 2 a.m.

### Appendix B — Error code catalogue

| Code                               | Status | Meaning                                          |
| ---------------------------------- | ------ | ------------------------------------------------ |
| `VALIDATION_ERROR`                 | 400    | Input failed schema validation                   |
| `INVALID_CREDENTIALS`              | 401    | Wrong email or password (deliberately ambiguous) |
| `TOKEN_EXPIRED`                    | 401    | Access token expired — client should refresh     |
| `TOKEN_INVALID`                    | 401    | Malformed or tampered token                      |
| `REFRESH_TOKEN_INVALID`            | 401    | Unknown, expired, or revoked refresh token       |
| `TOKEN_REUSE_DETECTED`             | 401    | Rotated token replayed — family revoked          |
| `EMAIL_NOT_VERIFIED`               | 403    | Verification required                            |
| `ACCOUNT_SUSPENDED`                | 403    | User disabled                                    |
| `NOT_A_MEMBER`                     | 403    | No membership in the requested workspace         |
| `INSUFFICIENT_PERMISSIONS`         | 403    | Role lacks the permission                        |
| `NOT_RESOURCE_OWNER`               | 403    | Scope condition failed                           |
| `LIMIT_REACHED`                    | 403    | Plan quota exhausted                             |
| `WORKSPACE_SUSPENDED`              | 403    | Workspace is read-only                           |
| `RESOURCE_NOT_FOUND`               | 404    | Missing, or belongs to another tenant            |
| `EMAIL_IN_USE`                     | 409    | Registration conflict                            |
| `SLUG_TAKEN` / `PROJECT_KEY_TAKEN` | 409    | Uniqueness conflict                              |
| `VERSION_CONFLICT`                 | 409    | Concurrent edit                                  |
| `ALREADY_MEMBER`                   | 409    | Duplicate invitation                             |
| `FILE_TOO_LARGE`                   | 413    | Exceeds the size cap                             |
| `UNSUPPORTED_FILE_TYPE`            | 415    | Not on the allowlist                             |
| `INVALID_DATE_RANGE`               | 422    | Semantically invalid input                       |
| `RATE_LIMIT_EXCEEDED`              | 429    | Throttled                                        |
| `INTERNAL_ERROR`                   | 500    | Unhandled — logged with a requestId              |
| `SERVICE_UNAVAILABLE`              | 503    | Dependency down                                  |

### Appendix C — Glossary

| Term                | Meaning here                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Tenant**          | A workspace. The isolation boundary for all data.                                    |
| **Membership**      | The user↔workspace join that carries the role.                                       |
| **Permission**      | A `resource:action` string checked against the role matrix.                          |
| **Scope condition** | A resource-level rule applied after the coarse role check (e.g. "own comment only"). |
| **Rank**            | The lexicographic string ordering a task within a Kanban column.                     |
| **Counter**         | A denormalised usage number on the workspace, maintained by atomic `$inc`.           |
| **Fan-out**         | Turning one event into many per-recipient jobs.                                      |
| **Idempotency**     | Running the same job twice produces the same result as running it once.              |
| **CUJ**             | Critical User Journey — a flow that must never break.                                |
| **ADR**             | Architecture Decision Record.                                                        |

### Appendix D — Learning outcomes by phase

| Phase | What you should be able to explain afterwards                                        |
| ----- | ------------------------------------------------------------------------------------ |
| 1     | Why the environment is containerised, and what a replica set buys you locally        |
| 2     | How to structure a large React app, and which state belongs where                    |
| 3     | Why controllers must stay thin, and how errors propagate through async middleware    |
| 4     | Why each collection is shaped as it is, and why each index exists                    |
| 5     | The difference between authentication and authorization; why refresh rotation exists |
| 6     | How to enforce permissions and tenancy together without duplicating logic            |
| 7     | When caching helps, and why invalidation is the hard part                            |
| 8     | Why slow work belongs off the request path, and what idempotency protects you from   |
| 9     | Why "it works" and "it is correct" are different claims                              |
| 10    | What it takes to operate software, not just write it                                 |

---

## Document Control

| Version | Date       | Change                               |
| ------- | ---------- | ------------------------------------ |
| 1.0     | 2026-09-06 | Initial plan derived from `idea.txt` |

**Living document.** Update it when a decision changes, and record the reasoning in an ADR. A plan that stops matching the code is worse than no plan, because it lies with authority.
