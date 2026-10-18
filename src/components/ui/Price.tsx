/**
 * ============================================================================
 *  Price — MUESTRA UN PRECIO EN LA MONEDA ELEGIDA (USD o Bs.)
 * ============================================================================
 *  Recibe SIEMPRE el precio en dólares (como está en src/data/vehicles.ts) y
 *  lo muestra en la moneda activa del switch de la barra superior.
 *
 *  Uso:  <Price usd={28500} className="text-lg font-semibold" />
 * ============================================================================
 */

'use client';

import { useCurrency } from '@/context/CurrencyContext';

interface Props {
  /** Precio en dólares. */
  usd: number;
  /** Clases de Tailwind para el texto. */
  className?: string;
}

export function Price({ usd, className = '' }: Props) {
  const { money } = useCurrency();
  // `tabular-nums` hace que todos los dígitos midan lo mismo y los precios se alineen.
  return <span className={`tabular-nums ${className}`}>{money(usd)}</span>;
}
