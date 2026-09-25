# ProManage

ProManage is a full-stack project management application currently under development.

The project is organized as a monorepo and is being built with a React frontend, backend services, MongoDB, Redis, and shared development tooling.

## Current Tech Stack

- React
- Vite
- Node.js
- MongoDB
- Redis
- Docker Compose
- ESLint
- Prettier
- EditorConfig
- Husky
- Commitlint
- npm

## Project Structure

```text
promanage/
├── client/                 # Frontend application
├── docs/
│   └── adr/                # Architecture Decision Records
├── docker-compose.yml      # Local infrastructure services
├── .env.example            # Environment variable template
├── .editorconfig           # Editor configuration
├── .prettierrc*            # Prettier configuration
├── eslint.config.*         # ESLint configuration
├── package.json            # Root project configuration
├── package-lock.json
└── README.md
```

## Prerequisites

Install the following before starting development:

- Git
- Node.js
- npm
- Docker Desktop
- Docker Compose

Verify the installation:

```bash
node --version
npm --version
docker --version
docker compose version
```

## Fresh Clone Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd promanage
```

### 2. Configure environment variables

Create the local environment file from the provided template.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Review `.env` and update local values where required.

> `.env` is intended for local development and should not be committed to the repository.

### 3. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

### 4. Start local infrastructure

ProManage currently uses Docker Compose for local infrastructure.

Start the services:

```bash
docker compose up -d
```

Check their status:

```bash
docker compose ps
```

The current Docker Compose setup provides:

- MongoDB
- MongoDB replica-set configuration
- Redis
- Redis persistence using AOF

### 5. Start the frontend

From the project root:

```bash
cd client
npm run dev
```

Vite will display the local development URL in the terminal.

## Development Commands

### Format the project

The root project uses Prettier for formatting.

```bash
npm run format
```

### Lint the project

```bash
npm run lint
```

### Check Docker services

```bash
docker compose ps
```

### View Docker logs

```bash
docker compose logs -f
```

### Stop Docker services

```bash
docker compose down
```

> Do not use `docker compose down -v` unless you intentionally want to remove local Docker volumes and their stored data.

## Code Quality

The project currently has the following development tooling configured:

### ESLint

ESLint is used for JavaScript/TypeScript code-quality checks.

### Prettier

Prettier is used to maintain consistent formatting across the repository.

### EditorConfig

EditorConfig provides consistent editor and file-formatting settings across different development environments.

### Husky

Husky is configured for Git hooks.

### Commitlint

Commitlint is configured to enforce consistent commit-message conventions.

Commits should follow the project's configured Conventional Commit format, for example:

```text
feat: add project dashboard
fix: resolve login validation
docs: update project setup
```

## Docker Infrastructure

The local development environment is containerized through Docker Compose.

Current infrastructure includes:

```text
Docker Compose
│
├── MongoDB
│   └── Replica Set
│
└── Redis
    └── AOF persistence
```

The MongoDB replica-set configuration provides the foundation required for MongoDB features that depend on replica-set behavior.

Redis is configured with append-only persistence for the local development environment.

## Architecture Documentation

Architecture decisions are documented using Architecture Decision Records (ADRs).

ADRs are stored in:

```text
docs/adr/
```

Example:

```text
docs/adr/
└── 0001-record-architecture-decisions.md
```

See the ADR documentation for the project's architecture-decision recording process.

## Development Workflow

The current development workflow is:

1. Create or switch to the appropriate feature branch.
2. Make the required changes.
3. Run formatting.
4. Run linting.
5. Verify the application and infrastructure locally.
6. Review the changes.
7. Commit using the project's commit-message convention.

Example:

```bash
npm run format
npm run lint
git status
git diff
```

## Current Project Status

The initial project foundation has been established.

Completed foundation work includes:

- Repository structure
- Frontend application structure
- Root npm configuration
- ESLint configuration
- Prettier configuration
- EditorConfig configuration
- Husky configuration
- Commitlint configuration
- Environment-variable template
- Docker Compose configuration
- MongoDB replica-set infrastructure
- Redis infrastructure with AOF persistence
- Architecture Decision Record structure

Application features and additional backend functionality will be added in subsequent implementation phases.

## Troubleshooting

### Docker services are not running

Check the service status:

```bash
docker compose ps
```

If a service has stopped, inspect its logs:

```bash
docker compose logs <service-name>
```

### Docker containers need to be restarted

```bash
docker compose down
docker compose up -d
```

### Dependencies need to be reinstalled

Remove the relevant `node_modules` directory and reinstall:

```bash
npm install
```

For the frontend:

```bash
cd client
npm install
```

## License

This project is currently under internal development.
