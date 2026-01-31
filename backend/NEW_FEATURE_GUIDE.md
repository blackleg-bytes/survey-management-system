# How to Add a New Module / Feature

 This guide walks you through adding a new feature (e.g., a **"Comments"** module) following the project's **Clean Architecture**.

 ---

 ## ⚡️ Quick Start Checklist

 1. **Domain**: Define *what* it is (`model.ts`).
 2. **Infrastructure (DB)**: Define *how* it's stored (`entity.ts`).
 3. **Application**: Define *what* it does (`use-case.ts`) + Repository Interface (`interfaces`).
 4. **Infrastructure (Repo)**: Implement the Repository (`repository.ts`).
 5. **Presentation**: Define Input Validation (`dto.ts`) + Handle HTTP (`controller.ts`).
 6. **Module**: Wire everything together (`module.ts`).

 ---

 ## 📝 Step-by-Step Example (Creating a `Comments` Module)

 ### 1. Setup Folder Structure
 Create `src/modules/comments` with the standard layers:
 ```bash
 src/modules/comments/
 ├── domain/
 ├── application/
 │   ├── use-cases/
 │   └── interfaces/
 ├── infrastructure/
 │   └── repositories/
 ├── presentation/
 │   ├── controllers/
 │   └── dtos/
 └── comments.module.ts
 ```

 ### 2. The Domain Layer (The "What")
 **File**: `src/modules/comments/domain/comment.model.ts`
 Pure TypeScript. No database decorators.

 ```typescript
 export class Comment {
   id: string;
   content: string;
   authorId: string;
   postId: string;
   createdAt: Date;

   constructor(partial?: Partial<Comment>) {
     Object.assign(this, partial);
   }
 }
 ```

 ### 3. The Infrastructure Layer (The Database Entity)
 **File**: `src/infrastructure/database/entities/comment.entity.ts`
 TypeORM specific logic.

 ```typescript
 import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

 @Entity('comments')
 export class CommentEntity {
   @PrimaryGeneratedColumn('uuid')
   id!: string;

   @Column('text')
   content!: string;

   @Column({ name: 'author_id' })
   authorId!: string;

   @CreateDateColumn()
   createdAt!: Date;
 }
 ```

 ### 4. The Application Layer (Interface & Use Case)

 **(A) Repository Interface**
 **File**: `src/modules/comments/application/interfaces/index.ts`
 Define the contract. "I need a way to save comments."

 ```typescript
 import { IRepository } from '@shared/interfaces';
 import { Comment } from '../../domain/comment.model';

 export interface ICommentRepository extends IRepository<Comment, string> {
   findByPostId(postId: string): Promise<Comment[]>;
 }
 ```

 **(B) Use Case**
 **File**: `src/modules/comments/application/use-cases/post-comment.use-case.ts`
 The actual business logic.

 ```typescript
 import { Injectable, Inject } from '@nestjs/common';
 import { IUseCase } from '@shared/interfaces';
 import { ICommentRepository } from '../interfaces';
 import { Comment } from '../../domain/comment.model';

 @Injectable()
 export class PostCommentUseCase implements IUseCase<CreateCommentRequest, Comment> {
   constructor(
     @Inject('ICommentRepository') 
     private readonly commentRepo: ICommentRepository
   ) {}

   async execute(req: CreateCommentRequest): Promise<Comment> {
     // 1. Logic / Checks
     // 2. Save
     return this.commentRepo.save(new Comment({ ...req }));
   }
 }
 ```

 ### 5. Implement the Infrastructure (Repository)
 **File**: `src/modules/comments/infrastructure/repositories/comment.repository.ts`
 Connect the Interface (Step 4A) to the Database (Step 3).

 ```typescript
 import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { ICommentRepository } from '../../application/interfaces';
 import { Comment } from '../../domain/comment.model';
 import { CommentEntity } from '@infrastructure/database/entities/comment.entity';

 @Injectable()
 export class TypeOrmCommentRepository implements ICommentRepository {
   constructor(
     @InjectRepository(CommentEntity)
     private readonly repo: Repository<CommentEntity>
   ) {}

   async save(comment: Comment): Promise<Comment> {
     const saved = await this.repo.save(comment);
     return this.toDomain(saved);
   }
   
   // ... implement other methods
   
   private toDomain(entity: CommentEntity): Comment {
     return new Comment({ ...entity });
   }
 }
 ```

 ### 6. The Presentation Layer (API)

 **(A) DTO (Validation)**
 **File**: `src/modules/comments/presentation/dtos/create-comment.dto.ts`
 ```typescript
 import { createZodDto } from 'nestjs-zod';
 import { z } from 'zod';

 const schema = z.object({
   content: z.string().min(1),
   postId: z.string().uuid()
 });

 export class CreateCommentDto extends createZodDto(schema) {}
 ```

 **(B) Controller**
 **File**: `src/modules/comments/presentation/controllers/comments.controller.ts`

 ```typescript
 import { Controller, Post, Body } from '@nestjs/common';
 import { PostCommentUseCase } from '../../application/use-cases/post-comment.use-case';
 import { CreateCommentDto } from '../dtos/create-comment.dto';

 @Controller('comments')
 export class CommentsController {
   constructor(private readonly useCase: PostCommentUseCase) {}

   @Post()
   async create(@Body() dto: CreateCommentDto) {
     return this.useCase.execute(dto);
   }
 }
 ```

 ### 7. Wiring it up (The Module)
 **File**: `src/modules/comments/comments.module.ts`

 ```typescript
 import { Module } from '@nestjs/common';
 import { TypeOrmModule } from '@nestjs/typeorm';
 import { CommentsController } from './presentation/controllers/comments.controller';
 import { PostCommentUseCase } from './application/use-cases/post-comment.use-case';
 import { TypeOrmCommentRepository } from './infrastructure/repositories/comment.repository';
 import { CommentEntity } from '@infrastructure/database/entities/comment.entity';

 @Module({
   imports: [TypeOrmModule.forFeature([CommentEntity])],
   controllers: [CommentsController],
   providers: [
     PostCommentUseCase,
     {
       provide: 'ICommentRepository', // Matches the @Inject string
       useClass: TypeOrmCommentRepository
     }
   ]
 })
 export class CommentsModule {}
 ```

 Finally, add `CommentsModule` to `app.module.ts` imports!
