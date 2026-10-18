/**
 * ============================================================================
 *  GarageDrawer — PANEL LATERAL "MI GARAJE" (vehículos favoritos)
 * ============================================================================
 *  Contiene dos piezas:
 *   - GarageButton: el botón con corazón y contador que va en la barra superior.
 *   - GarageDrawer: el panel que se desliza desde la derecha con los
 *     vehículos guardados. Cada uno se puede abrir (ficha técnica), añadir al
 *     comparador o quitar. Abajo, un botón envía TODO el garaje por WhatsApp.
 *
 *  Los favoritos se guardan en el navegador (localStorage, clave "adm.garage"),
 *  así que siguen ahí al volver. Ver src/context/GarageContext.tsx.
 *  Las animaciones (panel, fondo y cada tarjeta) son de Framer Motion.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, Trash2, X } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useGarage } from '@/context/GarageContext';
import { useLead } from '@/context/LeadContext';
import { CIUDADES } from '@/data/site';
import { VEHICLES } from '@/data/vehicles';
import { useDialog } from '@/hooks/useDialog';
import { garageLeadUrl, vehicleName } from '@/lib/leads';
import { Price } from './ui/Price';
import { SmartImage } from './ui/SmartImage';
import { CompareButton } from './ui/VehicleActions';

/** Botón de la barra superior: corazón + número de vehículos guardados. */
export function GarageButton() {
  const { favorites, setGarageOpen } = useGarage();
  /** Solo cuenta favoritos que sigan existiendo en el catálogo. */
  const count = VEHICLES.filter((v) => favorites.includes(v.id)).length;

  return (
    <button
      type="button"
      onClick={() => setGarageOpen(true)}
      aria-label={`Abrir mi Garaje, ${count} vehículo${count === 1 ? '' : 's'} guardado${count === 1 ? '' : 's'}`}
      className="relative grid size-11 place-items-center rounded-xl text-zinc-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
    >
      <Heart className="size-5" fill={count > 0 ? 'currentColor' : 'none'} />
      {/* Globito con el número; aparece con un pequeño "salto" cuando hay favoritos. */}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] leading-4 font-semibold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/** Componente "puerta" del panel: lo muestra u oculta con animación. */
export function GarageDrawer() {
  const { garageOpen } = useGarage();
  return <AnimatePresence>{garageOpen && <DrawerBody />}</AnimatePresence>;
}

/** El panel en sí. Solo existe mientras está abierto. */
function DrawerBody() {
  const { favorites, toggleFavorite, clearFavorites, setGarageOpen, openVehicle } = useGarage();
  const { rate } = useCurrency();
  const { location, setLocation } = useLead();
  const closeRef = useRef<HTMLButtonElement>(null);

  /** Función estable para cerrar el panel. */
  const close = useMemo(() => () => setGarageOpen(false), [setGarageOpen]);
  // Bloqueo de scroll, Escape y foco (ver src/hooks/useDialog.ts).
  useDialog(close, closeRef);

  /** Vehículos guardados, en el orden en que se agregaron (se ignoran ids que ya no existan). */
  const saved = favorites
    .map((id) => VEHICLES.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    // Capa que cubre la pantalla; el fondo oscuro cierra el panel al hacer clic.
    <motion.div
      className="fixed inset-0 z-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div aria-hidden onClick={close} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* PANEL: se desliza desde la derecha con efecto de resorte suave. */}
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Mi Garaje"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 36 }}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-neutral-900/85 shadow-2xl backdrop-blur-xl"
      >
        {/* Cabecera: título, contador y botón de cerrar. */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">Mi Garaje</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {saved.length} vehículo{saved.length === 1 ? '' : 's'} guardado
              {saved.length === 1 ? '' : 's'} en este dispositivo
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar Garaje"
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Lista con scroll propio. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {saved.length === 0 ? (
            // ESTADO VACÍO.
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Heart className="size-10 text-zinc-700" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                Tu garaje está vacío
              </h3>
              <p className="mt-2 max-w-xs text-sm text-zinc-400">
                Toca el corazón de cualquier vehículo para guardarlo aquí y compararlo después.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {/* Cada vehículo entra y sale con animación; `layout` reacomoda al quitar uno. */}
              <AnimatePresence initial={false}>
                {saved.map((v) => (
                  <motion.li
                    key={v.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    {/* Miniatura: clic = abrir la ficha técnica. */}
                    <button
                      type="button"
                      onClick={() => {
                        setGarageOpen(false);
                        openVehicle(v.id);
                      }}
                      aria-label={`Ver ficha de ${vehicleName(v)}`}
                      className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                    >
                      <SmartImage src={v.images[0]} alt="" sizes="112px" />
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="truncate text-sm font-semibold text-white">
                          {v.brand} {v.model}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {v.trim} · {v.year}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <Price usd={v.price} className="text-sm font-semibold text-white" />
                        <div className="flex gap-1.5">
                          <CompareButton id={v.id} name={vehicleName(v)} />
                          <button
                            type="button"
                            onClick={() => toggleFavorite(v.id)}
                            aria-label={`Quitar ${vehicleName(v)} del Garaje`}
                            className="grid size-11 place-items-center rounded-full border border-white/15 bg-black/40 text-zinc-300 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-rose-300 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Pie: ciudad, WhatsApp con todo el garaje y vaciar. Solo si hay vehículos. */}
        {saved.length > 0 && (
          <div className="space-y-3 border-t border-white/10 p-5">
            <label htmlFor="garage-ciudad" className="block text-xs text-zinc-500">
              Ubicación para la consulta
            </label>
            <select
              id="garage-ciudad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
            >
              {CIUDADES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>
            <a
              href={garageLeadUrl(saved, location, rate)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-medium text-white transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <MessageCircle className="size-4" />
              Consultar mi Garaje por WhatsApp
            </a>
            <button
              type="button"
              onClick={clearFavorites}
              className="min-h-11 w-full rounded-xl text-sm text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
            >
              Vaciar Garaje
            </button>
          </div>
        )}
      </motion.aside>
    </motion.div>
  );
}
