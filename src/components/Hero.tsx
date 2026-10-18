/**
 * ============================================================================
 *  Hero — PORTADA: título, subtítulo y BUSCADOR RÁPIDO
 * ============================================================================
 *  Qué hace: es lo primero que ve la persona. Contiene el título con degradado
 *  metálico, un buscador (marca + categoría) y tres datos clave del servicio.
 *
 *  El buscador NO guarda su propio estado: recibe los valores y las funciones
 *  desde VehicleGrid (que es quien filtra la lista). Así, elegir "Toyota" aquí
 *  filtra la cuadrícula de abajo en tiempo real.
 *
 *  Cómo modificarlo:
 *   - Título y subtítulo → busca las etiquetas <h1> y <p> más abajo.
 *   - Los 3 datos clave   → edita la lista `STATS`.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowDown, CarFront, Search, Tag } from 'lucide-react';
import { BRANDS, CATEGORIES } from '@/data/filters';
import { SelectField } from './ui/SelectField';

/** Curva de animación suave estilo Apple, reutilizada en todas las animaciones de esta sección. */
const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  /** Marca elegida en el filtro ("Todas" si ninguna). */
  brand: string;
  /** Categoría elegida en el filtro ("Todas" si ninguna). */
  category: string;
  /** Cuántos vehículos cumplen los filtros actuales (se muestra en el botón). */
  count: number;
  /** Función para cambiar la marca. */
  onBrand: (v: string) => void;
  /** Función para cambiar la categoría. */
  onCategory: (v: string) => void;
}

/** Tres datos destacados bajo el buscador: `value` es el número/palabra grande, `label` la explicación. */
const STATS = [
  { value: '24/7', label: 'Atención Concierge' },
  { value: 'Nacional', label: 'Entrega a domicilio' },
  { value: 'Multipunto', label: 'Inspección en cada unidad' },
];

export function Hero({ brand, category, count, onBrand, onCategory }: Props) {
  return (
    // Sección con id="inicio": el logo de la barra superior apunta aquí.
    <section id="inicio" className="relative isolate overflow-hidden px-4 pt-28 pb-20 sm:pt-44">
      {/* RESPLANDORES DE FONDO ("ambient glow"): círculos de color muy difuminados.
          Cambia el color (indigo, fuchsia, sky) o el tamaño (h-/w-) para otro ambiente. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-136 w-240 -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[140px]" />
        <div className="absolute top-24 -left-20 h-96 w-96 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-sky-500/15 blur-[120px]" />
        {/* Degradado inferior que funde el resplandor con el fondo negro. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#09090b] to-transparent" />
      </div>

      {/* Contenido centrado, ancho máximo 4xl. */}
      <div className="mx-auto max-w-4xl text-center">
        {/* Insignia superior con punto verde ("en línea"). */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-wider text-zinc-300 uppercase backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Concesionario de alta gama · Venezuela
        </motion.span>

        {/* TÍTULO PRINCIPAL con degradado metálico (clase `.text-metal` de globals.css). */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="text-metal mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Vehículos de élite, entregados donde estés
        </motion.h1>

        {/* SUBTÍTULO. */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400"
        >
          Camionetas 4x4, pick-ups, deportivos y sedanes de lujo, inspeccionados punto por punto.
          Pruébalo en tu puerta y recíbelo en cualquier estado del país.
        </motion.p>

        {/* BUSCADOR: dos listas desplegables + botón. Al enviar, baja al inventario. */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          role="search"
          aria-label="Buscar vehículos"
          onSubmit={(e) => {
            e.preventDefault(); // evita que el navegador recargue la página
            document.getElementById('inventario')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mx-auto mt-10 grid max-w-3xl gap-2 rounded-3xl border border-white/10 bg-neutral-900/60 p-2 shadow-2xl backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto]"
        >
          {/* Lista de MARCAS (viene de src/data/filters.ts). */}
          <SelectField
            id="hero-marca"
            label="Marca"
            icon={<Tag className="size-4" />}
            value={brand}
            onChange={onBrand}
            options={['Todas', ...BRANDS]}
          />
          {/* Lista de CATEGORÍAS (viene de src/data/filters.ts). */}
          <SelectField
            id="hero-categoria"
            label="Categoría"
            icon={<CarFront className="size-4" />}
            value={category}
            onChange={onCategory}
            options={['Todas', ...CATEGORIES]}
          />
          {/* Botón: muestra cuántos resultados hay y lleva a la cuadrícula. */}
          <button
            type="submit"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <Search className="size-4" />
            <span aria-live="polite">
              {count} {count === 1 ? 'resultado' : 'resultados'}
            </span>
          </button>
        </motion.form>

        {/* TRES DATOS CLAVE (lista de definiciones: término + valor). */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4"
        >
          {STATS.map((s) => (
            // `flex-col-reverse` pone el valor grande arriba y la explicación debajo.
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs text-zinc-500">{s.label}</dt>
              <dd className="text-lg font-semibold tracking-tight text-white sm:text-2xl">
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Enlace discreto para bajar al inventario. */}
        <motion.a
          href="#inventario"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 inline-flex min-h-11 items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Ver inventario <ArrowDown className="size-4" />
        </motion.a>
      </div>
    </section>
  );
}
