/**
 * ============================================================================
 *  src/lib/scroll.ts — DESPLAZAMIENTO SUAVE A UNA SECCIÓN
 * ============================================================================
 *  Cuando un botón de una ventana emergente (por ejemplo "Agendar Cita" en la
 *  ficha técnica) debe llevar a otra sección de la página, hay un detalle:
 *  mientras la ventana está abierta, el scroll de la página está BLOQUEADO
 *  (`overflow: hidden` en <body>, ver src/hooks/useDialog.ts), y la ventana
 *  tarda unos instantes en cerrarse.
 *
 *  Esta función espera a que el bloqueo se libere (máximo 2 segundos) y recién
 *  entonces hace el desplazamiento. Es más fiable que esperar un tiempo fijo,
 *  que fallaba en equipos lentos.
 * ============================================================================
 */

/** Tiempo máximo de espera (ms) antes de desplazar aunque el scroll siga bloqueado. */
const MAX_WAIT_MS = 2000;

/**
 * Lleva suavemente la página hasta el elemento con ese `id` (sin "#").
 * Ejemplo: scrollToSection('citas')
 */
export function scrollToSection(id: string): void {
  const start = performance.now();

  /** Se repite en cada cuadro de animación hasta que el scroll esté libre. */
  const tick = () => {
    const locked = document.body.style.overflow === 'hidden';
    if (locked && performance.now() - start < MAX_WAIT_MS) {
      requestAnimationFrame(tick);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  requestAnimationFrame(tick);
}
