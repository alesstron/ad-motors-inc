/**
 * ============================================================================
 *  Footer — PIE DE PÁGINA
 * ============================================================================
 *  Qué hace: muestra el nombre del negocio, las ciudades donde opera y el
 *  aviso de derechos reservados. No tiene estado ni lógica: es solo diseño.
 *
 *  Cómo modificarlo:
 *   - Nombre del negocio → src/data/site.ts (BRAND_NAME).
 *   - Año o textos      → edita las etiquetas <p> de abajo.
 * ============================================================================
 */

import { CarFront } from 'lucide-react';
import { BRAND_NAME, SEDES } from '@/data/site';

export function Footer() {
  return (
    // `pb-24` en celular deja espacio extra para que el botón flotante de WhatsApp no tape el texto.
    <footer className="border-t border-white/10 px-4 py-10 pb-24 sm:pb-10">
      {/* Tres bloques: en celular apilados y centrados; desde `sm`, en una sola fila. */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-zinc-500 sm:flex-row sm:text-left">
        {/* Logo + nombre. */}
        <p className="flex items-center gap-2 font-medium text-zinc-300">
          <CarFront className="size-4" />
          {BRAND_NAME}
        </p>
        {/* Ciudades: se generan solas desde la lista de sedes. */}
        <p>{SEDES.map((s) => s.city).join(' · ')}</p>
        {/* Derechos reservados. */}
        <p>© 2026 {BRAND_NAME} Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
