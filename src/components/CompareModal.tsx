/**
 * ============================================================================
 *  CompareModal — COMPARADOR LADO A LADO (cristal translúcido)
 * ============================================================================
 *  Pone dos vehículos frente a frente: foto, nombre, precio (en la moneda
 *  elegida) y una tabla con año, kilometraje, motor, potencia, transmisión,
 *  tracción, combustible y color. El mejor valor de cada fila numérica
 *  (menor precio, menor kilometraje, mayor año) se resalta en verde.
 *
 *  Para cambiar qué filas se comparan, edita la lista `rows` de `CompareBody`.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useGarage } from '@/context/GarageContext';
import { VEHICLES } from '@/data/vehicles';
import { useDialog } from '@/hooks/useDialog';
import { formatKm } from '@/lib/format';
import { vehicleName } from '@/lib/leads';
import type { Vehicle } from '@/types/vehicle';
import { Price } from './ui/Price';
import { SmartImage } from './ui/SmartImage';
import { StatusBadge } from './ui/StatusBadge';

/** Componente "puerta": solo se muestra si está abierto y hay exactamente 2 vehículos elegidos. */
export function CompareModal() {
  const { compareOpen, compareIds, setCompareOpen } = useGarage();
  const pair = compareIds
    .map((id) => VEHICLES.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  /** Función de cierre ESTABLE (misma referencia en cada render), requisito de useDialog. */
  const close = useCallback(() => setCompareOpen(false), [setCompareOpen]);

  return (
    <AnimatePresence>
      {compareOpen && pair.length === 2 && <CompareBody a={pair[0]} b={pair[1]} onClose={close} />}
    </AnimatePresence>
  );
}

/** Una fila de la tabla: nombre del dato, cómo leerlo de un vehículo y (opcional) qué lado "gana". */
interface Row {
  label: string;
  /** Texto a mostrar para un vehículo. */
  show: (v: Vehicle) => React.ReactNode;
  /** Si existe, devuelve el número comparable; el mejor lado se resalta. */
  value?: (v: Vehicle) => number;
  /** 'low' = gana el menor (precio, km); 'high' = gana el mayor (año). */
  best?: 'low' | 'high';
}

function CompareBody({ a, b, onClose }: { a: Vehicle; b: Vehicle; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { openVehicle, setCompareOpen } = useGarage();
  // Bloqueo de scroll, Escape y foco (ver src/hooks/useDialog.ts).
  useDialog(onClose, closeRef);

  /** Filas de la tabla comparativa. Agrega, quita o reordena a gusto. */
  const rows: Row[] = [
    { label: 'Precio', show: (v) => <Price usd={v.price} />, value: (v) => v.price, best: 'low' },
    { label: 'Año', show: (v) => v.year, value: (v) => v.year, best: 'high' },
    {
      label: 'Kilometraje',
      show: (v) => formatKm(v.mileage),
      value: (v) => v.mileage,
      best: 'low',
    },
    { label: 'Categoría', show: (v) => v.category },
    { label: 'Motor', show: (v) => v.engine },
    { label: 'Potencia', show: (v) => v.power },
    { label: 'Transmisión', show: (v) => v.transmission },
    { label: 'Tracción', show: (v) => (v.fourByFour ? `4x4 · ${v.drivetrain}` : v.drivetrain) },
    { label: 'Combustible', show: (v) => v.fuel },
    { label: 'Color', show: (v) => v.color },
  ];

  /** ¿Gana este lado en esta fila? (solo si la fila es numérica y los valores difieren). */
  const wins = (row: Row, v: Vehicle, other: Vehicle) => {
    if (!row.value || !row.best) return false;
    const x = row.value(v);
    const y = row.value(other);
    if (x === y) return false;
    return row.best === 'low' ? x < y : x > y;
  };

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Fondo oscuro: un clic lo cierra. */}
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* VENTANA DE CRISTAL: bg translúcido + desenfoque fuerte. */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Comparación: ${vehicleName(a)} frente a ${vehicleName(b)}`}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/15 bg-neutral-900/60 shadow-2xl backdrop-blur-2xl sm:rounded-3xl"
      >
        {/* Cabecera. */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <h2 className="text-lg font-semibold tracking-tight text-white">Comparador</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar comparador"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Cuerpo con scroll propio si no cabe. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Fila de encabezados: una columna vacía (etiquetas) + una por vehículo. */}
          <div className="grid grid-cols-[5.5rem_1fr_1fr] gap-3 sm:grid-cols-[8rem_1fr_1fr] sm:gap-5">
            <div />
            {[a, b].map((v) => (
              <div key={v.id} className="min-w-0">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-white/10">
                  <SmartImage
                    src={v.images[0]}
                    alt={vehicleName(v)}
                    sizes="(min-width: 640px) 30vw, 45vw"
                  />
                  <div className="absolute bottom-2 left-2">
                    <StatusBadge status={v.status} />
                  </div>
                </div>
                <h3 className="mt-3 truncate text-base font-semibold tracking-tight text-white sm:text-lg">
                  {v.brand} {v.model}
                </h3>
                <p className="truncate text-xs text-zinc-400 sm:text-sm">{v.trim}</p>
                <button
                  type="button"
                  onClick={() => {
                    setCompareOpen(false);
                    openVehicle(v.id);
                  }}
                  className="mt-2 min-h-11 rounded-full border border-white/15 bg-white/5 px-4 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  Ver ficha
                </button>
              </div>
            ))}
          </div>

          {/* TABLA: una fila por dato. El valor "ganador" se pinta en verde con un check de texto. */}
          <dl className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/20">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[5.5rem_1fr_1fr] items-center gap-3 px-3 py-3 text-sm sm:grid-cols-[8rem_1fr_1fr] sm:gap-5 sm:px-4"
              >
                <dt className="text-xs text-zinc-500">{row.label}</dt>
                {[
                  { v: a, o: b },
                  { v: b, o: a },
                ].map(({ v, o }) => (
                  <dd
                    key={v.id}
                    className={`min-w-0 font-medium tabular-nums ${
                      wins(row, v, o) ? 'text-emerald-300' : 'text-zinc-100'
                    }`}
                  >
                    {row.show(v)}
                    {wins(row, v, o) && <span className="sr-only"> (mejor opción)</span>}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          <p className="mt-3 text-center text-[11px] text-zinc-600">
            En verde: menor precio, menor kilometraje o año más reciente.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
