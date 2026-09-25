# ADR 0001: Record Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

ProManage is being developed as a full-stack application with a frontend application, local infrastructure, development tooling, and supporting services.

The project already contains several architectural and development-environment decisions, including:

- A monorepo-style project structure.
- A React/Vite frontend under `client/`.
- MongoDB as the local database infrastructure.
- MongoDB configured with a replica set.
- Redis as local infrastructure.
- Redis configured with AOF persistence.
- Docker Compose for local infrastructure.
- ESLint and Prettier for code quality and formatting.
- EditorConfig for consistent editor settings.
- Husky for Git hooks.
- Commitlint for commit-message validation.
- `.env.example` as the environment configuration template.

As the project grows, important architectural decisions need to remain documented so that the reasoning behind them is available to current and future developers.

## Decision

ProManage will use Architecture Decision Records (ADRs) to document significant architectural and technical decisions.

ADR files will be stored under:

```text
docs/adr/
```

Each ADR will document:

- The context or problem.
- The decision that was made.
- Important consequences and trade-offs.
- The current status of the decision.

ADRs will be numbered sequentially.

## ADR Naming Convention

ADR files will follow this naming convention:

```text
NNNN-short-description.md
```

Examples:

```text
0001-record-architecture-decisions.md
0002-use-mongodb-for-application-data.md
0003-use-redis-for-caching.md
```

## When an ADR Is Required

An ADR should be created when a decision has meaningful architectural impact or is likely to affect future development.

Examples include:

- Selecting or replacing a database.
- Introducing a major infrastructure service.
- Defining service boundaries.
- Choosing an authentication architecture.
- Choosing a communication pattern.
- Defining deployment architecture.
- Introducing a major framework or library.
- Making a decision where the reasoning may be important to understand later.

Small implementation details do not require an ADR.

## Decision Record Process

When an architectural decision is made:

1. Create a new sequential ADR.
2. Describe the context and problem.
3. Document the decision.
4. Record important consequences and trade-offs.
5. Set the appropriate status.
6. Keep the ADR in the repository as part of the project's permanent technical documentation.

If a later decision replaces an existing decision, the original ADR should remain in the repository and its status should be updated accordingly.

## ADR Statuses

The following statuses may be used:

- **Proposed** — the decision is under discussion.
- **Accepted** — the decision is currently active.
- **Deprecated** — the decision is no longer recommended.
- **Superseded** — a newer ADR has replaced this decision.

## Consequences

### Positive

- Important architecture decisions are preserved in the repository.
- Developers can understand why significant decisions were made.
- Future changes can reference previous decisions.
- Architectural knowledge does not depend only on individual developers.
- Changes to architecture can be tracked over time.

### Negative

- Creating and maintaining ADRs requires additional documentation effort.
- Developers need to keep ADR statuses accurate when architecture changes.

## Current Foundation

At the time this ADR convention was introduced, the project foundation includes:

```text
ProManage
│
├── React / Vite frontend
│
├── Docker Compose
│   ├── MongoDB
│   │   └── Replica Set
│   │
│   └── Redis
│       └── AOF persistence
│
└── Development Tooling
    ├── ESLint
    ├── Prettier
    ├── EditorConfig
    ├── Husky
    └── Commitlint
```

Future architecture decisions that require independent documentation should be recorded as subsequent ADRs.
