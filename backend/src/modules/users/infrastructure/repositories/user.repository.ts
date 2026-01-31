import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../application/interfaces/user.repository.interface";
import { User } from "../../domain/user.model";
import { UserEntity } from "../../../../infrastructure/database/entities/user.entity";
import { TransactionManagerService } from "@shared/services";

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly txManager: TransactionManagerService) {}

  private get repo() {
    return this.txManager.getManager().getRepository(UserEntity);
  }

  async save(user: User): Promise<User> {
    const entity = new UserEntity();
    Object.assign(entity, user);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ id: id as any });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find();
    return entities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async exist(id: string): Promise<boolean> {
    const count = await this.repo.countBy({ id: id as any });
    return count > 0;
  }

  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role as any,
      createdAt: entity.createdAt,
    });
  }
}
