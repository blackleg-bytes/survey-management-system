# 🚀 NestJS Enterprise Boilerplate

A production-ready, scalable NestJS boilerplate featuring a modular architecture, strict TypeScript configuration, and comprehensive tooling.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Features

- **Strict TypeScript**: Configured with `strict: true` for maximum type safety.
- **Modular Architecture**: Organized by Feature modules and a shared Common module.
- **Clean Imports**: Path aliases configured (`@common`, `@config`) for readable imports.
- **Database**: PostgreSQL with TypeORM and migration support.
- **Caching**: Redis integration for high-performance caching.
- **Validation**: Zod via `nestjs-zod` for strictly typed environment and DTO validation.
- **Global Error Handling**: Centralized exception filters for uniform error responses.
- **Interceptors**:
  - **Transform**: Wraps all successful responses in a standard `ApiResponse` format.
  - **Timeout**: Protects against long-running requests.
  - **Logging**: Detailed HTTP request logging with execution time.
  - **Transaction**: Decorator-based transaction management (`@Transactional`).
- **Graceful Shutdown**: Handles OS signals to close DB/Redis connections cleanly.
- **Docker Ready**: Multi-stage `Dockerfile` and `docker-compose.yml` included.

## 📂 Project Structure

```
src/
├── common/             # Shared resources
│   ├── constants/      # Global constants
│   ├── decorators/     # Custom decorators (@ResponseMessage, @Transactional)
│   ├── dto/            # Reusable DTOs (Pagination)
│   ├── filters/        # Global exception filters
│   ├── guards/         # Auth & permissions guards
│   ├── interceptors/   # Global interceptors
│   ├── interfaces/     # Shared interfaces
│   ├── pipes/          # Custom pipes (TrimPipe, ParseInt)
│   ├── services/       # Shared services (AppLogger, TransactionManager)
│   └── utils/          # Utilities
├── config/             # Configuration with Zod validation
├── modules/            # Feature modules (User, Chat, etc.)
└── main.ts             # Application entry point
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose (optional, for DB/Redis)

### Installation

```bash
$ npm install
```

### Environment Setup

1. Copy the example environment file:
   ```bash
   $ cp .env.example .env
   ```
2. Update `.env` with your configuration (Database URL, Redis Host, etc.).

### Running the App

**Development Mode:**
```bash
$ npm run start:dev
```

**Using Docker:**
```bash
$ npm run docker:up
```

## 🗄️ Database Migrations

This project uses TypeORM migrations.

```bash
# Generate a migration (after changing entities)
$ npm run migration:generate -- src/migrations/MigrationName

# Run pending migrations
$ npm run migration:run

# Revert last migration
$ npm run migration:revert
```

## 🏗️ Architecture Highlights

### Barrel Exports
Used extensively to simplify imports. Instead of deep relative paths:
```typescript
import { AppLogger } from '../../common/services/app-logger.service';
```
We use:
```typescript
import { AppLogger } from '@common/services';
```

### Standardized Response
All responses are automatically wrapped:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Transaction Management
Use the `@Transactional()` decorator on service or controller methods to wrap them in a database transaction automatically.

```typescript
@Transactional()
async createOrder() {
  // ... all DB operations here are atomic
}
```

## 🧪 Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e
```

## 📝 License

This project is [MIT licensed](LICENSE).
