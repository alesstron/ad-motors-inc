/**
 * ============================================================================
 *  src/context/CurrencyContext.tsx — SWITCH GLOBAL USD / BOLÍVARES
 * ============================================================================
 *  Guarda qué moneda eligió la persona en la barra superior y ofrece una
 *  función `money(usd)` que convierte y da formato a cualquier precio. Así
 *  tarjetas, fichas, garaje, comparador y accesorios cambian TODOS a la vez.
 *
 *  El tipo de cambio (`USD_TO_BS`) es un valor fijo editable en
 *  src/data/site.ts; esta web no consulta tasas en vivo.
 * ============================================================================
 */

'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { USD_TO_BS } from '@/data/site';
import { formatBs, formatCompact, formatCompactBs, formatPrice } from '@/lib/format';

/** Monedas disponibles: dólares (USD) o bolívares (VES). */
export type Currency = 'USD' | 'VES';

interface CurrencyContextValue {
  /** Moneda activa. */
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Bs. por 1 USD. */
  rate: number;
  /** Convierte USD a texto en la moneda activa: money(28500) → "$28.500" o "Bs. 25.111.995". */
  money: (usd: number) => string;
  /** Igual que `money` pero abreviado, para los deslizadores: "$75K" o "Bs. 66,1M". */
  moneyCompact: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/**
 * Proveedor de la moneda. Conversión: Bs. = USD × `USD_TO_BS` (tasa fija).
 * La moneda elegida vive solo en memoria (no se guarda en localStorage):
 * al recargar vuelve a USD.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // ESTADO: moneda activa. Arranca en dólares, que es la moneda de venta.
  const [currency, setCurrency] = useState<Currency>('USD');

  /** Precio completo en la moneda activa. */
  const money = useCallback(
    (usd: number) => (currency === 'USD' ? formatPrice(usd) : formatBs(usd * USD_TO_BS)),
    [currency],
  );

  /** Precio abreviado en la moneda activa. */
  const moneyCompact = useCallback(
    (usd: number) => (currency === 'USD' ? formatCompact(usd) : formatCompactBs(usd * USD_TO_BS)),
    [currency],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rate: USD_TO_BS, money, moneyCompact }),
    [currency, money, moneyCompact],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

/** Hook para usar la moneda desde cualquier componente. */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency debe usarse dentro de <CurrencyProvider>');
  return ctx;
}
