/**
 * Application Constants — Single source of truth for env-driven configuration.
 * Follows Open/Closed principle: extend via env vars, don't modify this file.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const FACTUS_API_URL =
  process.env.FACTUS_API_URL ?? "https://api-sandbox.factus.com.co";

// ─── Colombian Municipality Codes (DIAN) ───────────────────────────────────
export const MUNICIPIOS = [
  { id: "11001", name: "Bogotá D.C. (Cundinamarca)" },
  { id: "05001", name: "Medellín (Antioquia)" },
  { id: "76001", name: "Cali (Valle del Cauca)" },
  { id: "08001", name: "Barranquilla (Atlántico)" },
  { id: "13001", name: "Cartagena (Bolívar)" },
  { id: "68001", name: "Bucaramanga (Santander)" },
  { id: "17001", name: "Manizales (Caldas)" },
  { id: "73001", name: "Ibagué (Tolima)" },
  { id: "63001", name: "Armenia (Quindío)" },
  { id: "66001", name: "Pereira (Risaralda)" },
] as const;

// ─── Payment Methods ─────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { code: "10", label: "Efectivo", icon: "💵" },
  { code: "48", label: "Tarjeta de Crédito/Débito", icon: "💳" },
  { code: "42", label: "Transferencia / PSE", icon: "🏦" },
  { code: "49", label: "Nequi / Daviplata", icon: "📱" },
] as const;

// ─── Colombian Banks for PSE ─────────────────────────────────────────────────
export const BANKS_PSE = [
  { code: "1007", name: "Bancolombia" },
  { code: "1006", name: "Davivienda" },
  { code: "1009", name: "Banco de Bogotá" },
  { code: "1040", name: "Banco Agrario" },
  { code: "1023", name: "Occidente" },
  { code: "1032", name: "Banco Caja Social" },
  { code: "1013", name: "BBVA Colombia" },
  { code: "1052", name: "AV Villas" },
  { code: "1060", name: "Banco Pichincha" },
  { code: "1286", name: "Itaú" },
] as const;

// ─── IVA Rate ────────────────────────────────────────────────────────────────
export const IVA_RATE = 0.19;

// ─── Seeded Demo Accounts ─────────────────────────────────────────────────────
export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@techstore.co",
    password: "Admin123*",
    name: "Administrador TechStore",
    role: "admin" as const,
  },
  customer: {
    email: "cliente@techstore.co",
    password: "Cliente123*",
    name: "Cliente Demo",
    role: "customer" as const,
  },
} as const;

// ─── App metadata ─────────────────────────────────────────────────────────────
export const APP_NAME = "TechStore CO";
export const APP_DESCRIPTION =
  "Tecnología de última generación con facturación electrónica DIAN oficial impulsada por Factus API V2.";
