/**
 * ============================================================================
 *  Lightbox — VISOR DE FOTOS A PANTALLA COMPLETA CON ZOOM
 * ============================================================================
 *  Qué hace: abre las fotos del vehículo en grande sobre fondo negro.
 *   - Clic en la foto (o botones +/−): alterna entre tamaño normal y zoom ×2,5.
 *   - Con zoom, al mover el ratón (o el dedo) la foto se desplaza para ver
 *     cada detalle.
 *   - Flechas ← → o botones: cambian de foto. Escape o X: cierra.
 *
 *  NOTA DE HONESTIDAD: el zoom amplía la imagen, no inventa detalle. Las fotos
 *  recortadas de capturas de pantalla miden 590 px de ancho, así que con zoom
 *  se ven más suaves que las fotos de Unsplash (1200 px).
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useDialog } from '@/hooks/useDialog';

interface Props {
  /** Fotos a mostrar (enlaces o rutas locales). */
  images: string[];
  /** Posición de la foto inicial. */
  startIndex: number;
  /** Texto alternativo base, por ejemplo el nombre del vehículo. */
  title: string;
  /** Se llama para cerrar el visor. */
  onClose: () => void;
}

/** Cuánto se amplía la foto con el zoom activo. */
const ZOOM = 2.5;

/**
 * Visor de fotos a pantalla completa. Animaciones (Framer Motion): fundido del
 * visor (`motion.div`) y fundido entre fotos (`AnimatePresence mode="wait"`,
 * reiniciado al cambiar `key={index}`). El zoom es un CSS `scale` cuyo
 * `transform-origin` sigue al cursor. No usa localStorage.
 */
export function Lightbox({ images, startIndex, title, onClose }: Props) {
  // ESTADO: foto actual.
  const [index, setIndex] = useState(startIndex);
  // ESTADO: ¿hay zoom activo?
  const [zoomed, setZoomed] = useState(false);
  // ESTADO: punto (en %) hacia el que se amplía la foto; sigue al cursor cuando hay zoom.
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = images.length;

  /** Cambia de foto y quita el zoom. `step` es +1 (siguiente) o −1 (anterior). */
  const go = useCallback(
    (step: number) => {
      setIndex((i) => (i + step + total) % total);
      setZoomed(false);
    },
    [total],
  );

  /** Teclas ← → para cambiar de foto (Escape lo maneja useDialog). */
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (total < 2) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    },
    [go, total],
  );

  // Bloqueo de scroll, Escape y foco (ver src/hooks/useDialog.ts).
  useDialog(onClose, closeRef, onKey);

  /** Actualiza el punto de zoom según la posición del cursor/dedo dentro de la foto. */
  const track = (clientX: number, clientY: number, rect: DOMRect) => {
    if (!zoomed) return;
    setOrigin({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    // Capa que cubre toda la pantalla. z-70 queda por encima de la ficha técnica (z-60).
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${title}`}
      className="fixed inset-0 z-70 bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Barra superior: contador, zoom y cerrar. */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <p className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 tabular-nums backdrop-blur-md">
          {index + 1} / {total}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? 'Reducir zoom' : 'Ampliar zoom'}
            className="grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Zona de la foto. Clic = alternar zoom; mover el cursor = desplazarse por la foto ampliada. */}
      <div
        className={`absolute inset-0 overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => setZoomed((z) => !z)}
        onMouseMove={(e) => track(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
        onTouchMove={(e) =>
          track(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.getBoundingClientRect())
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 p-4 pt-20 pb-24 sm:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Contenedor que se amplía con `scale`. `transform-origin` sigue al cursor. */}
            <div
              className="relative size-full transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${zoomed ? ZOOM : 1})`,
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            >
              <Image
                src={images[index]}
                alt={`${title}, foto ${index + 1} de ${total}`}
                fill
                sizes="100vw"
                quality={90}
                priority
                className="object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas de navegación (solo si hay más de una foto). stopPropagation evita activar el zoom. */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Foto anterior"
            className="absolute top-1/2 left-3 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Foto siguiente"
            className="absolute top-1/2 right-3 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Pista de uso, abajo al centro. */}
      <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-xs text-zinc-500">
        {zoomed ? 'Mueve el cursor para recorrer la foto' : 'Clic en la foto para ampliar'}
      </p>
    </motion.div>
  );
}
