/**
 * Auth Repository Interface — ISP (Interface Segregation Principle)
 * Defines the contract that any auth adapter must implement.
 */

import type { User, UserRole } from "../domain/User";
import type { Result } from "@/core/types";

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<Result<User>>;
  signUp(email: string, password: string, fullName: string, role: UserRole): Promise<Result<User>>;
  signOut(): Promise<Result<void>>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
