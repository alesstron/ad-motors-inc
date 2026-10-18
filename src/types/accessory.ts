/**
 * ============================================================================
 *  src/types/accessory.ts — "MOLDE" DE UN ACCESORIO 4x4
 * ============================================================================
 *  Define qué datos tiene cada accesorio del catálogo de personalización
 *  (src/data/accessories.ts). Si inventas un campo nuevo, agrégalo aquí y
 *  luego complétalo en cada accesorio.
 * ============================================================================
 */

/** Las cuatro familias de accesorios (cada una es una pestaña en la sección). */
export type AccessoryCategoryId = 'suspension' | 'ruedas' | 'proteccion' | 'iluminacion';

/** Una familia de accesorios: su identificador, título visible y descripción corta. */
export interface AccessoryCategory {
  id: AccessoryCategoryId;
  /** Título de la pestaña, por ejemplo "Suspensión & Elevación". */
  title: string;
  /** Frase corta que explica para qué sirve la familia. */
  blurb: string;
}

/** Un accesorio concreto que la persona puede añadir a su presupuesto. */
export interface Accessory {
  /** Identificador único, sin espacios ni acentos. No puede repetirse. */
  id: string;
  category: AccessoryCategoryId;
  /** Marca, por ejemplo "Old Man Emu". */
  brand: string;
  /** Nombre del producto, por ejemplo "Kit de suspensión BP-51". */
  name: string;
  /** Qué hace y qué incluye (una o dos frases). */
  description: string;
  /** Precio estimado en dólares (USD), sin puntos ni símbolo: 3200. */
  priceUsd: number;
  /** Aclaración opcional, por ejemplo "Juego de 4". */
  note?: string;
  /** Foto local en public/images/accessories/ (ruta '/images/accessories/x.jpg'). Si falta, se muestra un recuadro con el icono de la familia. */
  image?: string;
  /** Texto alternativo de la foto. */
  imageAlt?: string;
}
