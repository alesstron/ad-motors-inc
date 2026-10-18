/**
 * ============================================================================
 *  VehicleModal — FICHA TÉCNICA (ventana emergente estilo Apple)
 * ============================================================================
 *  Qué hace: al hacer clic en una tarjeta, abre una ventana con:
 *    - Galería de fotos (flechas, miniaturas, teclado ← →). Un clic en la
 *      foto grande abre el visor a pantalla completa con zoom (Lightbox).
 *    - Nombre, precio (en la moneda elegida) y nota sobre el origen del precio.
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
  ChevronLeft,
  ChevronRight,
  Cog,
  Fuel,
  Gauge,
  Info,
  Maximize2,
  MessageCircle,
  Palette,
  Route,
  ShieldCheck,
  Wrench,
  X,
  Zap,
  MapPin,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useGarage } from '@/context/GarageContext';
import { useLead } from '@/context/LeadContext';
import { CIUDADES } from '@/data/site';
import { INSPECTION_POINTS } from '@/data/vehicles';
import { useDialog } from '@/hooks/useDialog';
import { formatKm } from '@/lib/format';
import { vehicleLeadUrl, vehicleName } from '@/lib/leads';
import type { Vehicle } from '@/types/vehicle';
import { FinancingCalculator } from './FinancingCalculator';
import { Lightbox } from './Lightbox';
import { Price } from './ui/Price';
import { SmartImage } from './ui/SmartImage';
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

  // ESTADO: índice de la foto que se ve ahora en la galería (0 = la primera).
  const [current, setCurrent] = useState(0);
  // ESTADO: ¿está abierto el visor a pantalla completa? (`null` = cerrado; número = foto inicial)
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);
  // Referencia al botón de cerrar, para darle el foco al abrir (accesibilidad por teclado).
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Cantidad de fotos del vehículo. */
  const total = v.images.length;

  /** Foto anterior (si estás en la primera, salta a la última). */
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  /** Foto siguiente (si estás en la última, vuelve a la primera). */
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  /** Cierra el visor a pantalla completa. Función ESTABLE, requisito de useDialog. */
  const closeLightbox = useCallback(() => setLightboxAt(null), []);

  /** Teclas ← → para cambiar de foto (Escape lo maneja useDialog). */
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (total < 2) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    },
    [prev, next, total],
  );

  // Bloqueo de scroll, Escape y foco (ver src/hooks/useDialog.ts).
  useDialog(onClose, closeRef, onKey);

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
        className="relative flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-neutral-900/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl lg:max-h-[90dvh] lg:flex-row"
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

        {/* ─────────── COLUMNA IZQUIERDA: GALERÍA DE FOTOS ─────────── */}
        <div className="flex shrink-0 flex-col gap-3 p-3 lg:w-[52%] lg:p-4">
          {/* Foto grande. Un clic abre el visor a pantalla completa con zoom. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-0 lg:flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <SmartImage
                  src={v.images[current]}
                  alt={`${title}, vista ${current + 1} de ${total}`}
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* Botón invisible sobre toda la foto: abre el visor a pantalla completa. */}
            <button
              type="button"
              onClick={() => setLightboxAt(current)}
              aria-label="Ver foto a pantalla completa con zoom"
              className="absolute inset-0 cursor-zoom-in focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none focus-visible:ring-inset"
            />
            {/* Estado del vehículo sobre la foto, abajo a la izquierda. */}
            <div className="pointer-events-none absolute bottom-4 left-4">
              <StatusBadge status={v.status} />
            </div>
            {/* Icono que indica que la foto se puede ampliar. */}
            <span className="pointer-events-none absolute right-4 bottom-4 grid size-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md">
              <Maximize2 className="size-4" />
            </span>
            {/* Flechas: solo si hay más de una foto. */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Imagen anterior"
                  className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Imagen siguiente"
                  className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas: solo si hay más de una foto. La activa se ve más clara. */}
          {total > 1 && (
            <div className="flex gap-2" role="tablist" aria-label="Galería">
              {v.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Ver imagen ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`relative h-16 flex-1 overflow-hidden rounded-xl border transition-all focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none sm:h-20 ${
                    i === current
                      ? 'border-white/60 opacity-100'
                      : 'border-white/10 opacity-50 hover:opacity-80'
                  }`}
                >
                  <SmartImage src={img} alt="" sizes="160px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─────────── COLUMNA DERECHA: DATOS (con scroll propio si no caben) ─────────── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 lg:p-8 lg:pl-4">
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
          <Price
            usd={v.price}
            className="mt-5 block text-4xl font-semibold tracking-tight text-white"
          />
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
      </motion.div>

      {/* VISOR A PANTALLA COMPLETA: aparece sobre la ficha cuando `lightboxAt` tiene un número. */}
      <AnimatePresence>
        {lightboxAt !== null && (
          <Lightbox
            images={v.images}
            startIndex={lightboxAt}
            title={title}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
