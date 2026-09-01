-- ============================================================
-- TechStore CO — Supabase Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- NOTE: Profiles for demo accounts will be created automatically
-- via the handle_new_user() trigger when you sign up through the app.
-- To promote the admin account run:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@techstore.co';

-- ─── Products ─────────────────────────────────────────────────────────────────
insert into public.products
  (name, brand, price, original_price, category, description, specs, image, stock,
   rating, reviews_count, badge, is_new_arrival, is_top_selling, is_active)
values
  (
    'MacBook Pro 16" M4 Pro', 'Apple', 12499000, 13999000, 'Laptops',
    'El MacBook Pro más potente jamás creado. Con el chip M4 Pro, revoluciona la productividad con hasta 24 núcleos de CPU y 40 de GPU.',
    '{"Procesador":"Apple M4 Pro","RAM":"24 GB","Almacenamiento":"512 GB SSD","Pantalla":"16.2\" Liquid Retina XDR","Batería":"Hasta 22 horas","SO":"macOS Sequoia"}',
    '/images/prod_macbook.jpg', 8, 4.9, 312, '-11%', true, false, true
  ),
  (
    'ASUS ROG Zephyrus G16', 'ASUS', 9800000, 11200000, 'Laptops',
    'La laptop gaming más delgada y poderosa. RTX 4090 portátil con pantalla OLED 240Hz para gaming sin compromisos.',
    '{"Procesador":"Intel Core Ultra 9 185H","GPU":"NVIDIA RTX 4090 16GB","RAM":"32 GB DDR5","Almacenamiento":"2 TB NVMe","Pantalla":"16\" OLED 240Hz","SO":"Windows 11"}',
    '/images/prod_rog.jpg', 5, 4.8, 198, '-13%', true, false, true
  ),
  (
    'Keychron Q1 Pro Wireless', 'Keychron', 890000, 990000, 'Periféricos',
    'Teclado mecánico custom inalámbrico en aluminio CNC, switches hot-swappable y RGB para la mejor experiencia de escritura.',
    '{"Layout":"75% (84 teclas)","Material":"Aluminio CNC","Switches":"Gateron G Pro Red","Conectividad":"Bluetooth 5.1 + USB-C","Batería":"4000 mAh"}',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    18, 4.7, 421, '-10%', true, false, true
  ),
  (
    'iPad Pro 13" Pantalla OLED M4', 'Apple', 5800000, null, 'Tablets',
    'El iPad más potente de la historia. Pantalla OLED tándem ultra delgada y rendimiento profesional con chip M4.',
    '{"Procesador":"Apple M4","Pantalla":"13\" Ultra Retina XDR","Almacenamiento":"256 GB","Conectividad":"Wi-Fi 6E","SO":"iPadOS 18"}',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    10, 4.9, 567, null, true, false, true
  ),
  (
    'Samsung Odyssey Neo G9 49"', 'Samsung', 6200000, 7500000, 'Monitores',
    'Monitor ultrawide curvo 49" con resolución Dual QHD y tecnología Mini LED para el máximo nivel de inmersión.',
    '{"Tamaño":"49\" Curvo 1000R","Resolución":"5120x1440 DQHD","Panel":"Mini LED Quantum","Tasa":"240Hz / 1ms","HDR":"HDR2000"}',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    12, 4.8, 445, '-17%', false, true, true
  ),
  (
    'Sony WH-1000XM5 Noise Cancelling', 'Sony', 1650000, null, 'Audio',
    'Los auriculares inalámbricos líderes en cancelación de ruido activa con procesador V1 y 30 horas de autonomía.',
    '{"Tipo":"Over-ear Bluetooth 5.2","ANC":"Cancelación activa adaptativa","Batería":"30 horas","Carga":"USB-C Carga rápida","Peso":"250g"}',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    24, 4.9, 1203, null, false, true, true
  ),
  (
    'Logitech MX Master 3S', 'Logitech', 620000, 720000, 'Periféricos',
    'El mouse ergonómico definitivo para productividad. Clicks silenciosos y scroll electromagnético MagSpeed.',
    '{"Sensor":"Darkfield 8000 DPI","Botones":"7 botones configurables","Batería":"70 días de uso","Conexión":"Bluetooth + Logi Bolt"}',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    35, 4.9, 892, '-14%', false, true, true
  ),
  (
    'NVIDIA GeForce RTX 4080 Super', 'NVIDIA', 4500000, null, 'Componentes',
    'Tarjeta gráfica para gaming y renderizado 4K con DLSS 3.5 y Ray Tracing de última generación.',
    '{"VRAM":"16 GB GDDR6X","Núcleos":"10240 CUDA","Frecuencia":"2550 MHz Boost","Conectores":"3x DP 1.4a, 1x HDMI 2.1"}',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    7, 4.8, 334, null, false, true, true
  );
