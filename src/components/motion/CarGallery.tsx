/**
 * ============================================================================
 *  CarGallery — GALERÍA DEL VEHÍCULO CON EXPANSIÓN A PANTALLA COMPLETA
 * ============================================================================
 *  Qué hace: muestra las fotos en una cuadrícula (la primera, más grande). Al
 *  tocar una, se expande desde su lugar a pantalla completa (animación de
 *  elemento compartido). Flechas ← → o botones para navegar; Escape o "Cerrar"
 *  para salir.
 *
 *  Detalles de integración con la ficha técnica (VehicleModal):
 *   - El visor se dibuja en <body> (createPortal) con z-70, por encima de la
 *     ficha (z-60). Sin esto, el desenfoque de la ficha lo dejaría atrapado.
 *   - Teclado, bloqueo de scroll y foco los gestiona `useDialog` (la misma pila
 *     de ventanas que usa el resto del sitio), así Escape cierra solo el visor.
 *
 *  Uso:  <CarGallery photos={[{ src: '/images/vehicles/x.jpg', alt: 'Descripción' }]} />
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDialog } from '@/hooks/useDialog';
import { SmartImage } from '../ui/SmartImage';
import { spring } from './tokens';

/** Una foto de la galería. */
export interface GalleryPhoto {
  src: string;
  alt: string;
}

/** Clases compartidas por los botones circulares del visor (objetivo táctil ≥ 44 px). */
const viewerBtn =
  'min-h-11 min-w-11 rounded-full border border-white/20 px-4 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none';

/** Galería de fotos con visor expandible. */
export default function CarGallery({ photos }: { photos: GalleryPhoto[] }) {
  // Identificador único para enlazar cada miniatura con su versión ampliada.
  const uid = useId();
  // ESTADO: foto desde la que se abrió el visor (`null` = cerrado).
  const [origin, setOrigin] = useState<number | null>(null);
  // ESTADO: foto que se ve dentro del visor.
  const [current, setCurrent] = useState(0);

  /** Abre el visor en la foto `i`. */
  const openAt = (i: number) => {
    setOrigin(i);
    setCurrent(i);
  };
  /** Cierra el visor. Función ESTABLE, requisito de useDialog. */
  const close = useCallback(() => setOrigin(null), []);

  return (
    <>
      {/* Cuadrícula: 2 columnas en celular, 3 desde `sm`. La primera foto es más grande. */}
      <div className="grid w-full max-w-full grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((p, i) => (
          <motion.button
            key={p.src}
            type="button"
            layoutId={`${uid}-${i}`}
            transition={spring.soft}
            onClick={() => openAt(i)}
            aria-label={`Ampliar: ${p.alt}`}
            className="relative aspect-4/3 cursor-zoom-in overflow-hidden rounded-2xl bg-white/5 outline-none first:col-span-2 first:row-span-2 focus-visible:ring-2 focus-visible:ring-indigo-400/70"
          >
            <SmartImage
              src={p.src}
              alt={p.alt}
              sizes="(min-width: 1024px) 26vw, (min-width: 640px) 33vw, 50vw"
              priority={i === 0}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {origin !== null && (
          <Viewer
            key="viewer"
            uid={uid}
            photos={photos}
            origin={origin}
            current={current}
            setCurrent={setCurrent}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface ViewerProps {
  uid: string;
  photos: GalleryPhoto[];
  origin: number;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

/** Visor a pantalla completa (se monta solo mientras está abierto). */
function Viewer({ uid, photos, origin, current, setCurrent, onClose }: ViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = photos.length;

  /** Foto anterior o siguiente (da la vuelta al llegar al final). */
  const step = useCallback(
    (d: number) => setCurrent((i) => (i + d + total) % total),
    [setCurrent, total],
  );

  /** Teclas ← → (Escape lo maneja useDialog). */
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (total < 2) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    },
    [step, total],
  );

  // Bloqueo de scroll, Escape y foco (ver src/hooks/useDialog.ts).
  useDialog(onClose, closeRef, onKey);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={photos[current].alt}>
      {/* Fondo oscuro con desenfoque; un clic cierra. */}
      <motion.div
        className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <div className="pointer-events-none fixed inset-0 z-70 grid place-content-center justify-items-center p-4">
        {/* Foto ampliada: comparte `layoutId` con la miniatura de origen. */}
        <motion.div
          layoutId={`${uid}-${origin}`}
          transition={spring.soft}
          className="pointer-events-auto relative aspect-4/3 w-[calc(100vw-2rem)] max-w-5xl overflow-hidden rounded-3xl bg-black"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SmartImage
                src={photos[current].src}
                alt={photos[current].alt}
                sizes="100vw"
                contain
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Controles: anterior / contador / siguiente / cerrar. */}
        <motion.div
          className="pointer-events-auto mt-4 flex items-center gap-3 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          exit={{ opacity: 0 }}
        >
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Foto anterior"
                className={viewerBtn}
              >
                ‹
              </button>
              <span className="text-sm text-white/70 tabular-nums">
                {current + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Foto siguiente"
                className={viewerBtn}
              >
                ›
              </button>
            </>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
