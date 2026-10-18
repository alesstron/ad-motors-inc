/**
 * ============================================================================
 *  CompareBar — BARRA FLOTANTE DEL COMPARADOR
 * ============================================================================
 *  Aparece abajo en cuanto la persona marca el primer vehículo para comparar.
 *  Muestra los elegidos (máx. 2) con su miniatura y un botón "Comparar" que
 *  se activa al tener 2. Se oculta mientras hay una ficha técnica o el
 *  comparador abiertos, para no estorbar.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, X } from 'lucide-react';
import { useGarage } from '@/context/GarageContext';
import { VEHICLES } from '@/data/vehicles';
import { vehicleName } from '@/lib/leads';
import { SmartImage } from './ui/SmartImage';

/**
 * Barra flotante del comparador. Lee `compareIds` de GarageContext (solo en
 * memoria, no se guarda). Entra y sale deslizándose desde abajo con
 * `AnimatePresence` + resorte de Framer Motion.
 */
export function CompareBar() {
  const {
    compareIds,
    toggleCompare,
    clearCompare,
    setCompareOpen,
    compareOpen,
    activeId,
    garageOpen,
  } = useGarage();

  /** Vehículos elegidos como objetos completos. */
  const chosen = compareIds
    .map((id) => VEHICLES.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  /** La barra se oculta si no hay nada elegido o si hay otra ventana abierta. */
  const visible = chosen.length > 0 && !compareOpen && !activeId && !garageOpen;

  return (
    <AnimatePresence>
      {visible && (
        // Barra de cristal, centrada abajo. En celular deja libre la esquina del botón de WhatsApp.
        <motion.div
          role="region"
          aria-label="Comparador de vehículos"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-neutral-900/80 p-3 pr-20 shadow-2xl backdrop-blur-xl sm:pr-3"
        >
          {/* Dos espacios: cada uno muestra el vehículo elegido o un hueco vacío. */}
          <ul className="flex min-w-0 flex-1 gap-2">
            {[0, 1].map((slot) => {
              const v = chosen[slot];
              return (
                <li
                  key={slot}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5"
                >
                  {v ? (
                    <>
                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                        <SmartImage src={v.images[0]} alt="" sizes="56px" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs text-zinc-200">
                        {v.brand} {v.model}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(v.id)}
                        aria-label={`Quitar ${vehicleName(v)} de la comparación`}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <span className="px-2 text-xs text-zinc-600">Elige otro vehículo</span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Botón principal: solo se activa con 2 vehículos. */}
          <button
            type="button"
            disabled={chosen.length < 2}
            onClick={() => setCompareOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeftRight className="size-4" />
            <span className="hidden sm:inline">Comparar</span>
          </button>
          <button
            type="button"
            onClick={clearCompare}
            aria-label="Limpiar comparación"
            className="hidden size-9 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none sm:grid"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
