/**
 * Interfaces Module
 *
 * This module contains TypeScript interfaces and types used across the application.
 *
 * Common interfaces to add:
 * - Request interfaces (authenticated user, etc.)
 * - Response interfaces
 * - Entity interfaces
 * - Service interfaces
 */

/**
 * Authenticated User attached to request
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  roles?: string[];
}

/**
 * Extended Express Request with user
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Error Response structure
 */
export interface ErrorResponse {
  success: false;
  message: string;
  path: string;
  timestamp: string;
  code?: string;
  details?: unknown;
}
