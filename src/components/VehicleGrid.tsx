/**
 * ============================================================================
 *  VehicleGrid — INVENTARIO: FILTROS + CUADRÍCULA (Bento Grid) + FICHA
 * ============================================================================
 *  Es el "cerebro" del catálogo. Guarda el estado de todos los filtros, decide
 *  qué vehículos mostrar y dibuja:
 *    1. El Hero (porque comparte los filtros de marca y categoría).
 *    2. El panel de filtros (marca, categoría, año, precio).
 *    3. La cuadrícula de tarjetas (VehicleCard).
 *    4. La ficha técnica (VehicleModal) cuando se hace clic en una tarjeta.
 *
 *  Todo se filtra en el navegador, sin recargar la página.
 *  Los vehículos salen de src/data/vehicles.ts — aquí NO hay que tocar nada
 *  para agregar o quitar autos.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { useGarage } from '@/context/GarageContext';
import {
  BRANDS,
  CATEGORIES,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  YEAR_MAX,
  YEAR_MIN,
} from '@/data/filters';
import { VEHICLES } from '@/data/vehicles';
import { Hero } from './Hero';
import { RangeSlider } from './ui/RangeSlider';
import { VehicleCard } from './VehicleCard';
import { VehicleModal } from './VehicleModal';

/** Valor especial de los filtros que significa "sin filtrar" (muestra todo). */
const ALL = 'Todas';

export function VehicleGrid() {
  // ── ESTADOS DE LOS FILTROS ────────────────────────────────────────────────
  // Marca elegida. 'Todas' = sin filtrar por marca.
  const [brand, setBrand] = useState<string>(ALL);
  // Categoría elegida. 'Todas' = sin filtrar por categoría.
  const [category, setCategory] = useState<string>(ALL);
  // Rango de años [desde, hasta]. Empieza abarcando todo.
  const [years, setYears] = useState<[number, number]>([YEAR_MIN, YEAR_MAX]);
  // Rango de precio en USD [desde, hasta]. Empieza abarcando todo.
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  // Moneda elegida en la barra superior: los rótulos del deslizador de precio la siguen.
  const { moneyCompact } = useCurrency();

  // Ficha técnica abierta. Su estado vive en GarageContext (y no aquí) para que también se
  // pueda abrir desde el panel del Garaje y el comparador.
  const { activeId, openVehicle, closeVehicle } = useGarage();
  /** Vehículo con la ficha abierta, o `null` si no hay ninguna. */
  const selected = VEHICLES.find((v) => v.id === activeId) ?? null;

  /**
   * LISTA FILTRADA: recorre todo el inventario y se queda solo con los
   * vehículos que cumplen TODOS los filtros a la vez (marca Y categoría Y
   * año Y precio). `useMemo` recalcula únicamente cuando cambia un filtro.
   */
  const results = useMemo(
    () =>
      VEHICLES.filter(
        (v) =>
          (brand === ALL || v.brand === brand) &&
          (category === ALL || v.category === category) &&
          v.year >= years[0] &&
          v.year <= years[1] &&
          v.price >= price[0] &&
          v.price <= price[1],
      ),
    [brand, category, years, price],
  );

  /** ¿Hay algún filtro activo? Controla si aparece el botón "Limpiar filtros". */
  const isFiltered =
    brand !== ALL ||
    category !== ALL ||
    years[0] !== YEAR_MIN ||
    years[1] !== YEAR_MAX ||
    price[0] !== PRICE_MIN ||
    price[1] !== PRICE_MAX;

  /** Devuelve todos los filtros a su valor inicial. */
  const reset = () => {
    setBrand(ALL);
    setCategory(ALL);
    setYears([YEAR_MIN, YEAR_MAX]);
    setPrice([PRICE_MIN, PRICE_MAX]);
  };

  return (
    <>
      {/* PORTADA con buscador: comparte marca y categoría con los filtros de abajo. */}
      <Hero
        brand={brand}
        category={category}
        count={results.length}
        onBrand={setBrand}
        onCategory={setCategory}
      />

      {/* SECCIÓN DEL INVENTARIO (id="inventario" es el destino de los enlaces "Inventario"). */}
      <section id="inventario" className="relative scroll-mt-24 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Encabezado de la sección. */}
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
              Inventario
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Unidades seleccionadas
            </h2>
          </div>

          {/* PANEL DE FILTROS: tarjeta de cristal con cuatro controles. */}
          <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-neutral-900/60 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            {/* Filtro por MARCA (botones en fila; se desplaza en horizontal en celular). */}
            <fieldset className="min-w-0">
              <legend className="mb-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                Marca
              </legend>
              <ChipRow
                options={[ALL, ...BRANDS]}
                value={brand}
                onChange={setBrand}
                allLabel="Todas las marcas"
              />
            </fieldset>

            {/* Filtro por CATEGORÍA. */}
            <fieldset className="min-w-0">
              <legend className="mb-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                Categoría
              </legend>
              <ChipRow options={[ALL, ...CATEGORIES]} value={category} onChange={setCategory} />
            </fieldset>

            {/* Filtros de AÑO y PRECIO: dos deslizadores lado a lado en pantallas medianas. */}
            <div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2 md:gap-10">
              <RangeSlider
                label="Año"
                min={YEAR_MIN}
                max={YEAR_MAX}
                step={1}
                value={years}
                onChange={setYears}
                format={String}
              />
              <RangeSlider
                label="Precio (USD)"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={PRICE_STEP}
                value={price}
                onChange={setPrice}
                format={moneyCompact}
                maxSuffix="+"
              />
            </div>

            {/* Pie del panel: contador de resultados y botón para limpiar. */}
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm">
              <span className="text-zinc-400" aria-live="polite">
                {results.length} {results.length === 1 ? 'vehículo' : 'vehículos'}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-zinc-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  <RotateCcw className="size-3.5" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* BENTO GRID: 1 columna en celular, 2 en tableta, 3 en computadora.
              `auto-rows-fr` hace que todas las filas tengan la misma altura. */}
          <ul className="mt-8 grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* AnimatePresence anima la salida/entrada de tarjetas al filtrar. */}
            <AnimatePresence mode="popLayout">
              {results.map((v, i) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  index={i}
                  // Efecto "bento": la 1.ª, 6.ª, 11.ª… tarjeta ocupa 2 columnas (la más destacada).
                  wide={i % 5 === 0 && results.length > 1}
                  onOpen={(vehicle) => openVehicle(vehicle.id)}
                />
              ))}
            </AnimatePresence>
          </ul>

          {/* ESTADO VACÍO: se muestra cuando ningún vehículo cumple los filtros. */}
          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-white/10 bg-neutral-900/40 px-6 py-20 text-center"
            >
              <SearchX className="size-10 text-zinc-600" />
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                Sin resultados
              </h3>
              <p className="mt-2 max-w-sm text-zinc-400">
                Ninguna unidad coincide con estos filtros. Amplía el rango de año o de precio.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 min-h-11 rounded-full bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
              >
                Limpiar filtros
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* FICHA TÉCNICA: solo aparece cuando `selected` tiene un vehículo. */}
      <VehicleModal vehicle={selected} onClose={closeVehicle} />
    </>
  );
}

/**
 * ChipRow — fila de botones tipo "píldora" para elegir UNA opción (marca o categoría).
 * La opción activa se pinta de blanco; las demás, translúcidas.
 */
function ChipRow({
  options,
  value,
  onChange,
  allLabel,
}: {
  /** Opciones a mostrar como botones. */
  options: string[];
  /** Opción activa. */
  value: string;
  /** Se llama con la opción pulsada. */
  onChange: (v: string) => void;
  /** Texto alternativo para el botón "Todas" (por ejemplo "Todas las marcas"). */
  allLabel?: string;
}) {
  return (
    // `overflow-x-auto` permite desplazar los botones en horizontal si no caben en celular.
    <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none ${
              active
                ? 'border-white bg-white text-zinc-900' // activo
                : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:text-white' // inactivo
            }`}
          >
            {o === ALL && allLabel ? allLabel : o}
          </button>
        );
      })}
    </div>
  );
}
