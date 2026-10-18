/**
 * ============================================================================
 *  VehicleActions — BOTONES "GARAJE" (corazón) Y "COMPARAR"
 * ============================================================================
 *  Dos botones redondos reutilizados en la tarjeta del vehículo, en la ficha
 *  técnica y en el panel del Garaje:
 *   - FavoriteButton: guarda/quita el vehículo del Garaje (se conserva en el
 *     navegador con localStorage). El corazón "salta" al activarse.
 *   - CompareButton:  añade/quita el vehículo de la comparación (máx. 2).
 *  Estado: ambos leen y escriben en GarageContext.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight, Heart } from 'lucide-react';
import { useGarage } from '@/context/GarageContext';

/** Clases comunes de los botones circulares de vidrio. */
const base =
  'grid size-11 place-items-center rounded-full border backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none';

/** Corazón: guarda el vehículo en el Garaje. `name` se usa en las etiquetas de accesibilidad. */
export function FavoriteButton({ id, name }: { id: string; name: string }) {
  const { isFavorite, toggleFavorite } = useGarage();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Quitar ${name} del Garaje` : `Guardar ${name} en el Garaje`}
      onClick={() => toggleFavorite(id)}
      className={`${base} ${
        active
          ? 'border-rose-300/40 bg-rose-500/25 text-rose-200'
          : 'border-white/15 bg-black/40 text-white hover:bg-black/60'
      }`}
    >
      {/* `key` cambia con el estado: así la animación de "salto" se repite al activar. */}
      <motion.span
        key={String(active)}
        initial={{ scale: active ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart className="size-5" fill={active ? 'currentColor' : 'none'} />
      </motion.span>
    </button>
  );
}

/** Comparar: añade el vehículo a la comparación lado a lado (máximo 2 a la vez). */
export function CompareButton({ id, name }: { id: string; name: string }) {
  const { isComparing, toggleCompare } = useGarage();
  const active = isComparing(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Quitar ${name} de la comparación` : `Comparar ${name}`}
      onClick={() => toggleCompare(id)}
      className={`${base} ${
        active
          ? 'border-indigo-300/50 bg-indigo-500/30 text-indigo-100'
          : 'border-white/15 bg-black/40 text-white hover:bg-black/60'
      }`}
    >
      <ArrowLeftRight className="size-5" />
    </button>
  );
}
