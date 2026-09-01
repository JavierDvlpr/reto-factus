/**
 * Dynamic Product Detail Page — /productos/[id]
 * SSR-compatible with server-side data fetching and realtime client hydration.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseProductRepository } from "@/modules/products/infrastructure/SupabaseProductRepository";
import ProductDetailView from "@/modules/products/ui/ProductDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

const repo = new SupabaseProductRepository();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await repo.findById(id);
  if (!product) return { title: "Producto no encontrado | TechStore CO" };

  return {
    title: `${product.name} — ${product.brand} | TechStore CO`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | TechStore CO`,
      description: product.description.slice(0, 160),
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await repo.findById(id);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
