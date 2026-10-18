/**
 * ============================================================================
 *  src/lib/sanitize.ts — SANEAMIENTO DE TEXTO ESCRITO POR EL USUARIO
 * ============================================================================
 *  Todo texto libre (nombre, teléfono, ciudad, notas) pasa por aquí antes de
 *  salir del formulario hacia WhatsApp. Esto elimina etiquetas HTML, caracteres
 *  de control y esquemas peligrosos (`javascript:`), y limita el largo.
 *  React ya escapa el texto al pintarlo; esto es una segunda capa (defensa en
 *  profundidad) por si ese texto se reutiliza en otro destino.
 *
 *  Cómo modificarlo: los límites por campo están en `LIMITS`.
 * ============================================================================
 */

/** Largo máximo permitido por campo (también se usan como `maxLength` en los inputs). */
export const LIMITS = {
  nombre: 80,
  telefono: 20,
  ciudad: 80,
  notas: 600,
  mensaje: 4000,
} as const;

/**
 * Limpia una cadena: quita caracteres de control (conserva saltos de línea si `multiline`),
 * etiquetas HTML, esquemas `javascript:`/`data:`/`vbscript:`, `<` `>` sueltos, y recorta al
 * largo máximo.
 */
export function sanitizeText(input: string, maxLength: number, multiline = false): string {
  const control = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return input
    .normalize('NFKC')
    .replace(control, ' ')
    .replace(/<[^>]*>?/g, '') // etiquetas HTML completas o incompletas
    .replace(/\b(?:javascript|vbscript|data)\s*:/gi, '')
    .replace(/[<>]/g, '')
    .replace(multiline ? /[ \t]{2,}/g : /\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Teléfono: solo dígitos, espacios, guiones, paréntesis y `+`. */
export function sanitizePhone(input: string): string {
  return input
    .replace(/[^\d+\-()\s]/g, '')
    .trim()
    .slice(0, LIMITS.telefono);
}
