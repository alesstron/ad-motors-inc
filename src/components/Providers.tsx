/**
 * ============================================================================
 *  Providers — ENVOLTORIO DE TODOS LOS ESTADOS COMPARTIDOS
 * ============================================================================
 *  Anida los cuatro "contextos" de la aplicación para que cualquier
 *  componente pueda usarlos:
 *    CurrencyProvider → switch USD / Bs.
 *    GarageProvider   → garaje (favoritos), comparador y ficha activa
 *    LeadProvider     → ciudad y accesorios elegidos (para WhatsApp)
 *    BookingProvider  → puente hacia el formulario de citas
 *  El orden importa poco, pero Currency va primero porque casi todo muestra precios.
 *  Se usa una sola vez, en src/app/page.tsx.
 * ============================================================================
 */

'use client';

import { BookingProvider } from '@/context/BookingContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { GarageProvider } from '@/context/GarageContext';
import { LeadProvider } from '@/context/LeadContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <GarageProvider>
        <LeadProvider>
          <BookingProvider>{children}</BookingProvider>
        </LeadProvider>
      </GarageProvider>
    </CurrencyProvider>
  );
}
