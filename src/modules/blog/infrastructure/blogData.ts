import { BlogPost, BlogPostProps } from "../domain/BlogPost";

export const BLOG_POSTS_DATA: BlogPostProps[] = [
  {
    id: "post-1",
    slug: "macbook-pro-m4-vs-asus-rog-zephyrus-g16",
    title: "MacBook Pro M4 Pro vs ASUS ROG Zephyrus G16: ¿Cuál elegir en 2026?",
    excerpt:
      "Analizamos a fondo los dos titanes del rendimiento móvil: arquitectura ARM contra potencia bruta NVIDIA RTX 4090 con pantalla OLED.",
    category: "Hardware & Gaming",
    coverImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-28T14:30:00Z",
    readTimeMinutes: 7,
    featured: true,
    author: {
      name: "Andrés Restrepo",
      role: "Especialista en Hardware & Benchmarks",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Laptops", "Apple", "ASUS", "Gaming", "Productividad", "M4 Pro", "RTX 4090"],
    relatedProductIds: ["1", "2"],
    sections: [
      {
        title: "El dilema de la potencia portátil",
        content:
          "En 2026 la línea divisoria entre laptops de productividad extrema y máquinas gaming se ha vuelto más estrecha que nunca. Por un lado, Apple redefine la eficiencia energética y la autonomía con el chip M4 Pro de hasta 24 núcleos. Por el otro, ASUS desafía las leyes de la física con el chasis de aluminio ultrafino del Zephyrus G16 impulsado por una imponente NVIDIA GeForce RTX 4090.",
      },
      {
        title: "Rendimiento térmico y autonomía real",
        content:
          "Nuestras pruebas en laboratorio mostraron contrastes fascinantes. El MacBook Pro 16\" mantuvo un consumo promedio de solo 35W durante sesiones intensivas de renderizado 8K en DaVinci Resolve, logrando una asombrosa marca de 18 horas de uso continuo desconectado. En cambio, el Zephyrus G16 brilla cuando se conecta a la corriente alterna, triplicando los FPS en títulos AAA con Ray Tracing completo y DLSS 3.5.",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&auto=format&fit=crop&q=80",
        caption: "Comparativa de chasis y flujo de aire entre ambos buques insignia.",
      },
      {
        title: "Pantalla: Liquid Retina XDR vs OLED 240Hz",
        content:
          "Si trabajas en diseño gráfico o edición de color profesional, el panel Liquid Retina XDR de Apple con 1,600 nits pico sigue siendo el estándar de oro en fidelidad cromática. Sin embargo, para creadores de contenido que además disfrutan de videojuegos competitivos, la pantalla OLED de 240Hz y 0.2ms del ROG Zephyrus ofrece una respuesta visual sin ghosting que enamora a primera vista.",
      },
      {
        title: "Veredicto final",
        content:
          "Elige el MacBook Pro 16\" M4 Pro si priorizas duración de batería de todo el día, trabajo silencioso sin ventiladores audibles y flujo de trabajo macOS. Escoge el ASUS ROG Zephyrus G16 si necesitas la máxima aceleración en CUDA/IA, gaming competitivo sin compromisos y la versatilidad de Windows 11.",
      },
    ],
  },
  {
    id: "post-2",
    slug: "guia-armado-setup-ergonomico-2026",
    title: "Guía definitiva para armar tu Setup Ergonómico de alto rendimiento",
    excerpt:
      "Descubre cómo optimizar tu postura, seleccionar el teclado mecánico ideal y elegir periféricos que cuiden tu salud durante jornadas de trabajo intenso.",
    category: "Productividad & Setup",
    coverImage:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-22T09:15:00Z",
    readTimeMinutes: 5,
    featured: false,
    author: {
      name: "Camila Valencia",
      role: "Diseñadora UX & Ergonomía de Espacios",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Ergonomía", "Keychron", "Logitech", "Setup", "Salud"],
    relatedProductIds: ["3", "7"],
    sections: [
      {
        title: "La importancia de la postura y el punto focal",
        content:
          "Pasar más de 8 horas diarias frente al monitor exige una distribución ergonómica pensada milimétricamente. La parte superior de tu pantalla debe coincidir con la altura de tus ojos para evitar tensión cervical constante.",
      },
      {
        title: "Teclados mecánicos hot-swappable: confort y precisión",
        content:
          "Un teclado como el Keychron Q1 Pro con estructura Gasket Mount absorbe la vibración de cada pulsación, reduciendo la fatiga en las articulaciones de los dedos. Además, su conectividad inalámbrica y cuerpo de aluminio ofrecen estabilidad total sobre el escritorio.",
      },
      {
        title: "El mouse ergonómico: adiós al túnel carpiano",
        content:
          "El Logitech MX Master 3S sitúa la mano en un ángulo natural de 57 grados, lo que alivia la presión en la muñeca. Su rueda electromagnética MagSpeed permite desplazarse por miles de líneas de código o celdas de Excel con un solo impulso silencioso.",
      },
    ],
  },
  {
    id: "post-3",
    slug: "monitores-ultrawide-curvos-productividad-inmersion",
    title: "¿Vale la pena un monitor UltraWide curvo de 49 pulgadas? Análisis a fondo",
    excerpt:
      "Ponemos a prueba el Samsung Odyssey Neo G9: equivalente a dos monitores 2K sin marcos molestos en el centro.",
    category: "Hardware & Gaming",
    coverImage:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-15T16:00:00Z",
    readTimeMinutes: 6,
    featured: false,
    author: {
      name: "Andrés Restrepo",
      role: "Especialista en Hardware & Benchmarks",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Monitores", "Samsung", "Ultrawide", "Inmersión", "Productividad"],
    relatedProductIds: ["5"],
    sections: [
      {
        title: "El fin de las configuraciones multimonitor",
        content:
          "Durante años, los profesionales del trading, edición de video y desarrollo de software dependieron de dos o tres monitores independientes. El monitor ultrawide curvo de 49 pulgadas con relación de aspecto 32:9 elimina la división central, ofreciendo un lienzo continuo sin biseles.",
      },
      {
        title: "Tecnología Mini LED y 240Hz",
        content:
          "Con 2,048 zonas de atenuación local (Full Array Local Dimming) y certificación HDR2000, los negros son profundos como la tinta y el brillo pico alcanza niveles deslumbrantes. En videojuegos de simulación de carreras y vuelo, la curvatura 1000R coincide con el campo visual humano natural.",
      },
    ],
  },
  {
    id: "post-4",
    slug: "facturacion-electronica-dian-tiendas-tecnologia-colombia",
    title: "Facturación electrónica DIAN obligatoria en Colombia: Guía práctica para e-commerce",
    excerpt:
      "Explicamos cómo funciona la validación previa ante la DIAN, el CUFE, los códigos QR y cómo TechStore CO emite facturas oficiales en tiempo real.",
    category: "Facturación & Negocios",
    coverImage:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-10T11:20:00Z",
    readTimeMinutes: 5,
    featured: false,
    author: {
      name: "Dr. Felipe Morales",
      role: "Consultor Tributario y Legal Tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["DIAN", "Factus", "Facturación Electrónica", "Colombia", "Tributario"],
    relatedProductIds: [],
    sections: [
      {
        title: "El marco normativo de la DIAN para compras online",
        content:
          "En Colombia, todo establecimiento de comercio electrónico que realice transacciones comerciales debe expedir la factura electrónica de venta con validación previa de la DIAN. Cada documento generado incluye un Código Único de Factura Electrónica (CUFE) generado mediante algoritmos criptográficos SHA-384.",
      },
      {
        title: "Beneficios para el comprador",
        content:
          "Para personas jurídicas y profesionales independientes, las facturas electrónicas emitidas con NIT y datos válidos son 100% deducibles de costos y gastos en el impuesto de renta, además de permitir la deducción del IVA pagado. En TechStore CO, el proceso es totalmente transparente e instantáneo tras confirmar el pago.",
      },
    ],
  },
  {
    id: "post-5",
    slug: "mejores-laptops-desarrollo-software-ia-2026",
    title: "Las mejores laptops para desarrollo de software e Inteligencia Artificial en 2026",
    excerpt:
      "Requisitos indispensables de memoria RAM unificada, núcleos de CPU y aceleración de tensores para Docker, modelos locales y compilación veloz.",
    category: "Guías de Compra",
    coverImage:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-08-04T18:45:00Z",
    readTimeMinutes: 6,
    featured: false,
    author: {
      name: "Andrés Restrepo",
      role: "Especialista en Hardware & Benchmarks",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Guías", "Laptops", "Desarrollo", "Docker", "IA"],
    relatedProductIds: ["1", "2"],
    sections: [
      {
        title: "La nueva regla dorada: 32 GB de RAM como punto de partida",
        content:
          "Con la proliferación de contenedores Docker simultáneos, entornos de desarrollo locales y asistentes de código impulsados por LLMs locales como Llama 3 o DeepSeek, 16 GB de RAM ya no son suficientes para desarrolladores senior o ingenieros de datos. Se recomienda un mínimo de 24 a 32 GB.",
      },
      {
        title: "Arquitectura x86 vs ARM en 2026",
        content:
          "Tanto macOS con Apple Silicon como Windows con Snapdragon X Elite e Intel Core Ultra han perfeccionado la emulación y soporte nativo para Linux (WSL2), ofreciendo rendimientos sobresalientes con eficiencias térmicas inéditas.",
      },
    ],
  },
  {
    id: "post-6",
    slug: "cancelacion-ruido-activa-sony-wh1000xm5-prueba",
    title: "Revisión a fondo: ¿Siguen siendo los Sony WH-1000XM5 los reyes del ANC?",
    excerpt:
      "Probamos los audífonos inalámbricos de Sony en aviones, cafeterías y oficinas ruidosas para evaluar su aislamiento acústico y calidad musical LDAC.",
    category: "Hardware & Gaming",
    coverImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
    publishedAt: "2026-07-28T10:00:00Z",
    readTimeMinutes: 5,
    featured: false,
    author: {
      name: "Camila Valencia",
      role: "Diseñadora UX & Ergonomía de Espacios",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    tags: ["Audio", "Sony", "ANC", "Bluetooth", "Productividad"],
    relatedProductIds: ["6"],
    sections: [
      {
        title: "Aislamiento en cualquier entorno",
        content:
          "El procesador integrado V1 y el chip QN1 dedicados a la cancelación de ruido trabajan en conjunto con 8 micrófonos para atenuar frecuencias medias y altas con una efectividad asombrosa. En pruebas en cafeterías concurridas, las conversaciones de fondo desaparecen casi por completo.",
      },
      {
        title: "Calidad de sonido con codec LDAC",
        content:
          "Al reproducir música en alta resolución a través del códec LDAC de Sony (hasta 990 kbps), la respuesta en frecuencias graves es contundente pero equilibrada, ideal tanto para escuchar música mientras programas como para llamadas nítidas por Zoom gracias al algoritmo de reducción de viento.",
      },
    ],
  },
];

export const ALL_BLOG_POSTS: BlogPost[] = BLOG_POSTS_DATA.map(
  (p) => new BlogPost(p)
);
