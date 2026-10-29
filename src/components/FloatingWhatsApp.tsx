/**
 * ============================================================================
 *  FloatingWhatsApp — BOTÓN FLOTANTE DE WHATSAPP (siempre visible)
 * ============================================================================
 *  Qué hace: un círculo verde fijo en la esquina inferior derecha que abre
 *  una conversación de WhatsApp con el número de src/data/site.ts. Tiene un
 *  "pulso" animado para llamar la atención.
 *
 *  Cómo modificarlo:
 *   - Mensaje inicial → constante `MENSAJE`.
 *   - Posición        → clases `right-4 bottom-4` (y `sm:right-6 sm:bottom-6`).
 *   - Color           → clases `bg-emerald-500` / `border-emerald-300/30`.
 *   - Se oculta solo mientras el formulario de citas (#citas) está en pantalla, para no
 *     tapar sus campos ni el botón de enviar en el celular (el formulario ya envía a WhatsApp).
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WHATSAPP_DEFAULT_MESSAGE } from '@/data/site';
import { whatsappLink } from '@/lib/whatsapp';

/** Mensaje que aparece escrito al abrir WhatsApp (se edita en src/data/site.ts). */
const MENSAJE = WHATSAPP_DEFAULT_MESSAGE;

export function FloatingWhatsApp() {
  // ESTADO: ¿está a la vista la sección del formulario de citas? Si sí, el botón se esconde.
  const [overForm, setOverForm] = useState(false);

  // EFECTO: observa la sección #citas y actualiza `overForm` cuando entra o sale de la pantalla.
  useEffect(() => {
    const section = document.getElementById('citas');
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setOverForm(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect(); // limpieza al salir
  }, []);

  return (
    // El botón es un enlace animado: aparece con efecto "resorte" 1 s después de cargar.
    <motion.a
      href={whatsappLink(MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      aria-hidden={overForm}
      tabIndex={overForm ? -1 : 0}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={overForm ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
      // El retraso de 1 s es solo para aparecer; al esconderse sobre el formulario es inmediato.
      transition={
        overForm ? { duration: 0.15 } : { delay: 1, type: 'spring', stiffness: 260, damping: 20 }
      }
      whileHover={{ scale: 1.06 }} // crece un poco al pasar el cursor
      whileTap={{ scale: 0.95 }} // se encoge al pulsarlo
      className={`fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full border border-emerald-300/30 bg-emerald-500 text-white shadow-[0_8px_32px_-4px_rgba(16,185,129,0.6)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:right-6 sm:bottom-6 ${overForm ? 'pointer-events-none' : ''}`}
    >
      {/* Anillo que se expande y se desvanece de forma continua (efecto de pulso). */}
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
      <MessageCircle className="relative size-6" />
    </motion.a>
  );
}
