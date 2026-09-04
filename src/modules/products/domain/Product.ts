/**
 * Product Domain Entity — OOP encapsulation.
 * Contains business logic: stock validation, discount calculation, price formatting.
 */

export interface ProductSpecs {
  [key: string]: string;
}

export interface ProductProps {
  id: string;
  name: string;
  brand: string;
  price: number;        // COP
  originalPrice?: number | null;
  category: string;
  description: string;
  specs: ProductSpecs;
  image?: string | null;
  stock: number;
  rating: number;
  reviewsCount: number;
  badge?: string | null;
  isNewArrival?: boolean;
  isTopSelling?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class Product {
  private readonly props: ProductProps;

  constructor(props: ProductProps) {
    if (props.price <= 0) throw new Error("El precio debe ser mayor a 0");
    if (props.stock < 0) throw new Error("El stock no puede ser negativo");
    this.props = { ...props };
  }

  // ─── Getters ──────────────────────────────────────────────────────────────
  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get brand(): string { return this.props.brand; }
  get price(): number { return this.props.price; }
  get originalPrice(): number | null | undefined { return this.props.originalPrice; }
  get category(): string { return this.props.category; }
  get description(): string { return this.props.description; }
  get specs(): ProductSpecs { return { ...this.props.specs }; }
  get image(): string | null | undefined { return this.props.image; }
  get stock(): number { return this.props.stock; }
  get rating(): number { return this.props.rating; }
  get reviewsCount(): number { return this.props.reviewsCount; }
  get badge(): string | null | undefined { return this.props.badge; }
  get isNewArrival(): boolean { return this.props.isNewArrival ?? false; }
  get isTopSelling(): boolean { return this.props.isTopSelling ?? false; }
  get isActive(): boolean { return this.props.isActive ?? true; }

  // ─── Business Logic ────────────────────────────────────────────────────────
  get discountPercentage(): number | null {
    if (!this.props.originalPrice || this.props.originalPrice <= this.props.price) return null;
    return Math.round((1 - this.props.price / this.props.originalPrice) * 100);
  }

  isInStock(): boolean {
    return this.props.stock > 0;
  }

  hasLowStock(threshold = 5): boolean {
    return this.props.stock > 0 && this.props.stock <= threshold;
  }

  canAddToCart(requestedQty = 1): boolean {
    return this.props.stock >= requestedQty;
  }

  get formattedPrice(): string {
    return Product.formatCOP(this.props.price);
  }

  get formattedOriginalPrice(): string | null {
    if (!this.props.originalPrice) return null;
    return Product.formatCOP(this.props.originalPrice);
  }

  get stockStatus(): "out" | "low" | "available" {
    if (this.props.stock === 0) return "out";
    if (this.props.stock <= 5) return "low";
    return "available";
  }

  static formatCOP(amount: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  toJSON(): ProductProps {
    return { ...this.props };
  }

  // ─── Factory from DB row ──────────────────────────────────────────────────
  static fromDB(row: {
    id: string;
    name: string;
    brand: string;
    price: number;
    original_price?: number | null;
    category: string;
    description: string;
    specs: Record<string, unknown>;
    image?: string | null;
    stock: number;
    rating: number;
    reviews_count: number;
    badge?: string | null;
    is_new_arrival?: boolean;
    is_top_selling?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  }): Product {
    return new Product({
      id: row.id,
      name: row.name,
      brand: row.brand,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : null,
      category: row.category,
      description: row.description,
      specs: (row.specs as ProductSpecs) ?? {},
      image: row.image,
      stock: row.stock,
      rating: Number(row.rating),
      reviewsCount: row.reviews_count,
      badge: row.badge,
      isNewArrival: row.is_new_arrival,
      isTopSelling: row.is_top_selling,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  // ─── Legacy adapter (from src/lib/products.ts format) ────────────────────
  static fromLegacy(p: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    category: string;
    description: string;
    specs: Record<string, string>;
    image: string;
    stock: number;
    rating: number;
    reviews: number;
    badge?: string;
    isNewArrival?: boolean;
    isTopSelling?: boolean;
  }): Product {
    return new Product({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      description: p.description,
      specs: p.specs,
      image: p.image,
      stock: p.stock,
      rating: p.rating,
      reviewsCount: p.reviews,
      badge: p.badge,
      isNewArrival: p.isNewArrival,
      isTopSelling: p.isTopSelling,
      isActive: true,
    });
  }

  toLegacy() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      price: this.price,
      originalPrice: this.originalPrice ?? undefined,
      category: this.category,
      description: this.description,
      specs: this.specs,
      image: this.image ?? "",
      stock: this.stock,
      rating: this.rating,
      reviews: this.reviewsCount,
      badge: this.badge ?? undefined,
      isNewArrival: this.isNewArrival,
      isTopSelling: this.isTopSelling,
    };
  }
}

// ─── Product Categories ────────────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  "Todos",
  "Laptops",
  "Monitores",
  "Audio",
  "Periféricos",
  "Tablets",
  "Componentes",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
