export interface IRepository<T, TId> {
  save(entity: T): Promise<T>;
  findById(id: TId): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: TId): Promise<void>;
  exist(id: TId): Promise<boolean>;
}

export interface IPaginatedQuery {
  limit?: number;
  offset?: number;
}

export interface IPaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string | any; // Using any for flexibility or defined UserRole
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T | null;
  timestamp: string;
  errors?: Record<string, string> | null;
}

export interface ErrorResponse {
  success: false;
  message: string;
  path: string;
  timestamp: string;
  code?: string;
  details?: unknown;
  errors?: Record<string, string> | null;
}
