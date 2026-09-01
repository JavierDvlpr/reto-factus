"use client";

/**
 * Auth Store — Zustand reactive store for auth state.
 * Bridges the domain layer with the React component tree.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserProps } from "../domain/User";
import { User as UserClass } from "../domain/User";
import { authService } from "../application/AuthService";
import type { Result } from "@/core/types";

interface AuthStore {
  userProps: UserProps | null;
  loading: boolean;
  initialized: boolean;

  // Derived helpers (not persisted)
  getUser: () => UserClass | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<Result<UserClass>>;
  signOut: () => Promise<void>;
  loginAsAdmin: () => Promise<Result<UserClass>>;
  loginAsCustomer: () => Promise<Result<UserClass>>;
  setUserFromResult: (user: UserClass) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userProps: null,
      loading: false,
      initialized: false,

      getUser: () => {
        const props = get().userProps;
        if (!props) return null;
        return new UserClass(props);
      },

      initialize: async () => {
        if (get().initialized) return;
        set({ loading: true });
        const user = await authService.getCurrentUser();
        set({
          userProps: user ? user.toJSON() : null,
          loading: false,
          initialized: true,
        });
      },

      signIn: async (email, password) => {
        set({ loading: true });
        const result = await authService.signIn(email, password);
        if (result.success) {
          set({ userProps: result.data.toJSON() });
        }
        set({ loading: false });
        return result;
      },

      signOut: async () => {
        set({ loading: true });
        await authService.signOut();
        set({ userProps: null, loading: false });
      },

      loginAsAdmin: async () => {
        set({ loading: true });
        const result = await authService.loginAsAdmin();
        if (result.success) set({ userProps: result.data.toJSON() });
        set({ loading: false });
        return result;
      },

      loginAsCustomer: async () => {
        set({ loading: true });
        const result = await authService.loginAsCustomer();
        if (result.success) set({ userProps: result.data.toJSON() });
        set({ loading: false });
        return result;
      },

      setUserFromResult: (user) => {
        set({ userProps: user.toJSON() });
      },
    }),
    {
      name: "techstore-auth",
      partialize: (state) => ({ userProps: state.userProps }),
    }
  )
);
