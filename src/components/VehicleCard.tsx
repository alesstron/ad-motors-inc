/**
 * ============================================================================
 *  VehicleCard — TARJETA DE UN VEHÍCULO en la cuadrícula
 * ============================================================================
 *  Qué hace: muestra la portada (primera foto), el estado, el nombre, el
 *  precio (en la moneda elegida) y cuatro especificaciones clave
 *  (transmisión, kilometraje, motor y tracción). Al hacer clic abre la ficha
 *  técnica. Arriba a la derecha lleva dos botones: corazón (Garaje) y
 *  comparar.
 *
 *  Estructura: el botón "abrir ficha" ocupa toda la tarjeta y los botones de
 *  corazón/comparar son HERMANOS suyos (no están dentro), porque HTML no
 *  permite un botón dentro de otro botón.
 *
 *  Cómo modificarla:
 *   - Qué especificaciones se ven → lista `specs` dentro del componente.
 *   - Colores, bordes y efecto hover → clases de Tailwind del contenedor.
 *   - Los DATOS (precio, fotos, motor…) NO se cambian aquí: están en src/data/vehicles.ts.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { Cog, Fuel, Gauge, Route } from 'lucide-react';
import { formatKm } from '@/lib/format';
import type { Vehicle } from '@/types/vehicle';
import { Price } from './ui/Price';
import { SmartImage } from './ui/SmartImage';
import { StatusBadge } from './ui/StatusBadge';
import { CompareButton, FavoriteButton } from './ui/VehicleActions';

interface Props {
  /** El vehículo a dibujar (un elemento de la lista de src/data/vehicles.ts). */
  vehicle: Vehicle;
  /** true = la tarjeta ocupa 2 columnas (efecto "bento" destacado). */
  wide?: boolean;
  /** Posición en la lista; se usa para escalonar la animación de entrada. */
  index: number;
  /** Se llama con el vehículo al hacer clic (abre la ficha técnica). */
  onOpen: (v: Vehicle) => void;
}

export function VehicleCard({ vehicle: v, wide, index, onOpen }: Props) {
  /** Nombre corto para las etiquetas de accesibilidad de los botones. */
  const name = `${v.brand} ${v.model} ${v.year}`;

  /**
   * Las cuatro especificaciones de la tarjeta.
   * Cada una tiene un icono, un nombre (solo para lectores de pantalla) y el valor visible.
   * Para mostrar otra (por ejemplo `v.fuel`), agrega una línea nueva aquí.
   */
  const specs = [
    { icon: Cog, label: 'Transmisión', value: v.transmission },
    { icon: Gauge, label: 'Kilometraje', value: formatKm(v.mileage) },
    { icon: Fuel, label: 'Motor', value: v.engine },
    { icon: Route, label: 'Tracción', value: v.fourByFour ? '4x4' : v.drivetrain },
  ];

  return (
    // Elemento de lista animado: aparece subiendo y con fade; `layout` anima los cambios de posición al filtrar.
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      // El `delay` crece con el índice para que las tarjetas entren una tras otra (máx. 0,3 s).
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      // Si es "wide", ocupa 2 columnas desde pantallas medianas.
      className={wide ? 'md:col-span-2' : ''}
    >
      {/* Contenedor relativo: permite colocar los botones de acción sobre la tarjeta. */}
      <div className="group relative h-full">
        {/* BOTÓN PRINCIPAL = toda la tarjeta. Sube 4 px al pasar el cursor y el borde se aclara. */}
        <button
          type="button"
          onClick={() => onOpen(v)}
          aria-label={`Ver ficha técnica de ${v.brand} ${v.model} ${v.trim} ${v.year}`}
          className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
        >
          {/* ZONA DE LA FOTO: ocupa el espacio sobrante (`flex-1`) con una altura mínima. */}
          <div className={`relative min-h-64 flex-1 overflow-hidden ${wide ? 'md:min-h-96' : ''}`}>
            {/* Portada = primera foto de la lista `images`. Hace zoom suave al pasar el cursor. */}
            <SmartImage
              src={v.images[0]}
              alt={`${v.brand} ${v.model} ${v.trim} ${v.year}`}
              sizes={wide ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
              priority={index < 2} // las dos primeras cargan con prioridad
              className="group-hover:scale-105"
            />
            {/* Degradado oscuro inferior para que el texto sobre la foto se lea bien. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-transparent to-transparent"
            />
            {/* Estado ("Certificado AD", etc.) arriba a la izquierda. */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <StatusBadge status={v.status} />
            </div>
            {/* Año y color abajo a la izquierda, sobre la foto. */}
            <p className="absolute bottom-4 left-5 text-[11px] font-medium tracking-wider text-zinc-300 uppercase">
              {v.year} · {v.color}
            </p>
            {/* Categoría abajo a la derecha. */}
            <span className="absolute right-4 bottom-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-wider text-white uppercase backdrop-blur-md">
              {v.category}
            </span>
          </div>

          {/* ZONA DE TEXTO: nombre, precio y especificaciones. */}
          <div className="space-y-4 p-5 sm:p-6">
            {/* Nombre a la izquierda, precio a la derecha. */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {v.brand} {v.model}
                </h3>
                <p className="mt-0.5 truncate text-sm text-zinc-400">{v.trim}</p>
              </div>
              <Price
                usd={v.price}
                className="text-right text-lg font-semibold tracking-tight whitespace-nowrap text-white"
              />
            </div>

            {/* Las 4 especificaciones en una cuadrícula de 2 columnas. */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-sm">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex min-w-0 items-center gap-2 text-zinc-300">
                  <Icon className="size-4 shrink-0 text-zinc-500" />
                  <dt className="sr-only">{label}</dt>
                  <dd className="truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </button>

        {/* BOTONES DE ACCIÓN: corazón (Garaje) y comparar. Están sobre la foto, arriba a la derecha. */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <CompareButton id={v.id} name={name} />
          <FavoriteButton id={v.id} name={name} />
        </div>
      </div>
    </motion.li>
  );
}
