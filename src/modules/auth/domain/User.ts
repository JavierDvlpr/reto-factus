/**
 * Auth Domain — User Entity (OOP)
 * Encapsulates user data and role-based access logic.
 * Follows Single-Responsibility: User knows only about itself and its role.
 */

export type UserRole = "admin" | "customer";

export interface UserProps {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt?: string;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    if (!props.id) throw new Error("User must have an id");
    if (!props.email) throw new Error("User must have an email");
    this.props = { ...props };
  }

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get fullName(): string { return this.props.fullName; }
  get role(): UserRole { return this.props.role; }
  get avatarUrl(): string | null | undefined { return this.props.avatarUrl; }

  get initials(): string {
    return this.props.fullName
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  isAdmin(): boolean {
    return this.props.role === "admin";
  }

  isCustomer(): boolean {
    return this.props.role === "customer";
  }

  canManageProducts(): boolean {
    return this.isAdmin();
  }

  canViewAllInvoices(): boolean {
    return this.isAdmin();
  }

  canAccessAdminPanel(): boolean {
    return this.isAdmin();
  }

  toJSON(): UserProps {
    return { ...this.props };
  }

  static fromDB(row: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string | null;
    created_at?: string;
  }): User {
    return new User({
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
    });
  }
}
