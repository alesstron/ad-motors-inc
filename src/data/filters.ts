/**
 * ============================================================================
 *  src/data/filters.ts — OPCIONES DE LOS FILTROS DEL CATÁLOGO
 * ============================================================================
 *  Controla qué opciones aparecen en los botones y deslizadores de filtrado.
 *  Si agregas un vehículo de una marca nueva, añade la marca aquí (y en
 *  src/types/vehicle.ts) para que aparezca su botón de filtro.
 * ============================================================================
 */

import type { Brand, Category, Status } from '@/types/vehicle';

/** Marcas que aparecen como botones de filtro (en este orden). */
export const BRANDS: Brand[] = ['Toyota', 'Chevrolet', 'Mercedes-Benz'];

/** Categorías que aparecen como botones de filtro (en este orden). */
export const CATEGORIES: Category[] = ['SUV 4x4', 'Pick-Up', 'Deportivo'];

/** Estados comerciales posibles (solo de referencia; hoy no hay filtro por estado). */
export const STATUSES: Status[] = ['Certificado AD', 'Entrega Inmediata', 'Disponible'];

/** Año mínimo y máximo del deslizador de años. */
export const YEAR_MIN = 2012;
export const YEAR_MAX = 2026;

/** Precio mínimo y máximo (USD) del deslizador de precio, y cuánto salta cada paso. */
export const PRICE_MIN = 0;
export const PRICE_MAX = 250_000;
export const PRICE_STEP = 5_000;
