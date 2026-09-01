/**
 * Auth Application Service — Orchestrates authentication use cases.
 * Follows Single-Responsibility: only orchestrates, doesn't know storage details.
 */

import { SupabaseAuthRepository } from "../infrastructure/SupabaseAuthRepository";
import type { User, UserRole } from "../domain/User";
import type { Result } from "@/core/types";
import { DEMO_ACCOUNTS } from "@/core/config/constants";

export class AuthService {
  private readonly repo: SupabaseAuthRepository;

  constructor() {
    this.repo = new SupabaseAuthRepository();
  }

  async signIn(email: string, password: string): Promise<Result<User>> {
    return this.repo.signIn(email, password);
  }

  async signUp(email: string, password: string, fullName: string, role: UserRole = "customer"): Promise<Result<User>> {
    return this.repo.signUp(email, password, fullName, role);
  }

  async signOut(): Promise<Result<void>> {
    return this.repo.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.repo.getCurrentUser();
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return this.repo.onAuthStateChange(callback);
  }

  /** Quick login with pre-configured demo accounts (1-click in UI) */
  async loginAsAdmin(): Promise<Result<User>> {
    return this.repo.signIn(DEMO_ACCOUNTS.admin.email, DEMO_ACCOUNTS.admin.password);
  }

  async loginAsCustomer(): Promise<Result<User>> {
    return this.repo.signIn(DEMO_ACCOUNTS.customer.email, DEMO_ACCOUNTS.customer.password);
  }

  getDemoAccounts() {
    return {
      admin: { email: DEMO_ACCOUNTS.admin.email, role: "admin" as UserRole },
      customer: { email: DEMO_ACCOUNTS.customer.email, role: "customer" as UserRole },
    };
  }
}

// Singleton instance for the client side
export const authService = new AuthService();
