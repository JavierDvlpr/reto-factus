/**
 * Cliente de la API de Factus V2 (sandbox / producción)
 * Documentación oficial: https://developers.factus.com.co
 * Sandbox: https://api-sandbox.factus.com.co
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
 * Obtiene un access token válido (OAuth2 password grant).
 * Reutiliza el token cacheado si no ha expirado, o lo refresca si tiene refresh_token.
 */
export async function getFactusToken(): Promise<string> {
  const now = Date.now();

  // Token vigente (con 60s de margen)
  if (tokenCache && tokenCache.expires_at > now + 60_000) {
    return tokenCache.access_token;
  }

  // Intentar refresh token
  if (tokenCache?.refresh_token) {
    try {
      const res = await axios.post(
        `${FACTUS_BASE_URL}/oauth/token`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: tokenCache.refresh_token,
          client_id: process.env.FACTUS_CLIENT_ID || "",
          client_secret: process.env.FACTUS_CLIENT_SECRET || "",
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
      client_id: process.env.FACTUS_CLIENT_ID || "",
      client_secret: process.env.FACTUS_CLIENT_SECRET || "",
      username: process.env.FACTUS_USERNAME || "",
      password: process.env.FACTUS_PASSWORD || "",
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

// ─── Tipos Factus V2 ────────────────────────────────────────────────────────

export interface FactusTax {
  code: string; // "01" = IVA
  rate: string; // "19.00"
}

export interface FactusInvoiceItemV2 {
  code_reference: string;
  name: string;
  quantity: string;
  discount_rate?: string;
  price: string;
  unit_measure_code: string; // "94" = Unidad
  standard_code: string;     // "999" = Estándar propio
  taxes: FactusTax[];
}

export interface FactusCustomerV2 {
  identification_document_code: string; // "13" = CC, "31" = NIT
  identification: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization_code: string; // "2" = Persona Natural, "1" = Jurídica
  tribute_code?: string;           // "ZZ" = No aplica
  country_code?: string;           // "CO"
  responsibilities?: string[];     // ["R-99-PN"]
  municipality_code: string;       // "11001" = Bogotá
}

export interface FactusPaymentDetailV2 {
  payment_form: string;        // "1" = Contado, "2" = Crédito
  payment_method_code: string; // "10" = Efectivo, "42" = Consignación, "48" = Tarjeta, "49" = Transferencia
  reference_code?: string;
  amount: string;
}

export interface CreateInvoicePayloadV2 {
  numbering_range_id?: number;
  reference_code: string;
  document?: string;           // "01" = Factura electrónica de venta
  operation_type?: string;     // "10" = Estándar
  observation?: string;
  payment_details: FactusPaymentDetailV2[];
  cash_rounding_amount?: string;
  customer: FactusCustomerV2;
  items: FactusInvoiceItemV2[];
}

export interface FactusCreatedInvoiceData {
  number: string;
  reference_code: string;
  is_validated: boolean;
  validated_at?: string;
  created_at?: string;
  cufe: string;
  links?: {
    qr?: string;
    public_url?: string;
  };
  totals?: {
    gross_amount: string;
    taxable_amount: string;
    tax_amount: string;
    total: string;
  };
  customer?: {
    names: string;
    email: string;
    identification: string;
  };
}

// ─── Funciones de API ───────────────────────────────────────────────────────

/**
 * Crea y valida una factura electrónica en Factus (API V2)
 * POST /v2/bills/validate
 */
export async function createInvoice(
  payload: CreateInvoicePayloadV2
): Promise<FactusCreatedInvoiceData> {
  const token = await getFactusToken();
  const res = await factusHttp.post("/v2/bills/validate", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

/**
 * Obtiene el PDF de una factura en base64
 * GET /v2/bills/:number/download-pdf
 */
export async function downloadInvoicePDF(
  invoiceNumber: string
): Promise<{ file_name: string; pdf_base_64_encoded: string }> {
  const token = await getFactusToken();
  const res = await factusHttp.get(`/v2/bills/${invoiceNumber}/download-pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

/**
 * Lista facturas emitidas (paginado)
 * GET /v2/bills
 */
export async function listInvoices(page = 1) {
  const token = await getFactusToken();
  const res = await factusHttp.get("/v2/bills", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, per_page: 20 },
  });
  return res.data;
}

/**
 * Obtiene los rangos de numeración disponibles
 * GET /v2/numbering-ranges
 */
export async function getNumberingRanges() {
  const token = await getFactusToken();
  const res = await factusHttp.get("/v2/numbering-ranges", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data?.data || res.data.data || [];
}

/**
 * Elimina una factura no validada (útil en error 409 Conflict)
 * DELETE /v2/bills/{reference_code}
 */
export async function deleteUnvalidatedInvoice(referenceCode: string) {
  const token = await getFactusToken();
  const res = await factusHttp.delete(`/v2/bills/${referenceCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
