/**
 * ============================================================================
 *  src/lib/format.ts — FORMATEO DE NÚMEROS PARA MOSTRAR
 * ============================================================================
 *  Convierte números "crudos" (28500) en texto legible ($28.500).
 *  Se escribió a mano (en vez de usar Intl) para que el resultado sea
 *  idéntico en el servidor y en el navegador y no haya errores de hidratación.
 * ============================================================================
 */

/**
 * Agrupa los miles con punto, estilo venezolano: 28500 → "28.500".
 * La expresión regular inserta un punto cada tres dígitos contando desde la derecha.
 */
const group = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Precio completo en dólares: 28500 → "$28.500". */
export const formatPrice = (n: number): string => `$${group(n)}`;

/** Kilometraje: 142000 → "142.000 km"; una unidad nueva (0) → "0 km". */
export const formatKm = (n: number): string => (n === 0 ? '0 km' : `${group(n)} km`);

/** Precio abreviado para los deslizadores: 75000 → "$75K". */
export const formatCompact = (n: number): string =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;

/** Monto en bolívares: 25111995 → "Bs. 25.111.995". Recibe bolívares, NO dólares. */
export const formatBs = (n: number): string => `Bs. ${group(n)}`;

/** Bolívares abreviados para los deslizadores: 17621400 → "Bs. 17,6M". */
export const formatCompactBs = (n: number): string => {
  if (n >= 1_000_000) return `Bs. ${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (n >= 1_000) return `Bs. ${Math.round(n / 1000)}K`;
  return `Bs. ${Math.round(n)}`;
};

/** Tipo de cambio con coma decimal estilo venezolano: 881.07 → "881,07". */
export const formatRate = (n: number): string => n.toFixed(2).replace('.', ',');
