/**
 * ============================================================================
 *  ServicesVIP — SERVICIOS EXCLUSIVOS "CONCIERGE VIP"
 * ============================================================================
 *  Qué hace: presenta los cuatro servicios que diferencian a AD Motors:
 *    1. Atención 24 horas / 7 días.
 *    2. Entrega de vehículos a domicilio a nivel nacional.
 *    3. Inspección multipunto.
 *    4. Financiamiento VIP (se simula en la ficha técnica de cada vehículo).
 *
 *  Cómo modificarla:
 *   - Agregar/editar/quitar un servicio → lista `SERVICES` de abajo.
 *     (`icon` viene de lucide-react: https://lucide.dev/icons)
 *   - Títulos de la sección → etiquetas <h2> y <p> dentro del componente.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, Landmark, Truck } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

/** Curva de animación suave reutilizada en la entrada de las tarjetas. */
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Los servicios. Cada uno tiene: icono, título, texto explicativo y una
 * etiqueta (`tag`) pequeña. Para añadir uno nuevo, copia un bloque `{ ... },`.
 * Nota: la cuadrícula muestra 1 columna en celular, 2 en tableta y 4 en computadora
 * (`md:grid-cols-2 lg:grid-cols-4`).
 */
const SERVICES = [
  {
    icon: Clock,
    title: 'Atención 24 Horas / 7 Días',
    text: 'Un asesor personal responde por WhatsApp a cualquier hora, todos los días del año. Sin call centers ni esperas.',
    tag: 'Concierge VIP',
  },
  {
    icon: Truck,
    title: 'Entrega a Domicilio Nivel Nacional',
    text: 'Llevamos tu vehículo hasta la puerta de tu casa u oficina, en cualquier estado de Venezuela, con la unidad detallada y lista.',
    tag: 'Todo el país',
  },
  {
    icon: ClipboardCheck,
    title: 'Inspección Multipunto',
    text: 'Motor, transmisión, frenos, suspensión, carrocería, electrónica e historial. Revisamos cada unidad antes de ofrecerla y te entregamos la ficha.',
    tag: 'Certificado AD',
  },
  {
    icon: Landmark,
    title: 'Financiamiento VIP',
    text: 'Inicial desde el 30 % y plazos de 6 a 36 meses. Simula tu cuota en dólares y bolívares en la ficha de cada vehículo y solicita tu pre-aprobación.',
    tag: 'Pre-aprobación',
  },
];

export function ServicesVIP() {
  // Función del contexto: lleva a la persona al formulario de citas (#citas).
  const { book } = useBooking();

  return (
    // Sección con id="servicios" (destino del enlace "Servicios VIP" de la barra superior).
    <section id="servicios" className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20">
      {/* Resplandor índigo difuso de fondo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 h-96 w-200 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Encabezado de la sección. */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
            Servicios exclusivos
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Concierge VIP
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Comprar un vehículo de alta gama debe ser tan impecable como el vehículo.
          </p>
        </div>

        {/* TARJETAS DE SERVICIOS: 1 columna en celular, 2 en tableta y 4 en computadora. */}
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            // Cada tarjeta aparece al hacer scroll hasta ella (`whileInView`), una sola vez.
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              {/* Icono dentro de un cuadro redondeado. */}
              <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white">
                <s.icon className="size-5" />
              </div>
              {/* Etiqueta pequeña. */}
              <span className="mt-6 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
                {s.tag}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-zinc-400">{s.text}</p>
            </motion.li>
          ))}
        </ul>

        {/* Botón que lleva al formulario de citas sin preseleccionar ningún vehículo. */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => book()}
            className="min-h-12 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            Solicitar un servicio
          </button>
        </div>
      </div>
    </section>
  );
}
