/**
 * ============================================================================
 *  StatusBadge — ETIQUETA DE ESTADO DEL VEHÍCULO
 * ============================================================================
 *  Qué hace: dibuja la "píldora" de color con el estado comercial del auto
 *  ("Certificado AD", "Entrega Inmediata" o "Disponible"). Para cambiar el
 *  color o el icono de un estado, edita la tabla `STYLES` de abajo.
 * ============================================================================
 */

import { BadgeCheck, CircleDot, Zap } from 'lucide-react';
import type { Status } from '@/types/vehicle';

/**
 * Estilo e icono por cada estado.
 * `cls` son clases de Tailwind: borde + fondo translúcido + color del texto.
 */
const STYLES: Record<Status, { cls: string; icon: React.ReactNode }> = {
  'Certificado AD': {
    cls: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100', // verde
    icon: <BadgeCheck className="size-3" />,
  },
  'Entrega Inmediata': {
    cls: 'border-sky-300/30 bg-sky-400/15 text-sky-100', // celeste
    icon: <Zap className="size-3" />,
  },
  Disponible: {
    cls: 'border-white/20 bg-black/30 text-white', // neutro
    icon: <CircleDot className="size-3" />,
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    // Píldora: texto en mayúsculas pequeñas con separación de letras (`tracking-wider`).
    <span
      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wider uppercase backdrop-blur-md ${s.cls}`}
    >
      {s.icon}
      {status}
    </span>
  );
}
