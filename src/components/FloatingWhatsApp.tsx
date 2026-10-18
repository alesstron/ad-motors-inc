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
 * ============================================================================
 */

'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

/** Mensaje que aparece escrito al abrir WhatsApp. */
const MENSAJE = 'Hola AD Motors, me gustaría recibir información sobre sus vehículos.';

export function FloatingWhatsApp() {
  return (
    // El botón es un enlace animado: aparece con efecto "resorte" 1 s después de cargar.
    <motion.a
      href={whatsappLink(MENSAJE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }} // crece un poco al pasar el cursor
      whileTap={{ scale: 0.95 }} // se encoge al pulsarlo
      className="fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full border border-emerald-300/30 bg-emerald-500 text-white shadow-[0_8px_32px_-4px_rgba(16,185,129,0.6)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      {/* Anillo que se expande y se desvanece de forma continua (efecto de pulso). */}
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
      <MessageCircle className="relative size-6" />
    </motion.a>
  );
}
