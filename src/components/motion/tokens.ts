/**
 * ============================================================================
 *  src/components/motion/tokens.ts — CURVAS Y RESORTES COMPARTIDOS
 * ============================================================================
 *  Valores de movimiento que usan los componentes de esta carpeta para que
 *  toda la web se mueva igual. Para hacer todo más lento o más rápido, cambia
 *  estos números en un solo lugar.
 * ============================================================================
 */

/** Curvas de animación (cubic-bezier). */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const, // frenado suave, tipo auto de lujo
  inOut: [0.65, 0, 0.35, 1] as const,
};

/** Resortes: `soft` para expansiones grandes, `snappy` para controles pequeños. */
export const spring = {
  soft: { type: 'spring', stiffness: 160, damping: 22, mass: 0.8 } as const,
  snappy: { type: 'spring', stiffness: 380, damping: 30 } as const,
};
