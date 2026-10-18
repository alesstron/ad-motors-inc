/**
 * ============================================================================
 *  src/hooks/useDialog.ts — COMPORTAMIENTO COMÚN DE VENTANAS EMERGENTES
 * ============================================================================
 *  Todas las ventanas flotantes (ficha técnica, comparador, garaje, visor de
 *  fotos) necesitan lo mismo; en vez de repetirlo, este "hook" lo hace:
 *    1. Bloquea el scroll de la página mientras hay una ventana abierta.
 *    2. Cierra la ventana con la tecla Escape.
 *    3. Lleva el foco del teclado a la ventana al abrir y lo devuelve al
 *       elemento anterior al cerrar (accesibilidad).
 *
 *  Si hay VARIAS ventanas apiladas (por ejemplo el visor de fotos sobre la
 *  ficha técnica), el teclado lo atiende solo la de más arriba: todas se
 *  registran en una "pila" y cada una comprueba si es la última antes de
 *  actuar. Así Escape cierra una ventana a la vez.
 * ============================================================================
 */

'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Pila de ventanas abiertas, de la más antigua a la más reciente (la última es la de arriba).
 * Sirve para dos cosas: soltar el scroll solo al cerrar la última, y que el teclado
 * (Escape, flechas) lo atienda únicamente la ventana de más arriba.
 */
const stack: symbol[] = [];
/** Valor original de `overflow` del <body>, guardado al abrir la primera ventana. */
let savedOverflow = '';

/**
 * @param onClose   función que cierra la ventana.
 * @param focusRef  elemento que recibe el foco al abrir (normalmente el botón de cerrar).
 * @param onKey     (opcional) manejador extra para otras teclas, por ejemplo ← y →.
 *                  Debe estar memorizado (useCallback) para no reinstalar el listener.
 */
export function useDialog(
  onClose: () => void,
  focusRef?: RefObject<HTMLElement | null>,
  onKey?: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Identificador único de ESTA ventana dentro de la pila.
    const id = Symbol('dialog');

    // 1) Bloqueo de scroll (solo la primera ventana guarda el valor original).
    if (stack.length === 0) savedOverflow = document.body.style.overflow;
    stack.push(id);
    document.body.style.overflow = 'hidden';

    // 3) Foco inicial.
    focusRef?.current?.focus();

    // 2) Teclado, en fase de captura (`true`). Solo actúa la ventana de arriba de la pila.
    const handler = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (onKey) {
        onKey(e);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
      const at = stack.indexOf(id);
      if (at !== -1) stack.splice(at, 1);
      if (stack.length === 0) document.body.style.overflow = savedOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, focusRef, onKey]);
}
