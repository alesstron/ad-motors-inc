/**
 * ============================================================================
 *  AccessoriesSection — ACCESORIOS & EQUIPAMIENTO 4x4 VIP
 * ============================================================================
 *  Catálogo interactivo para personalizar camionetas. La persona:
 *    1. Navega por 4 familias (pestañas): Suspensión, Cauchos & Rines,
 *       Parachoques & Protección, Iluminación & Winches.
 *    2. Marca los accesorios que quiere (se pueden mezclar de varias familias).
 *    3. Elige su vehículo (SUV 4x4 o Pick-Up) y su ciudad en el panel
 *       "Tu presupuesto", que suma vehículo + accesorios en tiempo real.
 *    4. Pulsa "Equipar este Vehículo por WhatsApp": se abre WhatsApp con
 *       modelo, año, precio, ciudad y la lista de accesorios.
 *
 *  Los accesorios elegidos se guardan en LeadContext, así también viajan en
 *  la consulta de WhatsApp de la ficha técnica.
 *
 *  Cómo modificarla:
 *   - Accesorios, precios y familias → src/data/accessories.ts (NO aquí).
 *   - Iconos de cada familia         → objeto `CATEGORY_ICONS` de abajo.
 *  Los precios son ESTIMADOS (ver cabecera de src/data/accessories.ts).
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpFromLine,
  Check,
  CircleDot,
  Lightbulb,
  MessageCircle,
  Plus,
  Shield,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useLead } from '@/context/LeadContext';
import { ACCESSORIES, ACCESSORY_CATEGORIES } from '@/data/accessories';
import { CIUDADES } from '@/data/site';
import { VEHICLES } from '@/data/vehicles';
import { equipLeadUrl, vehicleName } from '@/lib/leads';
import type { AccessoryCategoryId } from '@/types/accessory';
import { Price } from './ui/Price';
import { SmartImage } from './ui/SmartImage';

/** Curva de animación suave reutilizada. */
const ease = [0.22, 1, 0.36, 1] as const;

/** Icono de cada familia (de lucide-react: https://lucide.dev/icons). */
const CATEGORY_ICONS = {
  suspension: ArrowUpFromLine,
  ruedas: CircleDot,
  proteccion: Shield,
  iluminacion: Lightbulb,
} satisfies Record<AccessoryCategoryId, typeof Shield>;

/** Solo estos vehículos pueden equiparse: camionetas SUV 4x4 y pick-ups. */
const EQUIPPABLE = VEHICLES.filter((v) => v.category === 'SUV 4x4' || v.category === 'Pick-Up');

/** Clases de Tailwind compartidas por las listas desplegables del panel. */
const selectClass =
  'mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-white transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none';

export function AccessoriesSection() {
  const { rate } = useCurrency();
  const {
    location,
    setLocation,
    accessoryIds,
    accessories,
    toggleAccessory,
    clearAccessories,
    equipVehicleId,
    setEquipVehicleId,
  } = useLead();

  // ESTADO: familia (pestaña) que se está viendo.
  const [tab, setTab] = useState<AccessoryCategoryId>('suspension');

  /** Familia activa y sus accesorios. */
  const category = ACCESSORY_CATEGORIES.find((c) => c.id === tab)!;
  const items = ACCESSORIES.filter((a) => a.category === tab);

  /** Vehículo elegido (o undefined) y los totales del presupuesto. */
  const vehicle = EQUIPPABLE.find((v) => v.id === equipVehicleId);
  const accessoriesTotal = accessories.reduce((sum, a) => sum + a.priceUsd, 0);
  const total = (vehicle?.price ?? 0) + accessoriesTotal;

  /** El botón de WhatsApp solo se activa con vehículo Y al menos un accesorio. */
  const ready = Boolean(vehicle) && accessories.length > 0;

  return (
    // Sección con id="accesorios" (destino del enlace de la barra y del botón "Personalizar" de la ficha).
    <section id="accesorios" className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20">
      {/* Resplandor fucsia difuso de fondo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-96 w-200 -translate-x-1/2 rounded-full bg-fuchsia-600/12 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Encabezado de la sección. */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
            Equipamiento VIP
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Accesorios 4x4
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Personaliza tu camioneta con las mejores marcas off-road. Elige, suma al presupuesto y
            recibe tu cotización por WhatsApp.
          </p>
        </div>

        {/* Dos columnas en computadora: catálogo (izquierda) y presupuesto (derecha). */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
          {/* ───────────── CATÁLOGO ───────────── */}
          <div>
            {/* PESTAÑAS: se desplazan en horizontal en celular. El número muestra cuántos hay elegidos. */}
            <div
              role="tablist"
              aria-label="Familias de accesorios"
              className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            >
              {ACCESSORY_CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c.id];
                const active = c.id === tab;
                const picked = accessories.filter((a) => a.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`tab-${c.id}`}
                    aria-selected={active}
                    aria-controls="panel-accesorios"
                    onClick={() => setTab(c.id)}
                    className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none ${
                      active
                        ? 'border-white bg-white text-zinc-900'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <Icon className="size-4" />
                    {c.title}
                    {picked > 0 && (
                      <span
                        className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] leading-5 font-semibold ${
                          active ? 'bg-zinc-900 text-white' : 'bg-white/15 text-white'
                        }`}
                      >
                        {picked}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-sm text-zinc-500">{category.blurb}</p>

            {/* TARJETAS de la familia activa. `key={tab}` reinicia la animación al cambiar de pestaña. */}
            <motion.ul
              key={tab}
              id="panel-accesorios"
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              {items.map((a) => {
                const selected = accessoryIds.includes(a.id);
                return (
                  <li key={a.id}>
                    <article
                      className={`flex h-full flex-col rounded-3xl border bg-neutral-900/60 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                        selected
                          ? 'border-emerald-300/40 hover:border-emerald-300/60'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Foto del producto (si no existe el archivo, SmartImage muestra un aviso). */}
                      {a.image && (
                        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                          <SmartImage
                            src={a.image}
                            alt={a.imageAlt ?? `${a.brand} ${a.name}`}
                            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
                          />
                        </div>
                      )}
                      <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                        {a.brand}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-white">
                        {a.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                        {a.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <Price usd={a.priceUsd} className="text-lg font-semibold text-white" />
                          {a.note && <p className="text-[11px] text-zinc-500">{a.note}</p>}
                        </div>
                        {/* Botón para añadir/quitar del presupuesto. */}
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleAccessory(a.id)}
                          className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none ${
                            selected
                              ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                              : 'bg-white text-zinc-900 hover:bg-zinc-200'
                          }`}
                        >
                          {selected ? <Check className="size-4" /> : <Plus className="size-4" />}
                          {selected ? 'Añadido' : 'Añadir'}
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </motion.ul>

            <p className="mt-5 text-xs leading-relaxed text-zinc-600">
              Precios y fotos referenciales (las imágenes no son del producto exacto). La
              compatibilidad con cada modelo y año, la instalación y el precio final se confirman
              con un asesor por WhatsApp.
            </p>
          </div>

          {/* ───────────── PANEL "TU PRESUPUESTO" (se queda fijo al hacer scroll en computadora) ───────────── */}
          <aside
            aria-label="Tu presupuesto"
            className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl backdrop-blur-xl lg:sticky lg:top-28"
          >
            <h3 className="text-lg font-semibold tracking-tight text-white">Tu presupuesto</h3>

            {/* Vehículo a equipar. */}
            <label htmlFor="equip-vehiculo" className="mt-4 block text-sm text-zinc-300">
              Vehículo a equipar
            </label>
            <select
              id="equip-vehiculo"
              value={equipVehicleId}
              onChange={(e) => setEquipVehicleId(e.target.value)}
              className={selectClass}
            >
              <option value="" className="bg-neutral-900">
                Elige tu camioneta…
              </option>
              {EQUIPPABLE.map((v) => (
                <option key={v.id} value={v.id} className="bg-neutral-900">
                  {vehicleName(v)}
                </option>
              ))}
            </select>

            {/* Ciudad. */}
            <label htmlFor="equip-ciudad" className="mt-4 block text-sm text-zinc-300">
              Tu ciudad
            </label>
            <select
              id="equip-ciudad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={selectClass}
            >
              {CIUDADES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>

            {/* Lista de accesorios elegidos (de todas las familias). */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  Accesorios ({accessories.length})
                </h4>
                {accessories.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAccessories}
                    className="min-h-9 rounded-lg px-2 text-xs text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                  >
                    Quitar todos
                  </button>
                )}
              </div>
              {accessories.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500">
                  Aún no has añadido accesorios. Elige de las familias de la izquierda.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {accessories.map((a) => (
                      <motion.li
                        key={a.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="min-w-0 flex-1 truncate text-zinc-300">
                            {a.brand} {a.name}
                          </span>
                          <Price usd={a.priceUsd} className="shrink-0 text-zinc-100" />
                          <button
                            type="button"
                            onClick={() => toggleAccessory(a.id)}
                            aria-label={`Quitar ${a.name}`}
                            className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* TOTALES. */}
            <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <dt>Vehículo</dt>
                <dd>{vehicle ? <Price usd={vehicle.price} /> : '—'}</dd>
              </div>
              <div className="flex justify-between text-zinc-400">
                <dt>Accesorios</dt>
                <dd>
                  <Price usd={accessoriesTotal} />
                </dd>
              </div>
              <div className="flex items-baseline justify-between pt-2 text-white">
                <dt className="font-medium">Presupuesto estimado</dt>
                <dd aria-live="polite">
                  <Price usd={total} className="text-2xl font-semibold tracking-tight" />
                </dd>
              </div>
            </dl>

            {/* BOTÓN DE WHATSAPP: activo solo con vehículo y al menos un accesorio. */}
            {ready && vehicle ? (
              <a
                href={equipLeadUrl({ vehicle, location, accessories, rate })}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-center text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <MessageCircle className="size-4 shrink-0" />
                Equipar este Vehículo por WhatsApp
              </a>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-5 flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-center text-sm font-medium text-white opacity-40"
                >
                  <MessageCircle className="size-4 shrink-0" />
                  Equipar este Vehículo por WhatsApp
                </button>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  {!vehicle ? 'Elige tu camioneta' : 'Añade al menos un accesorio'} para activar el
                  botón.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
