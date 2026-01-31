import { IRepository } from "../../../../shared/interfaces";
import { User } from "../../domain/user.model";

export interface IUserRepository extends IRepository<User, string> {
  findByEmail(email: string): Promise<User | null>;
}

export interface ITokenService {
  signToken(payload: any): string;
  verifyToken(token: string): any;
}
