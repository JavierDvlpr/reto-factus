/**
 * Order Domain Entity — OOP encapsulation.
 */

import type { OrderStatus, PaymentStatus } from "@/core/types";

export interface OrderItemData {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerData {
  names: string;
  email: string;
  phone: string;
  identification: string;
  address: string;
  municipalityCode: string;
}

export interface OrderProps {
  id?: string;
  userId?: string | null;
  customer: CustomerData;
  items: OrderItemData[];
  status?: OrderStatus;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
  createdAt?: string;
}

export class Order {
  private readonly props: OrderProps;

  constructor(props: OrderProps) {
    if (props.items.length === 0) throw new Error("Una orden debe tener al menos un ítem");
    if (props.total <= 0) throw new Error("El total debe ser mayor a 0");
    this.props = { ...props };
  }

  get id(): string | undefined { return this.props.id; }
  get customer(): CustomerData { return { ...this.props.customer }; }
  get items(): OrderItemData[] { return [...this.props.items]; }
  get status(): OrderStatus { return this.props.status ?? "pending"; }
  get paymentMethod(): string { return this.props.paymentMethod; }
  get paymentStatus(): PaymentStatus { return this.props.paymentStatus ?? "pending"; }
  get subtotal(): number { return this.props.subtotal; }
  get taxAmount(): number { return this.props.taxAmount; }
  get total(): number { return this.props.total; }
  get notes(): string | null | undefined { return this.props.notes; }

  isCompleted(): boolean {
    return this.props.status === "completed";
  }

  isPaid(): boolean {
    return this.props.paymentStatus === "approved";
  }

  static calculate(items: Array<{ price: number; quantity: number }>, taxRate = 0.19) {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }

  toJSON(): OrderProps {
    return { ...this.props };
  }
}
