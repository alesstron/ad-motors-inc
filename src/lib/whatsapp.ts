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
 * Devuelve un enlace https://api.whatsapp.com/send?... que abre WhatsApp con el mensaje ya escrito.
 * Es el formato universal: en celulares con WhatsApp y WhatsApp Business instalados, el sistema
 * deja elegir cuál usar (a diferencia de wa.me, que puede abrir siempre el mismo).
 *
 * Ejemplo:
 *   whatsappLink('Hola')  →  https://api.whatsapp.com/send?phone=584245535901&text=Hola
 *
 * `encodeURIComponent` convierte espacios, tildes y saltos de línea en un
 * formato seguro para una dirección web.
 */
export function whatsappLink(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}
