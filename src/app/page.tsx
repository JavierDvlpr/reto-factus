"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/modules/landing/ui/HeroSection";
import BrandRibbon from "@/modules/landing/ui/BrandRibbon";
import NewArrivalsSection from "@/modules/landing/ui/NewArrivalsSection";
import TopSellingSection from "@/modules/landing/ui/TopSellingSection";
import CategoryGrid from "@/modules/landing/ui/CategoryGrid";
import CustomerReviewsSection from "@/modules/landing/ui/CustomerReviewsSection";
import Footer from "@/components/Footer";
import { productService } from "@/modules/products/application/ProductService";
import type { Product } from "@/modules/products/domain/Product";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);

  useEffect(() => {
    // Initial fetch
    const loadProducts = async () => {
      const [arrivals, top] = await Promise.all([
        productService.getNewArrivals(),
        productService.getTopSelling(),
      ]);
      setNewArrivals(arrivals);
      setTopSelling(top);
    };

    loadProducts();

    // Subscribe to realtime product updates (e.g. stock changes or new items)
    const unsubscribe = productService.subscribeToChanges(async () => {
      const [arrivals, top] = await Promise.all([
        productService.getNewArrivals(),
        productService.getTopSelling(),
      ]);
      setNewArrivals(arrivals);
      setTopSelling(top);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brand Logos Ribbon */}
      <BrandRibbon />

      {/* 3. Section: Nuevas Llegadas */}
      <NewArrivalsSection products={newArrivals} />

      {/* 4. Section: Más Vendidos */}
      <TopSellingSection products={topSelling} />

      {/* 5. Section: Explora por Estilo Tecnológico */}
      <CategoryGrid />

      {/* 6. Section: Testimonios de Clientes */}
      <CustomerReviewsSection />

      {/* 7. Floating Newsletter + Footer */}
      <Footer />
    </div>
  );
}
