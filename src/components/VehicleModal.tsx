/**
 * ============================================================================
 *  VehicleModal — FICHA TÉCNICA (ventana emergente estilo Apple)
 * ============================================================================
 *  Qué hace: al hacer clic en una tarjeta, abre una ventana con:
 *    - Galería de fotos (CarGallery): un toque en una foto la expande a pantalla completa.
 *    - Nombre, precio animado (PriceTicker, con selector de moneda) y nota sobre el origen del precio.
 *    - Botones de Garaje (corazón) y Comparar.
 *    - Especificaciones técnicas, descripción y equipamiento destacado.
 *    - Calculadora de financiamiento VIP (FinancingCalculator).
 *    - Ficha de inspección multipunto.
 *    - Consulta por WhatsApp con ciudad y accesorios elegidos, "Equipar con
 *      accesorios 4x4" y "Agendar Cita / Test-Drive a Domicilio".
 *
 *  Se cierra con la X, con Escape o haciendo clic en el fondo oscuro. Mientras
 *  está abierta bloquea el scroll de la página (ver src/hooks/useDialog.ts).
 *
 *  Cómo modificarla:
 *   - Cuadros de especificaciones → lista `specs` dentro de `ModalBody`.
 *   - Puntos de inspección        → `INSPECTION_POINTS` en src/data/vehicles.ts.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarCheck,
  Check,
  Cog,
  Fuel,
  Gauge,
  Info,
  MessageCircle,
  Palette,
  Route,
  ShieldCheck,
  Wrench,
  X,
  Zap,
  MapPin,
} from 'lucide-react';
import { useRef } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useGarage } from '@/context/GarageContext';
import { useLead } from '@/context/LeadContext';
import { CIUDADES, PRICE_RATES } from '@/data/site';
import { INSPECTION_POINTS } from '@/data/vehicles';
import { useDialog } from '@/hooks/useDialog';
import { formatKm } from '@/lib/format';
import { vehicleLeadUrl, vehicleName } from '@/lib/leads';
import type { Vehicle } from '@/types/vehicle';
import { FinancingCalculator } from './FinancingCalculator';
import CarGallery from './motion/CarGallery';
import PriceTicker from './motion/PriceTicker';
import { StatusBadge } from './ui/StatusBadge';
import { CompareButton, FavoriteButton } from './ui/VehicleActions';

interface Props {
  /** Vehículo a mostrar. `null` = la ficha está cerrada. */
  vehicle: Vehicle | null;
  /** Se llama para cerrar la ficha. */
  onClose: () => void;
}

/**
 * Componente "puerta": decide si la ficha se muestra. `AnimatePresence` permite
 * que la ficha haga su animación de SALIDA antes de desaparecer del todo.
 */
export function VehicleModal({ vehicle, onClose }: Props) {
  return (
    <AnimatePresence>
      {/* `key` hace que, si cambia el vehículo, la ficha se reinicie por completo. */}
      {vehicle && <ModalBody key={vehicle.id} vehicle={vehicle} onClose={onClose} />}
    </AnimatePresence>
  );
}

/** El contenido real de la ficha técnica. */
function ModalBody({ vehicle: v, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { book } = useBooking();
  const { rate } = useCurrency();
  const { setCompareOpen, isComparing, compareIds } = useGarage();
  const { location, setLocation, accessories, equipVehicle } = useLead();

  // Referencia al botón de cerrar, para darle el foco al abrir (accesibilidad por teclado).
  const closeRef = useRef<HTMLButtonElement>(null);

  /** Fotos para <CarGallery>: cada una con su texto alternativo. */
  const photos = v.images.map((src, i) => ({
    src,
    alt: `${vehicleName(v)}, vista ${i + 1} de ${v.images.length}`,
  }));

  useDialog(onClose, closeRef);

  /** Nombre completo, por ejemplo "Toyota 4Runner Limited 4WD 2008". */
  const title = vehicleName(v);

  /**
   * Los seis cuadros de especificaciones. Agrega, quita o reordena líneas
   * para cambiar lo que se ve en la ficha.
   */
  const specs = [
    { icon: Gauge, label: 'Kilometraje', value: formatKm(v.mileage) },
    { icon: Cog, label: 'Transmisión', value: v.transmission },
    { icon: Fuel, label: 'Motor', value: `${v.engine} · ${v.power}` },
    {
      icon: Route,
      label: 'Tracción',
      value: v.fourByFour ? `4x4 · ${v.drivetrain}` : v.drivetrain,
    },
    { icon: Zap, label: 'Combustible', value: v.fuel },
    { icon: Palette, label: 'Color', value: v.color },
    { icon: MapPin, label: 'Ubicación', value: v.location },
  ];

  /** Nota bajo el precio según de dónde salga (campo `priceBasis` del vehículo). */
  const priceNote =
    v.priceBasis === 'referencia'
      ? `Precio de referencia de mercado: ${v.priceSource}.`
      : v.priceBasis === 'cliente'
        ? 'Precio publicado por AD Motors. Confirma disponibilidad y condiciones con un asesor.'
        : 'Precio estimado de mercado. Confirma el valor final con un asesor.';

  /** Solo SUV 4x4 y Pick-Up pueden equiparse con accesorios 4x4. */
  const canEquip = v.category === 'SUV 4x4' || v.category === 'Pick-Up';

  return (
    // CAPA EXTERIOR: cubre toda la pantalla (`fixed inset-0`) y centra la ventana. Hace fade al abrir/cerrar.
    <motion.div
      className="fixed inset-0 z-60 flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* FONDO OSCURO con desenfoque. Hacer clic aquí cierra la ficha. */}
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* VENTANA: en celular sube desde abajo; en computadora se centra. En pantallas grandes
          se divide en dos columnas (`lg:flex-row`): galería a la izquierda, datos a la derecha. */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha técnica de ${title}`}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-neutral-900/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl lg:max-h-[90dvh]"
      >
        {/* BOTÓN CERRAR (X), arriba a la derecha. */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="absolute top-4 right-4 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
        >
          <X className="size-5" />
        </button>

        {/* CONTENIDO CON SCROLL: en celular todo se desplaza junto; en computadora, cada columna
            tiene su propio scroll. La X queda fuera para no moverse al desplazarse. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* ─────────── COLUMNA IZQUIERDA: GALERÍA DE FOTOS (CarGallery) ─────────── */}
          <div className="flex shrink-0 flex-col gap-3 p-3 lg:w-[52%] lg:overflow-y-auto lg:p-4">
            {/* Fotos en cuadrícula; al tocar una se expande a pantalla completa. */}
            <CarGallery photos={photos} />
            {/* Estado del vehículo bajo las fotos. */}
            <div>
              <StatusBadge status={v.status} />
            </div>
          </div>

          {/* ─────────── COLUMNA DERECHA        {/* ─────────── COLUMNA DERECHA: DATOS (con scroll propio si no caben) ─────────── */}
          <div className="flex flex-col p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-8 lg:pl-4">
            {/* Categoría y año. */}
            <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
              {v.category} · {v.year}
            </p>
            {/* Nombre y versión. `pr-12` deja espacio para el botón X. */}
            <h3 className="mt-2 pr-12 text-3xl font-semibold tracking-tight text-white">
              {v.brand} {v.model}
            </h3>
            <p className="mt-1 text-zinc-400">{v.trim}</p>

            {/* PRECIO en grande (moneda elegida) + nota sobre su origen. */}
            <div className="mt-5">
              <PriceTicker usd={v.price} rates={PRICE_RATES} />
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              {priceNote}
            </p>

            {/* ACCIONES RÁPIDAS: Garaje (corazón) y Comparar. */}
            <div className="mt-4 flex items-center gap-2">
              <FavoriteButton id={v.id} name={title} />
              <CompareButton id={v.id} name={title} />
              <span className="text-xs text-zinc-500">Guardar en el Garaje · Comparar</span>
              {/* Cuando ya hay 2 vehículos elegidos y este es uno de ellos, ofrece abrir el comparador. */}
              {isComparing(v.id) && compareIds.length === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setCompareOpen(true);
                  }}
                  className="ml-auto min-h-11 rounded-full border border-indigo-300/30 bg-indigo-500/20 px-4 text-xs font-medium text-indigo-100 transition-colors hover:bg-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  Ver comparación
                </button>
              )}
            </div>

            {/* ESPECIFICACIONES: cuadrícula de 2 columnas con un cuadro por dato. */}
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
                >
                  <Icon className="size-4 text-zinc-500" />
                  <dd className="mt-2 text-sm leading-snug font-semibold text-white">{value}</dd>
                  <dt className="mt-0.5 text-xs text-zinc-500">{label}</dt>
                </div>
              ))}
            </dl>

            {/* DESCRIPCIÓN. */}
            <p className="mt-6 leading-relaxed text-zinc-400">{v.description}</p>

            {/* EQUIPAMIENTO DESTACADO: etiquetas tipo píldora. */}
            <ul className="mt-4 flex flex-wrap gap-2">
              {v.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300"
                >
                  {h}
                </li>
              ))}
            </ul>

            {/* CALCULADORA DE FINANCIAMIENTO VIP (sliders de inicial y plazo). */}
            <FinancingCalculator vehicle={v} onClose={onClose} />

            {/* FICHA DE INSPECCIÓN MULTIPUNTO (lista de src/data/vehicles.ts). */}
            <h4 className="mt-7 flex items-center gap-2 text-xs font-medium tracking-wider text-zinc-500 uppercase">
              <ShieldCheck className="size-4" />
              Ficha de inspección multipunto
            </h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {INSPECTION_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-zinc-300">
                  <Check className="size-4 shrink-0 text-emerald-400" />
                  {p}
                </li>
              ))}
            </ul>

            {/* CONSULTA POR WHATSAPP: ciudad + accesorios elegidos viajan en el mensaje. */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <h4 className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Consultar este vehículo
              </h4>
              <label htmlFor="modal-ciudad" className="mt-4 block text-sm text-zinc-300">
                ¿Dónde te encuentras?
              </label>
              <select
                id="modal-ciudad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-white transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
              >
                {CIUDADES.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900">
                    {c}
                  </option>
                ))}
              </select>
              {/* Aviso de cuántos accesorios viajarán en el mensaje. */}
              <p className="mt-3 text-xs text-zinc-500">
                {accessories.length > 0
                  ? `Se incluirán ${accessories.length} accesorio${accessories.length === 1 ? '' : 's'} 4x4 en tu mensaje.`
                  : 'Puedes añadir accesorios 4x4 y se incluirán en tu mensaje.'}
              </p>
              <a
                href={vehicleLeadUrl({ vehicle: v, location, accessories, rate })}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <MessageCircle className="size-4" />
                Consultar por WhatsApp
              </a>
            </div>

            {/* BOTONES FINALES: equipar con accesorios (si aplica) y agendar cita. */}
            {canEquip && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  equipVehicle(v.id);
                }}
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
              >
                <Wrench className="size-4" />
                Personalizar con accesorios 4x4
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onClose();
                book(v.id);
              }}
              className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-medium text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
            >
              <CalendarCheck className="size-5" />
              Agendar Cita / Test-Drive a Domicilio
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
