/**
 * ============================================================================
 *  CurrencySwitch — SWITCH GLOBAL USD / Bs. (barra superior)
 * ============================================================================
 *  Un control segmentado de dos opciones. Al cambiarlo, TODOS los precios del
 *  sitio se muestran en la otra moneda (ver CurrencyContext). El tipo de
 *  cambio está en src/data/site.ts (USD_TO_BS) y se ve al pasar el cursor.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { useCurrency, type Currency } from '@/context/CurrencyContext';
import { USD_TO_BS_DATE } from '@/data/site';
import { formatRate } from '@/lib/format';

/** Las dos opciones del switch: `id` interno y `label` visible. */
const OPTIONS: { id: Currency; label: string }[] = [
  { id: 'USD', label: 'USD' },
  { id: 'VES', label: 'Bs.' },
];

export function CurrencySwitch() {
  const { currency, setCurrency, rate } = useCurrency();

  return (
    // Contenedor del grupo. `title` muestra el tipo de cambio al pasar el cursor.
    <div
      role="group"
      aria-label="Moneda de los precios"
      title={`1 USD = Bs. ${formatRate(rate)} (referencial, ${USD_TO_BS_DATE})`}
      className="flex rounded-full border border-white/10 bg-white/5 p-0.5"
    >
      {OPTIONS.map((o) => {
        const active = currency === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => setCurrency(o.id)}
            className="relative min-h-9 min-w-12 rounded-full px-3 text-xs font-semibold tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            {/* Píldora blanca que se desliza bajo la opción activa (layoutId anima el movimiento). */}
            {active && (
              <motion.span
                layoutId="currency-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-white"
              />
            )}
            <span className={`relative ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
