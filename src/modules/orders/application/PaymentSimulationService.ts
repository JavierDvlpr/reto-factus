/**
 * Payment Simulation Service — Simulates payment gateway processing.
 * Supports: Credit Card, PSE, Nequi/Daviplata.
 * Follows Single-Responsibility: only simulates payment, doesn't know about invoices.
 */

export type PaymentMethodCode = "10" | "48" | "42" | "49";

export interface CardPaymentData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

export interface PSEPaymentData {
  bankCode: string;
  documentType: string;
  document: string;
}

export interface NequiPaymentData {
  phone: string;
}

export type PaymentData = CardPaymentData | PSEPaymentData | NequiPaymentData;

export interface PaymentResult {
  approved: boolean;
  transactionId: string;
  message: string;
  timestamp: string;
}

export class PaymentSimulationService {
  private readonly processingTimeMs: number;

  constructor(processingTimeMs = 2500) {
    this.processingTimeMs = processingTimeMs;
  }

  async processPayment(
    methodCode: PaymentMethodCode,
    data: PaymentData,
    amount: number
  ): Promise<PaymentResult> {
    await this._simulateProcessing();

    // 95% approval rate simulation
    const approved = Math.random() > 0.05;
    const transactionId = this._generateTransactionId(methodCode);

    if (approved) {
      return {
        approved: true,
        transactionId,
        message: this._getSuccessMessage(methodCode),
        timestamp: new Date().toISOString(),
      };
    }

    return {
      approved: false,
      transactionId,
      message: this._getDeclineMessage(methodCode),
      timestamp: new Date().toISOString(),
    };
  }

  private async _simulateProcessing(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.processingTimeMs));
  }

  private _generateTransactionId(method: string): string {
    const prefix = { "10": "CASH", "48": "CARD", "42": "PSE", "49": "NEQUI" }[method] ?? "TXN";
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  private _getSuccessMessage(method: PaymentMethodCode): string {
    const messages: Record<PaymentMethodCode, string> = {
      "10": "Pago en efectivo registrado exitosamente",
      "48": "Tarjeta procesada. Pago aprobado por la entidad bancaria.",
      "42": "Transferencia PSE completada. Fondos debitados de tu cuenta.",
      "49": "Pago Nequi/Daviplata aprobado. Notificación enviada a tu celular.",
    };
    return messages[method];
  }

  private _getDeclineMessage(method: PaymentMethodCode): string {
    const messages: Record<PaymentMethodCode, string> = {
      "10": "Pago no registrado",
      "48": "Tarjeta declinada. Verifica tus datos o fondos disponibles.",
      "42": "Transacción PSE rechazada. Intenta nuevamente.",
      "49": "Saldo insuficiente en Nequi/Daviplata.",
    };
    return messages[method];
  }

  /** Validates credit card number format (Luhn-lite for demo) */
  validateCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, "");
    return /^\d{13,19}$/.test(cleaned);
  }

  validateExpiry(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const [, mm, yy] = match;
    const now = new Date();
    const exp = new Date(2000 + Number(yy), Number(mm) - 1);
    return exp >= new Date(now.getFullYear(), now.getMonth());
  }

  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }
}

export const paymentSimulationService = new PaymentSimulationService();
