# Project Structure & Architecture

This backend follows **Clean Architecture** principles, organized by **Features** (Vertical Slices).
This ensures that business logic is decoupled from frameworks, databases, and external interfaces.

## 📂 Key Directories

### `src/main.ts` & `src/app.module.ts`
- **Entry Point**: Bootstraps the NestJS application.
- **AppModule**: The root module that imports all feature modules and global settings.

### `src/config`
- **Purpose**: centralized configuration (Environment variables, Database config).
- **Why**: Keeps usage of `process.env` validation and typing in one place.

### `src/shared`
- **Purpose**: Reusable code used across multiple modules.
- **Contents**:
    - `filters/`: Global exception handlers (standardize error responses).
    - `interceptors/`: Request/Response transformation (standardize success responses).
    - `interfaces/`: Shared types (e.g., `ApiResponse`, `IRepository`).
    - `services/`: Common utilities (Logger, Transaction Manager).

### `src/infrastructure`
- **Purpose**: Global technical implementations.
- **Contents**:
    - `database/entities/`: **TypeORM Entities**. These represent your Database Tables.
    - **Note**: These are *not* the same as Domain Models.

---

## 🧩 Modules (`src/modules`)

Each feature (Auth, Surveys, Submissions) is a self-contained module with 4 distinct layers.
This structure might seem "heavy" at first, but it makes the app maintainable and testable as it grows.

### 1. Domain (`src/modules/*/domain`)
- **What**: The "Heart" of the business. Pure TypeScript classes/types.
- **Contains**: `*.model.ts` (Business Objects).
- **Rules**: NO duplicated dependencies (no TypeORM, no NestJS controllers).
- **Why**: Allows business logic to evolve independently of the database.

### 2. Application (`src/modules/*/application`)
- **What**: Orchestrates the users flow (Use Cases).
- **Contains**:
    - `use-cases/`: Single-responsibility classes (e.g., `CreateSurveyUseCase`).
    - `interfaces/`: Definitions of Repositories (Ports).
- **Why**: Keeps controllers thin. Defines *what* can be done, not *how*.

### 3. Infrastructure (`src/modules/*/infrastructure`)
- **What**: The "Plumbing". Implements the interfaces defined in Application.
- **Contains**:
    - `repositories/`: Implementation of storage using TypeORM.
    - `services/`: Implementation of external services (e.g., JWT).
- **Why**: Swappable dependencies. You could switch TypeORM to Mongoose without touching Domain or Application.

### 4. Presentation (`src/modules/*/presentation`)
- **What**: The "Entry Point" for the outside world (HTTP).
- **Contains**:
    - `controllers/`: Handle HTTP requests.
    - `dtos/`: **Zod** schemas for input validation.
- **Why**: Separates how we receive data (HTTP/JSON) from how we process it.

---

## ❓ FAQ: Why duplicates?

### Domain Model vs. Database Entity
You will see a `User` class in `domain` and a `UserEntity` in `infrastructure`.

- **User (Domain)**: How your application "thinks" about a user. Includes logic, getters, validations.
- **UserEntity (DB)**: How your database "stores" a user. Includes `@Column`, `@Entity`, SQL metadata.
- **Benefit**: Changing a database column name doesn't break your business logic code.

### DTO vs. Interface
- **DTO**: Validates **Input** (from the unsafe internet).
- **Interface**: Types **Internal** flow (safe, trusted).
