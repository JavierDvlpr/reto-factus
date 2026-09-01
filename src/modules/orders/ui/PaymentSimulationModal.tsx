"use client";

/**
 * Payment Simulation Modal — Interactive payment gateway UI.
 * Supports: Credit/Debit Card, PSE, Nequi/Daviplata.
 */

import { useState, useRef } from "react";
import {
  CreditCard, Building2, Smartphone, CheckCircle2, XCircle,
  Loader2, Lock, ChevronRight, X
} from "lucide-react";
import { paymentSimulationService, type PaymentMethodCode } from "../application/PaymentSimulationService";
import { BANKS_PSE, PAYMENT_METHODS } from "@/core/config/constants";
import { Product } from "@/modules/products/domain/Product";
import { toast } from "sonner";

interface PaymentSimulationModalProps {
  open: boolean;
  onClose: () => void;
  onApproved: (transactionId: string, methodCode: PaymentMethodCode) => void;
  total: number;
}

type Step = "method" | "details" | "processing" | "result";

export default function PaymentSimulationModal({
  open, onClose, onApproved, total,
}: PaymentSimulationModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState<PaymentMethodCode>("48");
  const [result, setResult] = useState<{ approved: boolean; transactionId: string; message: string } | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // PSE fields
  const [bank, setBank] = useState<string>(BANKS_PSE[0].code);
  const [pseDoc, setPseDoc] = useState("");

  // Nequi
  const [nequiPhone, setNequiPhone] = useState("");

  const isSubmitting = useRef(false);

  if (!open) return null;

  const formattedTotal = Product.formatCOP(total);

  const handlePay = async () => {
    // Anti-double-click: reject concurrent calls
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsPaying(true);
    setStep("processing");
    try {
      let paymentData;
      if (method === "48") paymentData = { cardNumber, cardHolder, expiry, cvv };
      else if (method === "42") paymentData = { bankCode: bank, documentType: "CC", document: pseDoc };
      else if (method === "49") paymentData = { phone: nequiPhone };
      else paymentData = {};

      const payResult = await paymentSimulationService.processPayment(method, paymentData as never, total);
      setResult(payResult);
      setStep("result");

      if (payResult.approved) {
        toast.success("Pago aprobado", { description: payResult.transactionId });
      } else {
        toast.error("Pago rechazado", { description: payResult.message });
      }
    } catch {
      setStep("details");
      toast.error("Error procesando el pago. Intenta nuevamente.");
    } finally {
      isSubmitting.current = false;
      setIsPaying(false);
    }
  };

  const handleSuccess = () => {
    if (result?.approved) {
      onApproved(result.transactionId, method);
      onClose();
    } else {
      setStep("method");
      setResult(null);
    }
  };

  const methodIcons: Record<string, React.ReactNode> = {
    "10": <span className="text-xl">💵</span>,
    "48": <CreditCard className="w-5 h-5" />,
    "42": <Building2 className="w-5 h-5" />,
    "49": <Smartphone className="w-5 h-5" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="font-extrabold text-lg">Pasarela de pago</h2>
                <p className="text-gray-400 text-xs">Conexión segura · TechStore CO</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 bg-white/10 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-gray-300 text-sm">Total a pagar</span>
            <span className="text-2xl font-extrabold">{formattedTotal}</span>
          </div>
        </div>

        <div className="p-6">
          {/* ─── Step: Method Selection ─────────────────────────────────── */}
          {step === "method" && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700">Selecciona tu método de pago:</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.filter(m => m.code !== "10").map((m) => (
                  <button
                    key={m.code}
                    onClick={() => setMethod(m.code as PaymentMethodCode)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      method === m.code
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span>{methodIcons[m.code]}</span>
                    <span className="font-semibold text-sm flex-1">{m.label}</span>
                    {method === m.code && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("details")}
                className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─── Step: Payment Details ──────────────────────────────────── */}
          {step === "details" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("method")}
                className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1"
              >
                ← Cambiar método
              </button>

              {/* Card Details */}
              {method === "48" && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <CreditCard className="w-7 h-7 opacity-70" />
                      <div className="text-xs text-right">
                        <div className="font-bold">VISA / MC</div>
                        <div className="opacity-70">Sim</div>
                      </div>
                    </div>
                    <div className="font-mono text-lg tracking-widest">
                      {(cardNumber || "•••• •••• •••• ••••").replace(/(\d{4})/g, "$1 ").trim()}
                    </div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <div className="opacity-60">Titular</div>
                        <div className="font-semibold uppercase">{cardHolder || "NOMBRE APELLIDO"}</div>
                      </div>
                      <div className="text-right">
                        <div className="opacity-60">Vencimiento</div>
                        <div className="font-semibold">{expiry || "MM/AA"}</div>
                      </div>
                    </div>
                  </div>

                  {[
                    { label: "Número de tarjeta", value: cardNumber, onChange: (v: string) => setCardNumber(v.replace(/\D/g, "").slice(0, 16)), placeholder: "4242 4242 4242 4242" },
                    { label: "Titular de la tarjeta", value: cardHolder, onChange: setCardHolder, placeholder: "Nombres y Apellidos" },
                  ].map(({ label, value, onChange, placeholder }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">{label}</label>
                      <input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">Vencimiento (MM/AA)</label>
                      <input
                        value={expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          setExpiry(v);
                        }}
                        placeholder="MM/AA"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">CVV / CVC</label>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        type="password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PSE Details */}
              {method === "42" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
                    <Building2 className="w-5 h-5 inline mr-2" />
                    Serás redirigido al portal de tu banco para aprobar el débito.
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Banco</label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                    >
                      {BANKS_PSE.map((b) => (
                        <option key={b.code} value={b.code}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Número de documento</label>
                    <input
                      value={pseDoc}
                      onChange={(e) => setPseDoc(e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Nequi Details */}
              {method === "49" && (
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-sm text-purple-700">
                    <Smartphone className="w-5 h-5 inline mr-2" />
                    Recibirás una notificación push en tu app Nequi o Daviplata.
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Número celular</label>
                    <input
                      value={nequiPhone}
                      onChange={(e) => setNequiPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="3001234567"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={isPaying}
                className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                aria-label={`Confirmar pago de ${formattedTotal}`}
              >
                <Lock className="w-4 h-4" />
                Pagar {formattedTotal}
              </button>
            </div>
          )}

          {/* ─── Step: Processing ───────────────────────────────────────── */}
          {step === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-black animate-spin" />
              </div>
              <div>
                <p className="font-bold text-lg text-black">Procesando pago...</p>
                <p className="text-gray-500 text-sm mt-1">Por favor no cierres esta ventana</p>
              </div>
              <div className="flex justify-center gap-2">
                {["bg-gray-200", "bg-gray-400", "bg-black"].map((c, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${c} animate-bounce`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ─── Step: Result ────────────────────────────────────────────── */}
          {step === "result" && result && (
            <div className="py-8 text-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                result.approved ? "bg-emerald-100" : "bg-red-100"
              }`}>
                {result.approved ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <div>
                <p className={`font-extrabold text-xl ${result.approved ? "text-emerald-700" : "text-red-700"}`}>
                  {result.approved ? "¡Pago aprobado!" : "Pago rechazado"}
                </p>
                <p className="text-gray-600 text-sm mt-1">{result.message}</p>
                {result.approved && (
                  <p className="text-xs text-gray-400 mt-2 font-mono">{result.transactionId}</p>
                )}
              </div>
              <button
                onClick={handleSuccess}
                className={`w-full font-semibold py-3.5 rounded-full transition-all ${
                  result.approved
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {result.approved ? "Continuar → Generar Factura DIAN" : "Intentar otro método"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
