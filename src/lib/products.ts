// Datos de productos tech para el e-commerce
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
}

export const PRODUCTS: Product[] = [
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
      Pantalla: '16.2" Liquid Retina XDR',
      Batería: "Hasta 22 horas",
      SO: "macOS Sequoia",
    },
    image: "/products/macbook.jpg",
    stock: 8,
    rating: 4.9,
    reviews: 312,
    badge: "Nuevo",
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
      Pantalla: '16" OLED 240Hz',
      SO: "Windows 11",
    },
    image: "/products/rog.jpg",
    stock: 5,
    rating: 4.8,
    reviews: 198,
    badge: "Hot",
  },
  {
    id: "3",
    name: "Samsung Odyssey Neo G9",
    brand: "Samsung",
    price: 6200000,
    category: "Monitores",
    description:
      "Monitor ultrawide curvo 49\" con resolución Dual QHD y tecnología Mini LED para el máximo nivel de inmersión.",
    specs: {
      Tamaño: '49" Curvo 1000R',
      Resolución: "5120x1440 DQHD",
      Panel: "Mini LED VA",
      "Refresh Rate": "240Hz",
      HDR: "HDR2000",
      Conectividad: "HDMI 2.1, DP 1.4",
    },
    image: "/products/monitor.jpg",
    stock: 12,
    rating: 4.7,
    reviews: 445,
    badge: "Top ventas",
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 1650000,
    originalPrice: 1900000,
    category: "Audio",
    description:
      "Los auriculares con cancelación de ruido más avanzados de Sony. Hasta 30 horas de batería y sonido Hi-Res.",
    specs: {
      Tipo: "Over-ear Bluetooth",
      ANC: "30 dBSPL reducción de ruido",
      Batería: "30 horas",
      Carga: "USB-C, 3 min = 3h",
      Peso: "250g",
      Driver: "30mm",
    },
    image: "/products/headphones.jpg",
    stock: 24,
    rating: 4.8,
    reviews: 1203,
    badge: "Oferta",
  },
  {
    id: "5",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    price: 620000,
    category: "Periféricos",
    description:
      "El mouse definitivo para productividad. Scroll electromagnético de 0 a 1000 líneas por segundo con MagSpeed.",
    specs: {
      Sensor: "Darkfield 8000 DPI",
      Botones: "7 botones",
      Batería: "70 días",
      Conectividad: "Bluetooth + USB",
      Compatibilidad: "Windows / Mac / Linux",
      Peso: "141g",
    },
    image: "/products/mouse.jpg",
    stock: 35,
    rating: 4.9,
    reviews: 892,
  },
  {
    id: "6",
    name: "iPad Pro 13\" M4",
    brand: "Apple",
    price: 5800000,
    category: "Tablets",
    description:
      "El iPad más potente de la historia. Pantalla OLED tandem ultra delgada y rendimiento profesional con el chip M4.",
    specs: {
      Procesador: "Apple M4",
      Pantalla: '13" Ultra Retina XDR OLED',
      Almacenamiento: "256 GB",
      Conectividad: "Wi-Fi 6E + 5G",
      Cámara: "12 MP Ultra Wide",
      SO: "iPadOS 17",
    },
    image: "/products/ipad.jpg",
    stock: 10,
    rating: 4.9,
    reviews: 567,
    badge: "Nuevo",
  },
  {
    id: "7",
    name: "Nvidia RTX 4080 Super",
    brand: "Nvidia",
    price: 4500000,
    originalPrice: 5100000,
    category: "Componentes",
    description:
      "Tarjeta gráfica tope de gama para gaming y creación de contenido en 4K. DLSS 3.5 y Ray Tracing de tercera generación.",
    specs: {
      VRAM: "16 GB GDDR6X",
      "Núcleos CUDA": "10240",
      TDP: "320W",
      Interfaz: "PCIe 4.0 x16",
      Conectores: "3x DisplayPort 1.4a, 1x HDMI 2.1",
      Longitud: "340mm",
    },
    image: "/products/gpu.jpg",
    stock: 7,
    rating: 4.8,
    reviews: 334,
    badge: "Oferta",
  },
  {
    id: "8",
    name: "Keychron Q1 Pro",
    brand: "Keychron",
    price: 890000,
    category: "Periféricos",
    description:
      "Teclado mecánico premium wireless con aluminio CNC, switches hot-swappable y RGB per-key para máximo rendimiento.",
    specs: {
      Layout: "75% (84 teclas)",
      Material: "Aluminio CNC",
      Switches: "Gateron G Pro (Red/Blue/Brown)",
      Conectividad: "Bluetooth 5.1 + USB-C",
      Batería: "4000 mAh",
      RGB: "Per-key RGB",
    },
    image: "/products/keyboard.jpg",
    stock: 18,
    rating: 4.7,
    reviews: 421,
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
