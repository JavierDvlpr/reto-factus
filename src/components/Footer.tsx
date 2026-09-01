import Link from "next/link";
import NewsletterCard from "@/modules/landing/ui/NewsletterCard";

export default function Footer() {
  return (
    <div className="relative mt-24 pt-10 bg-[#F0F0F0]">
      {/* Floating Newsletter Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute -top-24 left-0 right-0 z-20">
        <NewsletterCard />
      </div>

      {/* Multi-column Footer */}
      <footer className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12 border-b border-gray-300/80">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 space-y-4">
              <span className="font-extrabold text-3xl tracking-tight text-black font-sans">
                TechStore CO
              </span>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Tecnología de última generación con facturación electrónica DIAN
                oficial impulsada por la API de Factus en Colombia y base de datos en tiempo real Supabase.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/JavierDvlpr/reto-factus"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column: Empresa */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="font-bold text-sm text-black tracking-wider">Empresa</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-black transition-colors">Acerca de</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Características</Link></li>
                <li><Link href="/productos" className="hover:text-black transition-colors">Catálogo</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Prensa</Link></li>
              </ul>
            </div>

            {/* Column: Ayuda */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="font-bold text-sm text-black tracking-wider">Ayuda</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-black transition-colors">Soporte técnico</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Detalles de envío</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Términos de servicio</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Privacidad</Link></li>
              </ul>
            </div>

            {/* Column: Facturación DIAN */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="font-bold text-sm text-black tracking-wider">Facturación</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/admin/facturas" className="hover:text-black transition-colors">Panel Facturas DIAN</Link></li>
                <li>
                  <a href="https://developers.factus.com.co" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    Factus API V2
                  </a>
                </li>
                <li>
                  <a href="https://catalogo-vpfe-hab.dian.gov.co" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                    Portal DIAN
                  </a>
                </li>
                <li><Link href="/checkout" className="hover:text-black transition-colors">Simular compra</Link></li>
              </ul>
            </div>

            {/* Column: Recursos */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <h4 className="font-bold text-sm text-black tracking-wider">Recursos</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/admin" className="hover:text-black transition-colors font-semibold text-black">Admin Panel</Link></li>
                <li><Link href="/admin/productos" className="hover:text-black transition-colors">Gestión Stock Realtime</Link></li>
                <li><Link href="/admin/pedidos" className="hover:text-black transition-colors">Crear Pedido Admin</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">Guías DIAN</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>TechStore CO © 2026. Todos los derechos reservados. Desarrollado para el Reto Factus con Supabase Realtime.</p>
            <div className="flex items-center gap-3 font-semibold text-gray-600">
              <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">VISA</span>
              <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">MASTERCARD</span>
              <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">PSE</span>
              <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px]">NEQUI</span>
              <span className="bg-white px-2.5 py-1 rounded border border-gray-200 text-[11px] text-emerald-700 font-bold">FACTUS DIAN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
