/**
 * ============================================================================
 *  MotionProvider — AJUSTE GLOBAL DE ANIMACIONES
 * ============================================================================
 *  Qué hace: envuelve toda la app (se usa una sola vez, en src/app/layout.tsx).
 *  Con `reducedMotion="user"`, Framer Motion apaga los movimientos (transform y
 *  layout) cuando la persona tiene activado "reducir movimiento" en su
 *  teléfono o computadora. Los fundidos (opacity) se mantienen.
 * ============================================================================
 */

'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** Proveedor global de configuración de movimiento. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
