"use client";

import { useState } from "react";
import { Star, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

export interface CustomerReview {
  name: string;
  date: string;
  text: string;
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    name: "Carlos Mendoza",
    date: "Hace 2 días",
    text: "Excelente servicio. Compré una MacBook Pro M4 Pro y la factura electrónica de la DIAN llegó a mi correo de inmediato con el CUFE verificado en el portal oficial de Factus. 100% recomendado.",
  },
  {
    name: "Valentina Restrepo",
    date: "Hace 3 días",
    text: "Compré el monitor Samsung Odyssey y unos audífonos Sony. La experiencia en la tienda fue súper fluida y el PDF de la factura se descarga al instante para legalizar en mi empresa.",
  },
  {
    name: "Andrés Gómez",
    date: "Hace 1 semana",
    text: "La laptop ASUS ROG llegó impecable. Lo que más me gustó fue la transparencia con los impuestos (IVA 19%) y la factura electrónica generada automáticamente por Factus.",
  },
  {
    name: "Mariana Torres",
    date: "Hace 2 semanas",
    text: "Excelente catálogo de periféricos. El teclado Keychron tiene una calidad inmejorable y pude consultar el código QR directamente en los servidores de la DIAN sin problemas.",
  },
];

export default function CustomerReviewsSection() {
  const [reviewIdx, setReviewIdx] = useState(0);

  const handlePrev = () => {
    setReviewIdx((prev) => (prev === 0 ? DEFAULT_REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setReviewIdx((prev) => (prev === DEFAULT_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black font-sans">
          Nuestros clientes satisfechos
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Testimonio anterior"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            aria-label="Siguiente testimonio"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEFAULT_REVIEWS.map((rev, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-[20px] p-6 sm:p-8 space-y-3 bg-white hover:shadow-md transition-shadow"
          >
            {/* 5 Stars */}
            <div className="flex items-center gap-1 text-[#FFC633]">
              {[...Array(5)].map((_, starI) => (
                <Star key={starI} className="w-4 h-4 fill-[#FFC633]" />
              ))}
            </div>

            {/* Customer Name & Verified Badge */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="font-bold text-base text-black">{rev.name}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500 text-white" />
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
            <p className="text-xs text-gray-400 font-medium">{rev.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
