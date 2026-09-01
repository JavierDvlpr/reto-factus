/**
 * Invoice Domain Entity — OOP representation of a DIAN Electronic Invoice.
 */

export interface InvoiceProps {
  id?: string;
  orderId: string;
  factusNumber: string;
  referenceCode: string;
  cufe: string;
  isValidated: boolean;
  validatedAt?: string | null;
  qrUrl?: string | null;
  publicUrl?: string | null;
  total: number;
  customerName: string;
  customerEmail: string;
  customerIdentification: string;
  createdAt?: string;
}

export class Invoice {
  private readonly props: InvoiceProps;

  constructor(props: InvoiceProps) {
    if (!props.factusNumber) throw new Error("La factura debe tener un número asignado");
    if (!props.cufe) throw new Error("La factura electrónica debe tener un CUFE válido");
    this.props = { ...props };
  }

  get id(): string | undefined { return this.props.id; }
  get orderId(): string { return this.props.orderId; }
  get factusNumber(): string { return this.props.factusNumber; }
  get referenceCode(): string { return this.props.referenceCode; }
  get cufe(): string { return this.props.cufe; }
  get isValidated(): boolean { return this.props.isValidated; }
  get validatedAt(): string | null | undefined { return this.props.validatedAt; }
  get qrUrl(): string | null | undefined { return this.props.qrUrl; }
  get publicUrl(): string | null | undefined { return this.props.publicUrl; }
  get total(): number { return this.props.total; }
  get customerName(): string { return this.props.customerName; }
  get customerEmail(): string { return this.props.customerEmail; }
  get customerIdentification(): string { return this.props.customerIdentification; }

  get shortCufe(): string {
    if (this.props.cufe.length <= 16) return this.props.cufe;
    return `${this.props.cufe.slice(0, 8)}...${this.props.cufe.slice(-8)}`;
  }

  toJSON(): InvoiceProps {
    return { ...this.props };
  }
}
