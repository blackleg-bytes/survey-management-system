export enum UserRole {
  ADMIN = "ADMIN",
  OFFICER = "OFFICER",
}

export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  role!: UserRole;
  createdAt!: Date;

  constructor(props: Partial<User>) {
    Object.assign(this, props);
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
