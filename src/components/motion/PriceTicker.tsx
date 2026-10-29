/**
 * ============================================================================
 *  PriceTicker — PRECIO QUE "CUENTA" AL CAMBIAR DE MONEDA
 * ============================================================================
 *  Qué hace: muestra el precio en grande y, al elegir otra moneda, la cifra
 *  cuenta hasta el nuevo valor. El selector tiene una pastilla que se desliza
 *  a la opción elegida. Con "reducir movimiento" el cambio es inmediato.
 *
 *  Las tasas NO están aquí: vienen de `PRICE_RATES` (src/data/site.ts) y llegan
 *  por la prop `rates`. Si `rates.EUR` no existe, el botón de euros no aparece.
 *
 *  Uso:  <PriceTicker usd={85000} rates={PRICE_RATES} />
 * ============================================================================
 */

'use client';

import { motion, useMotionValueEvent, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { formatBs, formatPrice } from '@/lib/format';
import { spring as springs } from './tokens';

type Currency = 'USD' | 'EUR' | 'VES';

/** Texto de cada botón del selector. */
const LABEL: Record<Currency, string> = { USD: 'US$', EUR: '€', VES: 'Bs.' };

/** Euros: el formato del proyecto no lo cubre, así que se usa Intl (ej. "85.000 €"). */
const eur = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

/** Da formato a una cantidad con el mismo estilo del resto del sitio ("$85.000", "Bs. 74.889.450"). */
function format(cur: Currency, n: number): string {
  const v = Math.round(n);
  return cur === 'USD' ? formatPrice(v) : cur === 'VES' ? formatBs(v) : eur.format(v);
}

interface Props {
  /** Precio en dólares (el que está en src/data/vehicles.ts). */
  usd: number;
  /** Cuántos Bs. (y opcionalmente EUR) vale 1 US$. */
  rates: { EUR?: number; VES: number };
}

/** Precio animado con selector de moneda. */
export default function PriceTicker({ usd, rates }: Props) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [cur, setCur] = useState<Currency>('USD');

  // Monedas disponibles: el euro solo aparece si hay una tasa configurada.
  const currencies: Currency[] = rates.EUR ? ['USD', 'EUR', 'VES'] : ['USD', 'VES'];
  const target = cur === 'USD' ? usd : usd * (cur === 'EUR' ? (rates.EUR ?? 1) : rates.VES);

  // Valor animado con resorte; el texto visible se actualiza en cada fotograma sin re-renderizar.
  const value = useSpring(target, { stiffness: 90, damping: 20 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) value.jump(target);
    else value.set(target);
  }, [target, reduce, value]);

  useMotionValueEvent(value, 'change', (v) => {
    if (ref.current) ref.current.textContent = format(cur, v);
  });

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Cifra animada (oculta a lectores de pantalla) + versión estable que sí se lee. */}
      <p className="text-4xl font-semibold tracking-tight text-white tabular-nums">
        <span ref={ref} aria-hidden>
          {format(cur, target)}
        </span>
        <span className="sr-only" aria-live="polite">
          {format(cur, target)}
        </span>
      </p>

      {/* Selector de moneda: la pastilla blanca se desliza a la opción activa. */}
      <div
        role="radiogroup"
        aria-label="Moneda"
        className="inline-flex rounded-full border border-white/10 bg-white/5 p-1"
      >
        {currencies.map((c) => {
          const active = c === cur;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCur(c)}
              className="relative min-h-11 min-w-14 rounded-full px-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            >
              {active && (
                <motion.span
                  layoutId={`${uid}-pill`}
                  className="absolute inset-0 rounded-full bg-white"
                  transition={springs.snappy}
                />
              )}
              <span className={`relative ${active ? 'text-zinc-900' : 'text-white/70'}`}>
                {LABEL[c]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
