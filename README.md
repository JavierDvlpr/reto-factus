# TechStore CO — Reto Factus 🚀

E-commerce de tecnología con facturación electrónica DIAN integrada mediante la API de Factus en modo sandbox.

## Stack

| Capa | Tech |
|------|------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Estado | Zustand (carrito persistente) |
| Formularios | React Hook Form + Zod |
| HTTP | Axios |
| Facturación | Factus API (OAuth2) |

## Características

- 🛒 **Catálogo** de productos tech con filtro por categoría
- 🛍️ **Carrito** persistente con drawer lateral
- 💳 **Checkout** con validación de formulario
- 🧾 **Factura electrónica DIAN** vía Factus sandbox
- 📄 **Descarga de PDF** de la factura
- 📋 **Historial de facturas** con estado DIAN
- 🎨 Diseño oscuro premium con glassmorphism

## Configuración

1. Copia `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Completa las credenciales de Factus en `.env.local`:
   ```env
   FACTUS_API_URL=https://api-sandbox.factus.com.co
   FACTUS_CLIENT_ID=tu_client_id
   FACTUS_CLIENT_SECRET=tu_client_secret
   FACTUS_USERNAME=tu_email@factus.com.co
   FACTUS_PASSWORD=tu_contraseña
   ```

3. Instala dependencias y arranca:
   ```bash
   npm install
   npm run dev
   ```

4. Visita [http://localhost:3000](http://localhost:3000)

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Home / Catálogo
│   ├── checkout/page.tsx     # Checkout + generación de factura
│   ├── facturas/page.tsx     # Historial de facturas
│   ├── productos/page.tsx    # Catálogo completo
│   └── api/factus/
│       ├── invoice/route.ts  # POST: crear factura
│       ├── invoices/route.ts # GET: listar facturas
│       └── pdf/[id]/route.ts # GET: descargar PDF
├── components/
│   ├── Navbar.tsx
│   ├── CartDrawer.tsx
│   └── ProductCard.tsx
└── lib/
    ├── factus.ts    # Cliente API Factus (OAuth2)
    ├── products.ts  # Catálogo de productos
    └── store.ts     # Zustand cart store
```

## API de Factus

La integración usa OAuth2 con `grant_type=password` y manejo automático de token refresh cada 60 minutos.

| Endpoint Factus | Uso |
|----------------|-----|
| `POST /oauth/token` | Autenticación |
| `POST /v1/bills/validate` | Crear factura electrónica |
| `GET /v1/bills` | Listar facturas |
| `GET /v1/bills/download-pdf/{id}` | Descargar PDF |
| `GET /v1/numbering-ranges` | Rangos de numeración |

## Flujo de facturación

1. Usuario agrega productos al carrito
2. En checkout completa datos del comprador
3. Al confirmar, el servidor llama a `POST /v1/bills/validate`
4. Factus valida y envía a la DIAN (sandbox)
5. Se retorna el número de factura y CUFE
6. El usuario puede descargar el PDF

---

Hecho para el **Reto Factus** 🇨🇴
