/**
 * ============================================================================
 *  FinancingCalculator — SIMULADOR DE FINANCIAMIENTO VIP (estilo Apple)
 * ============================================================================
 *  Vive dentro de la ficha técnica de cada vehículo. La persona mueve dos
 *  barras y ve al instante su cuota mensual estimada en dólares y bolívares:
 *    - Inicial: del 30 % al 70 % del precio (de 5 en 5).
 *    - Plazo:   6, 12, 18, 24 o 36 meses.
 *  Dos botones al final:
 *    - "Solicitar Pre-Aprobación": pre-llena el formulario de citas (tipo
 *      "compra", vehículo y resumen en notas) y baja hasta él.
 *    - "Enviar por WhatsApp": abre WhatsApp con el mismo resumen.
 *
 *  Los parámetros (rangos, plazos, tasa referencial) están en `FINANCING` de
 *  src/data/site.ts. El cálculo está en src/lib/finance.ts.
 *  IMPORTANTE: la cuota es una ESTIMACIÓN con una tasa de ejemplo; la
 *  aprobación y las condiciones reales las define AD Motors.
 * ============================================================================
 */

'use client';

import { CalendarCheck, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLead } from '@/context/LeadContext';
import { FINANCING } from '@/data/site';
import { calcFinancing } from '@/lib/finance';
import { formatBs, formatPrice } from '@/lib/format';
import { vehicleName } from '@/lib/leads';
import { whatsappLink } from '@/lib/whatsapp';
import type { Vehicle } from '@/types/vehicle';

interface Props {
  vehicle: Vehicle;
  /** Cierra la ficha técnica (se llama antes de bajar al formulario de citas). */
  onClose: () => void;
}

export function FinancingCalculator({ vehicle, onClose }: Props) {
  const { rate } = useCurrency();
  const { book } = useBooking();
  const { location } = useLead();

  // ESTADO: porcentaje de inicial. Arranca en 40 %.
  const [downPct, setDownPct] = useState(40);
  // ESTADO: posición del plazo dentro de FINANCING.terms (0 = 6 meses … 4 = 36 meses). Arranca en 24.
  const [termIdx, setTermIdx] = useState(3);
  const months = FINANCING.terms[termIdx];

  /** Resultado del cálculo; se recalcula en cada render, es instantáneo. */
  const f = calcFinancing({
    price: vehicle.price,
    downPct,
    months,
    annualRate: FINANCING.annualRate,
  });

  /** Porcentaje de llenado de cada barra, para pintar su tramo blanco. */
  const downFill = ((downPct - FINANCING.downMin) / (FINANCING.downMax - FINANCING.downMin)) * 100;
  const termFill = (termIdx / (FINANCING.terms.length - 1)) * 100;

  /** Resumen en una línea; viaja a las notas del formulario y al mensaje de WhatsApp. */
  const summary = `Pre-aprobación de financiamiento: inicial ${downPct}% (${formatPrice(f.down)}), plazo ${months} meses, cuota estimada ${formatPrice(f.payment)} (${formatBs(f.payment * rate)}) con tasa referencial del ${Math.round(FINANCING.annualRate * 100)}% anual.`;

  /** Enlace de WhatsApp con el vehículo, la ubicación y el resumen. */
  const whatsappUrl = whatsappLink(
    [
      'Hola AD Motors, quiero solicitar pre-aprobación de financiamiento:',
      '',
      `Modelo: ${vehicleName(vehicle)}`,
      `Precio: ${formatPrice(vehicle.price)} (${formatBs(vehicle.price * rate)})`,
      `Ubicación: ${location}`,
      '',
      summary,
    ].join('\n'),
  );

  return (
    <section
      aria-label="Calculadora de financiamiento"
      className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5"
    >
      <h4 className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        Financiamiento VIP
      </h4>

      {/* ── BARRA 1: PORCENTAJE DE INICIAL ── */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <label htmlFor="fin-inicial" className="text-zinc-300">
            Inicial
          </label>
          <span className="font-semibold text-white tabular-nums">
            {downPct}% · {formatPrice(f.down)}
          </span>
        </div>
        {/* `--fill` pinta la parte recorrida de la barra (ver clase .slider en globals.css). */}
        <input
          id="fin-inicial"
          type="range"
          className="slider mt-3"
          min={FINANCING.downMin}
          max={FINANCING.downMax}
          step={FINANCING.downStep}
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          style={{ '--fill': `${downFill}%` } as React.CSSProperties}
        />
        <div className="mt-1 flex justify-between text-[11px] text-zinc-600">
          <span>{FINANCING.downMin}%</span>
          <span>{FINANCING.downMax}%</span>
        </div>
      </div>

      {/* ── BARRA 2: PLAZO (saltos discretos: 6, 12, 18, 24, 36 meses) ── */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <label htmlFor="fin-plazo" className="text-zinc-300">
            Plazo
          </label>
          <span className="font-semibold text-white tabular-nums">{months} meses</span>
        </div>
        <input
          id="fin-plazo"
          type="range"
          className="slider mt-3"
          min={0}
          max={FINANCING.terms.length - 1}
          step={1}
          value={termIdx}
          onChange={(e) => setTermIdx(Number(e.target.value))}
          aria-valuetext={`${months} meses`}
          style={{ '--fill': `${termFill}%` } as React.CSSProperties}
        />
        <div className="mt-1 flex justify-between text-[11px] text-zinc-600">
          {FINANCING.terms.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── RESULTADO: cuota en USD y en Bs. ── */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
        <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
          Cuota mensual estimada
        </p>
        {/* aria-live anuncia el nuevo valor a lectores de pantalla al mover las barras. */}
        <p
          aria-live="polite"
          className="mt-1 text-4xl font-semibold tracking-tight text-white tabular-nums"
        >
          {formatPrice(f.payment)}
        </p>
        <p className="mt-0.5 text-sm text-zinc-400 tabular-nums">{formatBs(f.payment * rate)}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-left text-xs">
          <div>
            <dt className="text-zinc-500">A financiar</dt>
            <dd className="mt-0.5 font-medium text-zinc-200 tabular-nums">
              {formatPrice(f.financed)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Total a pagar</dt>
            <dd className="mt-0.5 font-medium text-zinc-200 tabular-nums">
              {formatPrice(f.total)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
        Estimación con tasa referencial del {Math.round(FINANCING.annualRate * 100)}% anual y tipo
        de cambio Bs. {rate.toFixed(2).replace('.', ',')}. Sujeto a aprobación y condiciones de AD
        Motors.
      </p>

      {/* ── BOTONES ── */}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            book(vehicle.id, { tipo: 'compra', notas: summary });
          }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
        >
          <CalendarCheck className="size-4" />
          Solicitar Pre-Aprobación de Financiamiento
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
        >
          <MessageCircle className="size-4" />
          Enviar por WhatsApp
        </a>
      </div>
    </section>
  );
}
