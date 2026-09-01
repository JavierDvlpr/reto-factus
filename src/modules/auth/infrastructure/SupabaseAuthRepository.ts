/**
 * Supabase Auth Repository — Concrete implementation of IAuthRepository.
 * Handles Supabase Auth + profile sync.
 */

import { supabase, isSupabaseConfigured } from "@/core/database/supabase";
import { User, type UserRole } from "../domain/User";
import type { IAuthRepository } from "../domain/IAuthRepository";
import type { Result } from "@/core/types";
import { ok, fail } from "@/core/types";

export class SupabaseAuthRepository implements IAuthRepository {
  async signIn(email: string, password: string): Promise<Result<User>> {
    if (!isSupabaseConfigured()) {
      return this._localSignIn(email, password);
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return fail(error.message);
      if (!data.user) return fail("No se pudo obtener el usuario");

      const user = await this._getProfile(data.user.id, email);
      return ok(user);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error de autenticación");
    }
  }

  async signUp(email: string, password: string, fullName: string, role: UserRole): Promise<Result<User>> {
    if (!isSupabaseConfigured()) {
      return fail("Supabase no configurado. Usa las cuentas demo predefinidas.");
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (error) return fail(error.message);
      if (!data.user) return fail("No se pudo crear el usuario");

      const user = await this._getProfile(data.user.id, email);
      return ok(user);
    } catch (e) {
      return fail(e instanceof Error ? e.message : "Error al crear usuario");
    }
  }

  async signOut(): Promise<Result<void>> {
    if (!isSupabaseConfigured()) {
      LocalAuthStore.clear();
      return ok(undefined);
    }
    const { error } = await supabase.auth.signOut();
    if (error) return fail(error.message);
    return ok(undefined);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return LocalAuthStore.getUser();
    }
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      return this._getProfile(data.user.id, data.user.email ?? "");
    } catch {
      return null;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await this._getProfile(session.user.id, session.user.email ?? "");
        callback(user);
      } else {
        callback(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }

  private async _getProfile(userId: string, email: string): Promise<User> {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) return User.fromDB(data);

    // Profile not yet created by trigger — return minimal user
    return new User({ id: userId, email, fullName: email.split("@")[0], role: "customer" });
  }

  // ─── Local Fallback (no Supabase) ─────────────────────────────────────────
  private _localSignIn(email: string, password: string): Result<User> {
    const accounts = [
      { email: "admin@techstore.co", password: "Admin123*", role: "admin" as UserRole, name: "Administrador TechStore" },
      { email: "cliente@techstore.co", password: "Cliente123*", role: "customer" as UserRole, name: "Cliente Demo" },
    ];
    const found = accounts.find((a) => a.email === email && a.password === password);
    if (!found) return fail("Correo o contraseña incorrectos");

    const user = new User({ id: found.role, email: found.email, fullName: found.name, role: found.role });
    LocalAuthStore.setUser(user);
    return ok(user);
  }
}

// ─── Simple Local Auth Store (used without Supabase) ──────────────────────────
const LOCAL_AUTH_KEY = "techstore_local_auth";
export class LocalAuthStore {
  static setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user.toJSON()));
    }
  }
  static getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) return null;
    try {
      return new User(JSON.parse(raw));
    } catch {
      return null;
    }
  }
  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
  }
}
