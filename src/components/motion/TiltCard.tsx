/**
 * ============================================================================
 *  TiltCard — INCLINACIÓN 3D + REFLEJO DE VIDRIO PARA UNA TARJETA
 * ============================================================================
 *  Qué hace: envuelve cualquier contenido (la tarjeta de vehículo) y lo inclina
 *  en 3D siguiendo al mouse, con un reflejo de luz. No dibuja borde ni fondo:
 *  el diseño de la tarjeta lo pone el contenido. En teléfonos (touch) y con
 *  "reducir movimiento" queda quieta.
 *
 *  Cómo modificarlo: `max` = grados máximos de inclinación (por defecto 9).
 * ============================================================================
 */

'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Clases del contenedor externo (por ejemplo `h-full`). */
  className?: string;
  /** Grados máximos de inclinación. */
  max?: number;
}

/** Contenedor con inclinación 3D que sigue al mouse. */
export default function TiltCard({ children, className = '', max = 9 }: Props) {
  const reduce = useReducedMotion();
  // Posición del cursor dentro de la tarjeta (0 a 1) y su versión suavizada con resorte.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 60%)`;

  /** Solo reacciona al mouse (no al dedo) y si no se pidió reducir movimiento. */
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  /** Al salir el cursor, la tarjeta vuelve al centro. */
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY }}
        className="group/tilt relative h-full rounded-3xl will-change-transform"
      >
        {children}
        {/* Reflejo de luz: solo visible con el cursor encima. No captura clics. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}
