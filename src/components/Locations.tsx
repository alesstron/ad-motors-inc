/**
 * ============================================================================
 *  Locations — SEDES (tarjetas de ubicación)
 * ============================================================================
 *  Qué hace: muestra una tarjeta por cada sede. La principal (Barquisimeto,
 *  Avenida Pedro León Torres, Estado Lara) lleva borde más claro, resplandor
 *  índigo y la etiqueta verde "Sede principal"; las demás, "Internacional".
 *  Cada tarjeta tiene un botón de WhatsApp.
 *
 *  Cómo modificarla:
 *   - Agregar/editar sedes → lista `SEDES` en src/data/site.ts (NO aquí).
 *   - Estilo de las tarjetas → clases de Tailwind de este archivo.
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { Globe2, MapPin, MessageCircle } from 'lucide-react';
import { SEDES, WHATSAPP_DISPLAY } from '@/data/site';
import { whatsappLink } from '@/lib/whatsapp';

/** Curva de animación suave reutilizada en la entrada de las tarjetas. */
const ease = [0.22, 1, 0.36, 1] as const;

export function Locations() {
  return (
    // Sección con id="sedes" (destino del enlace "Sedes" de la barra superior).
    <section id="sedes" className="scroll-mt-24 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado de la sección. */}
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Sedes</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Presencia local, alcance internacional
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Nuestra sede principal está en Barquisimeto. Desde México y Madrid atendemos a clientes
            internacionales y a la diáspora venezolana.
          </p>
        </div>

        {/* TARJETAS: 1 columna en celular, 3 en pantallas medianas o mayores. */}
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {SEDES.map((s, i) => (
            // Cada tarjeta aparece al hacer scroll hasta ella, una sola vez.
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className={s.primary ? 'md:col-span-3 lg:col-span-1' : ''}
            >
              {/* Tarjeta de cristal. La sede principal tiene un borde un poco más visible. */}
              <article
                className={`relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-neutral-900/60 p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/25 ${
                  s.primary ? 'border-white/20' : 'border-white/10'
                }`}
              >
                {/* Resplandor decorativo en la esquina (índigo si es la sede principal). */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-16 -right-16 -z-10 size-56 rounded-full blur-[70px] ${
                    s.primary ? 'bg-indigo-500/30' : 'bg-white/5'
                  }`}
                />
                {/* Fila superior: icono a la izquierda y etiqueta de tipo a la derecha. */}
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white">
                    {/* Pin de mapa para la sede física; globo para las internacionales. */}
                    {s.primary ? <MapPin className="size-5" /> : <Globe2 className="size-5" />}
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-wider uppercase ${
                      s.primary
                        ? 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100'
                        : 'border-white/10 bg-white/5 text-zinc-400'
                    }`}
                  >
                    {s.primary ? 'Sede principal' : 'Internacional'}
                  </span>
                </div>

                {/* País, ciudad y dirección (si no hay dirección: "Atención con cita previa"). */}
                <p className="mt-8 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  {s.country}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">{s.city}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {s.address ? `${s.address}, ${s.city}, ${s.region}` : 'Atención con cita previa'}
                </p>

                {/* Botón de WhatsApp con el mensaje ya mencionando la sede. */}
                <a
                  href={whatsappLink(
                    `Hola AD Motors, quisiera información sobre la sede de ${s.city}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
                >
                  <MessageCircle className="size-4" />
                  Escribir · {WHATSAPP_DISPLAY}
                </a>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
