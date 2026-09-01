// Datos de productos tech para el e-commerce (estilo Shop.co adaptado a tecnología)
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number; // COP
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
}

export const PRODUCTS: Product[] = [
  // ─── Nuevas llegadas (New Arrivals) ──────────────────────────────────────
  {
    id: "1",
    name: "MacBook Pro 16\" M4 Pro",
    brand: "Apple",
    price: 12499000,
    originalPrice: 13999000,
    category: "Laptops",
    description:
      "El MacBook Pro más potente jamás creado. Con el chip M4 Pro, revoluciona la productividad con hasta 24 núcleos de CPU y 40 de GPU.",
    specs: {
      Procesador: "Apple M4 Pro",
      RAM: "24 GB",
      Almacenamiento: "512 GB SSD",
      Pantalla: "16.2\" Liquid Retina XDR",
      Batería: "Hasta 22 horas",
      SO: "macOS Sequoia",
    },
    image: "/images/prod_macbook.jpg",
    stock: 8,
    rating: 4.9,
    reviews: 312,
    badge: "-11%",
    isNewArrival: true,
  },
  {
    id: "2",
    name: "ASUS ROG Zephyrus G16",
    brand: "ASUS",
    price: 9800000,
    originalPrice: 11200000,
    category: "Laptops",
    description:
      "La laptop gaming más delgada y poderosa. RTX 4090 portátil con pantalla OLED 240Hz para gaming sin compromisos.",
    specs: {
      Procesador: "Intel Core Ultra 9 185H",
      GPU: "NVIDIA RTX 4090 16GB",
      RAM: "32 GB DDR5",
      Almacenamiento: "2 TB NVMe",
      Pantalla: "16\" OLED 240Hz",
      SO: "Windows 11",
    },
    image: "/images/prod_rog.jpg",
    stock: 5,
    rating: 4.8,
    reviews: 198,
    badge: "-13%",
    isNewArrival: true,
  },
  {
    id: "3",
    name: "Keychron Q1 Pro Wireless",
    brand: "Keychron",
    price: 890000,
    originalPrice: 990000,
    category: "Periféricos",
    description:
      "Teclado mecánico custom inalámbrico en aluminio CNC, switches hot-swappable y RGB para la mejor experiencia de escritura.",
    specs: {
      Layout: "75% (84 teclas)",
      Material: "Aluminio CNC",
      Switches: "Gateron G Pro Red",
      Conectividad: "Bluetooth 5.1 + USB-C",
      Batería: "4000 mAh",
    },
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    rating: 4.7,
    reviews: 421,
    badge: "-10%",
    isNewArrival: true,
  },
  {
    id: "4",
    name: "iPad Pro 13\" Pantalla OLED M4",
    brand: "Apple",
    price: 5800000,
    category: "Tablets",
    description:
      "El iPad más potente de la historia. Pantalla OLED tándem ultra delgada y rendimiento profesional con chip M4.",
    specs: {
      Procesador: "Apple M4",
      Pantalla: "13\" Ultra Retina XDR",
      Almacenamiento: "256 GB",
      Conectividad: "Wi-Fi 6E",
      SO: "iPadOS 18",
    },
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    stock: 10,
    rating: 4.9,
    reviews: 567,
    isNewArrival: true,
  },

  // ─── Más vendidos (Top Selling) ──────────────────────────────────────────
  {
    id: "5",
    name: "Samsung Odyssey Neo G9 49\"",
    brand: "Samsung",
    price: 6200000,
    originalPrice: 7500000,
    category: "Monitores",
    description:
      "Monitor ultrawide curvo 49\" con resolución Dual QHD y tecnología Mini LED para el máximo nivel de inmersión.",
    specs: {
      Tamaño: "49\" Curvo 1000R",
      Resolución: "5120x1440 DQHD",
      Panel: "Mini LED Quantum",
      Tasa: "240Hz / 1ms",
      HDR: "HDR2000",
    },
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    rating: 4.8,
    reviews: 445,
    badge: "-17%",
    isTopSelling: true,
  },
  {
    id: "6",
    name: "Sony WH-1000XM5 Noise Cancelling",
    brand: "Sony",
    price: 1650000,
    category: "Audio",
    description:
      "Los auriculares inalámbricos líderes en cancelación de ruido activa con procesador V1 y 30 horas de autonomía.",
    specs: {
      Tipo: "Over-ear Bluetooth 5.2",
      ANC: "Cancelación activa adaptativa",
      Batería: "30 horas",
      Carga: "USB-C Carga rápida",
      Peso: "250g",
    },
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 24,
    rating: 4.9,
    reviews: 1203,
    isTopSelling: true,
  },
  {
    id: "7",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    price: 620000,
    originalPrice: 720000,
    category: "Periféricos",
    description:
      "El mouse ergonómico definitivo para productividad. Clicks silenciosos y scroll electromagnético MagSpeed.",
    specs: {
      Sensor: "Darkfield 8000 DPI",
      Botones: "7 botones configurables",
      Batería: "70 días de uso",
      Conexión: "Bluetooth + Logi Bolt",
    },
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    rating: 4.9,
    reviews: 892,
    badge: "-14%",
    isTopSelling: true,
  },
  {
    id: "8",
    name: "NVIDIA GeForce RTX 4080 Super",
    brand: "NVIDIA",
    price: 4500000,
    category: "Componentes",
    description:
      "Tarjeta gráfica para gaming y renderizado 4K con DLSS 3.5 y Ray Tracing de última generación.",
    specs: {
      VRAM: "16 GB GDDR6X",
      Núcleos: "10240 CUDA",
      Frecuencia: "2550 MHz Boost",
      Conectores: "3x DP 1.4a, 1x HDMI 2.1",
    },
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    stock: 7,
    rating: 4.8,
    reviews: 334,
    isTopSelling: true,
  },
];

export const CATEGORIES = [
  "Todos",
  "Laptops",
  "Monitores",
  "Audio",
  "Periféricos",
  "Tablets",
  "Componentes",
];

export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
