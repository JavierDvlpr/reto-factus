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
  private _getDemoAccount(email: string, password?: string) {
    const accounts = [
      {
        email: "admin@techstore.co",
        password: "Admin123*",
        role: "admin" as UserRole,
        name: "Administrador TechStore",
        id: "demo-admin-id",
      },
      {
        email: "cliente@techstore.co",
        password: "Cliente123*",
        role: "customer" as UserRole,
        name: "Cliente Demo",
        id: "demo-customer-id",
      },
    ];
    return accounts.find(
      (a) =>
        a.email.toLowerCase() === email.toLowerCase().trim() &&
        (password === undefined || a.password === password)
    );
  }

  async signIn(email: string, password: string): Promise<Result<User>> {
    const cleanEmail = email.toLowerCase().trim();
    const demoFound = this._getDemoAccount(cleanEmail, password);

    if (!isSupabaseConfigured()) {
      return this._localSignIn(cleanEmail, password);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        // If it's a demo account and not yet created in Supabase Auth, attempt auto-signup or fallback
        if (demoFound) {
          try {
            const signupRes = await supabase.auth.signUp({
              email: demoFound.email,
              password: demoFound.password,
              options: {
                data: { full_name: demoFound.name, role: demoFound.role },
              },
            });
            if (signupRes.data.user) {
              const user = await this._getProfile(
                signupRes.data.user.id,
                cleanEmail
              );
              LocalAuthStore.setUser(user);
              return ok(user);
            }
          } catch {
            // fallback to local demo user
          }
          return this._localSignIn(cleanEmail, password);
        }

        const msg =
          error.message === "Invalid login credentials"
            ? "Credenciales incorrectas. Si aún no tienes una cuenta, puedes crear una en la pestaña 'Registrarse' o ingresar con las cuentas de prueba."
            : error.message;
        return fail(msg);
      }

      if (!data.user) return fail("No se pudo obtener el usuario");

      const user = await this._getProfile(data.user.id, cleanEmail);
      LocalAuthStore.setUser(user);
      return ok(user);
    } catch (e) {
      if (demoFound) {
        return this._localSignIn(cleanEmail, password);
      }
      return fail(e instanceof Error ? e.message : "Error de autenticación");
    }
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole = "customer"
  ): Promise<Result<User>> {
    const cleanEmail = email.toLowerCase().trim();

    if (!isSupabaseConfigured()) {
      const user = new User({
        id: `local-user-${Date.now()}`,
        email: cleanEmail,
        fullName,
        role,
      });
      LocalAuthStore.setUser(user);
      return ok(user);
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: fullName, role } },
      });

      if (error) {
        // If error in Supabase (e.g. email already exists or signup disabled), fallback locally
        const user = new User({
          id: `local-${Date.now()}`,
          email: cleanEmail,
          fullName,
          role,
        });
        LocalAuthStore.setUser(user);
        return ok(user);
      }

      if (!data.user) return fail("No se pudo crear el usuario");

      const user = await this._getProfile(data.user.id, cleanEmail);
      LocalAuthStore.setUser(user);
      return ok(user);
    } catch (e) {
      const user = new User({
        id: `local-${Date.now()}`,
        email: cleanEmail,
        fullName,
        role,
      });
      LocalAuthStore.setUser(user);
      return ok(user);
    }
  }

  async signOut(): Promise<Result<void>> {
    LocalAuthStore.clear();
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    return ok(undefined);
  }

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return LocalAuthStore.getUser();
    }
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        return LocalAuthStore.getUser();
      }
      return this._getProfile(data.user.id, data.user.email ?? "");
    } catch {
      return LocalAuthStore.getUser();
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    if (!isSupabaseConfigured()) {
      return () => {};
    }
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const user = await this._getProfile(
            session.user.id,
            session.user.email ?? ""
          );
          callback(user);
        } else {
          callback(LocalAuthStore.getUser());
        }
      }
    );
    return () => data.subscription.unsubscribe();
  }

  private async _getProfile(userId: string, email: string): Promise<User> {
    const isDemoAdmin = email.toLowerCase() === "admin@techstore.co";
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        const user = User.fromDB(data);
        if (isDemoAdmin && user.role !== "admin") {
          return new User({ ...user.toJSON(), role: "admin" });
        }
        return user;
      }
    } catch {
      // ignore
    }

    // Determine role based on email if admin
    const role: UserRole = isDemoAdmin ? "admin" : "customer";
    return new User({
      id: userId,
      email,
      fullName: isDemoAdmin ? "Administrador TechStore" : email.split("@")[0],
      role,
    });
  }

  // ─── Local Fallback (no Supabase or demo accounts) ──────────────────────────
  private _localSignIn(email: string, password: string): Result<User> {
    const found = this._getDemoAccount(email, password);
    if (!found) {
      return fail(
        "Correo o contraseña incorrectos. Verifica los datos o utiliza los botones de autorrelleno."
      );
    }

    const user = new User({
      id: found.id,
      email: found.email,
      fullName: found.name,
      role: found.role,
    });
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
