/**
 * ============================================================================
 *  src/lib/whatsapp.ts — CREADOR DE ENLACES DE WHATSAPP
 * ============================================================================
 *  Todos los botones de WhatsApp de la página usan esta función, así el
 *  número (que vive en src/data/site.ts) se cambia en un solo lugar.
 * ============================================================================
 */

import { WHATSAPP_NUMBER } from '@/data/site';

/**
 * Devuelve un enlace https://wa.me/... que abre WhatsApp con el mensaje ya escrito.
 *
 * Ejemplo:
 *   whatsappLink('Hola')  →  https://wa.me/584245535901?text=Hola
 *
 * `encodeURIComponent` convierte espacios, tildes y saltos de línea en un
 * formato seguro para una dirección web.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
