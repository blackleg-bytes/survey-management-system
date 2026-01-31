# Project Architecture & Structure Guide

This document provides an overview of the architecture used in the **Survey Management System**. It is designed to help you understand the move from a **Layer-First** approach to a **Feature-First (Vertical Slice)** approach, combined with **Clean Architecture** principles.

## 1. Feature-First vs. Layer-First

### The "Layer-First" Approach (What you used before)
In a traditional Layer-First approach, code is organized by technical function. You might have folders like:
- `src/controllers/` (All controllers for User, Survey, Auth)
- `src/services/` (All services)
- `src/repositories/` (All repositories)
- `src/entities/` (All entities)

**Pros:** rigorous separation of technical concerns.
**Cons:** To add a simple feature (e.g., "Create Survey"), you have to touch 4-5 different folders scattered across the project. As the project grows, these folders become massive, and related logic is far apart.

### The "Feature-First" Approach (This Project)
In this project, we organize code by **Business Capability (Feature)**.
- `src/modules/auth/` (Everything related to Authentication)
- `src/modules/surveys/` (Everything related to Surveys)
- `src/modules/submissions/` (Everything related to Submissions)

**Why we chose this:**
1.  **Cohesion**: Code that changes together stays together. If you need to fix a bug in Survey creation, you go to `src/modules/surveys`, and everything is there.
2.  **Scalability**: New features are just new folders. You don't keep adding to a bloated `controllers` folder.
3.  **Encapsulation**: Details of how "Surveys" work can be hidden from "Auth". Modules interact only through public interfaces.

---

## 2. Directory Structure & Clean Architecture

Inside each Feature Module (e.g., `src/modules/surveys`), we strictly follow **Clean Architecture** layers to ensure separation of concerns.

```text
src/modules/surveys/
├── domain/           <-- Enterprise Business Rules (Pure TS, no framework dependencies)
├── application/      <-- Application Business Rules (Use Cases)
├── infrastructure/   <-- Frameworks & Drivers (Database, External APIs)
└── presentation/     <-- Interface Adapters (Controllers, API Definitions)
```

### 1. Domain Layer (`/domain`)
**What goes here:** The core data models and logic.
**Files:** `*.model.ts`
**Description:** classes representing the business objects (e.g., `Survey`, `SurveyField`). They have NO dependencies on NestJS or TypeORM. They define *what* a Survey is.

### 2. Application Layer (`/application`)
**What goes here:** The specific actions available to users (The "What" of the app).
**Files:**
- `use-cases/*.use-case.ts`: Single-responsibility classes (e.g., `CreateSurveyUseCase`). They orchestrate the flow: Validation -> Domain Logic -> Persistence.
- `interfaces/index.ts`: Interfaces defining dependencies (e.g., `ISurveyRepository`). This allows us to rely on abstractions, not concrete implementations (Dependency Inversion).

### 3. Infrastructure Layer (`/infrastructure`)
**What goes here:** The implementation details (The "How").
**Files:**
- `repositories/*.repository.ts`: Implementation of interfaces (e.g., `TypeOrmSurveyRepository`). This is where we talk to the database.
- `database/entities/*.entity.ts`: DB-specific schema definitions (TypeORM classes). Note: We map Domain Models <-> Entities here to keep the Domain pure.

### 4. Presentation Layer (`/presentation`)
**What goes here:** How the outside world interacts with the app.
**Files:**
- `controllers/*.controller.ts`: NestJS Controllers. They handle HTTP requests, Parse DTOs, call Use Cases, and return responses.
- `guards.ts`, `dtos.ts`: Request validation and protection.

---

## 3. Module Overview

### **Auth Module** (`src/modules/auth`)
Handles user identity and access.
- **Key Files**:
    - `LoginUseCase`: Verifies credentials and issues JWTs.
    - `JwtTokenService`: Wrapping JWT generation.
    - `Guards`: `JwtAuthGuard` and `RolesGuard` protect other modules.

### **Surveys Module** (`src/modules/surveys`)
Handles the definition and management of surveys.
- **Key Files**:
    - `CreateSurveyUseCase`: Handles complex logic of creating a survey with dynamic fields (Text, Radio, Checkbox).
    - `TypeOrmSurveyRepository`: Saves the nested structure (Survey -> Fields -> Options) transactionally.
    - `Survey` (Domain): Defines the structure of a generic generic survey.

### **Submissions Module** (`src/modules/submissions`)
Handles the responses to surveys.
- **Key Files**:
    - `SubmitSurveyUseCase`: Contains the **Validation Logic**. It checks if required fields are present and if selected options match the survey definition.
    - `TypeOrmSubmissionRepository`: Stores answers, using JSON columns for complex answers (like checkbox sets).

---

## 4. Shared Layer (`src/shared`)
Contains code common to all modules to avoid duplication.
- `interfaces/`: Base `IRepository`, `IUseCase`.
- `errors/`: Standard exceptions (`NotFoundError`, `ValidationError`).

## Summary
By using this architecture, we ensure that:
1.  **Business Logic is testable** (Use Cases don't depend on the DB directly).
2.  **Code is easy to navigate** (All survey code is in one place).
3.  **Framework independence** (The core domain doesn't know about NestJS or TypeORM).
