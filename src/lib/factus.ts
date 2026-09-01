/**
 * Cliente de la API de Factus (sandbox)
 * Documentación: https://api-sandbox.factus.com.co
 * Autenticación: OAuth2 con grant_type=password
 */

import axios, { AxiosInstance } from "axios";

const FACTUS_BASE_URL =
  process.env.FACTUS_API_URL || "https://api-sandbox.factus.com.co";

// Token cache en memoria (válido 1 hora)
let tokenCache: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
} | null = null;

// Instancia axios con base URL
const factusHttp: AxiosInstance = axios.create({
  baseURL: FACTUS_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 30000,
});

/**
 * Obtiene un access token válido.
 * Reutiliza el token cacheado si no ha expirado, o lo refresca si tiene refresh_token.
 */
export async function getFactusToken(): Promise<string> {
  const now = Date.now();

  // Token vigente
  if (tokenCache && tokenCache.expires_at > now + 60_000) {
    return tokenCache.access_token;
  }

  // Intentar refresh
  if (tokenCache?.refresh_token) {
    try {
      const res = await axios.post(
        `${FACTUS_BASE_URL}/oauth/token`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: tokenCache.refresh_token,
          client_id: process.env.FACTUS_CLIENT_ID!,
          client_secret: process.env.FACTUS_CLIENT_SECRET!,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      tokenCache = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_at: now + res.data.expires_in * 1000,
      };
      return tokenCache.access_token;
    } catch {
      // Si falla el refresh, obtenemos token nuevo
      tokenCache = null;
    }
  }

  // Token nuevo con password grant
  const res = await axios.post(
    `${FACTUS_BASE_URL}/oauth/token`,
    new URLSearchParams({
      grant_type: "password",
      client_id: process.env.FACTUS_CLIENT_ID!,
      client_secret: process.env.FACTUS_CLIENT_SECRET!,
      username: process.env.FACTUS_USERNAME!,
      password: process.env.FACTUS_PASSWORD!,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  tokenCache = {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token,
    expires_at: now + res.data.expires_in * 1000,
  };

  return tokenCache.access_token;
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface FactusInvoiceItem {
  code_reference: string;
  name: string;
  quantity: number;
  discount_rate: number;
  price: number;
  tax_rate: string; // "19.00" = IVA 19%
  unit_measure_id: number; // 70 = Unidad
  standard_code_id: number; // 27 = Producto estándar
  is_excluded: number; // 0 = no excluido
  tribute_id: number; // 1 = IVA
  withholding_taxes: [];
}

export interface FactusCustomer {
  identification: string;
  dv?: string;
  company?: string;
  trade_name?: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_id: string; // "2" = Persona Natural
  tribute_id: string; // "21" = No responsable de IVA
  identification_document_id: string; // "3" = Cédula de ciudadanía
  municipality_id: string; // código del municipio DIAN
}

export interface CreateInvoicePayload {
  numbering_range_id: number;
  reference_code: string;
  observation: string;
  payment_method_code: string; // "10" = Efectivo, "49" = Transferencia
  customer: FactusCustomer;
  items: FactusInvoiceItem[];
}

export interface FactusInvoiceResponse {
  data: {
    id: number;
    status: string;
    cufe: string;
    qr: string;
    number: string;
    reference_code: string;
    created_at: string;
  };
}

// ─── Funciones de API ───────────────────────────────────────────────────────

/**
 * Crea una factura electrónica en Factus
 */
export async function createInvoice(
  payload: CreateInvoicePayload
): Promise<FactusInvoiceResponse["data"]> {
  const token = await getFactusToken();
  const res = await factusHttp.post("/v1/bills/validate", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

/**
 * Obtiene el PDF de una factura en base64
 */
export async function downloadInvoicePDF(invoiceId: number): Promise<string> {
  const token = await getFactusToken();
  const res = await factusHttp.get(`/v1/bills/download-pdf/${invoiceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Retorna el PDF en base64
  return res.data.data?.pdf_base_64_encoded ?? res.data.data;
}

/**
 * Lista facturas emitidas (paginado)
 */
export async function listInvoices(page = 1) {
  const token = await getFactusToken();
  const res = await factusHttp.get("/v1/bills", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, per_page: 20 },
  });
  return res.data;
}

/**
 * Obtiene una factura por número
 */
export async function getInvoice(number: string) {
  const token = await getFactusToken();
  const res = await factusHttp.get(`/v1/bills/show/${number}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

/**
 * Obtiene los rangos de numeración disponibles
 */
export async function getNumberingRanges() {
  const token = await getFactusToken();
  const res = await factusHttp.get("/v1/numbering-ranges", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}
