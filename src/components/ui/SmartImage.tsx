/**
 * ============================================================================
 *  SmartImage — IMAGEN CON ESQUELETO DE CARGA
 * ============================================================================
 *  Qué hace: muestra un fondo gris pulsante ("skeleton") mientras la foto
 *  descarga y, cuando termina, la hace aparecer suavemente. Si la foto falla,
 *  muestra un aviso en vez de un cuadro roto.
 *
 *  Uso: el contenedor padre debe tener `position: relative` (clase `relative`)
 *  y un tamaño; la imagen rellena todo su espacio.
 *    <div className="relative h-64"><SmartImage src="..." alt="..." sizes="100vw" /></div>
 * ============================================================================
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Props {
  /** Enlace directo a la imagen (https). */
  src: string;
  /** Texto alternativo: describe la foto para lectores de pantalla. */
  alt: string;
  /** Ancho aproximado que ocupa en pantalla; ayuda a Next a descargar un tamaño adecuado. */
  sizes: string;
  /** true = cargar con prioridad (úsalo solo en las fotos que se ven al abrir la página). */
  priority?: boolean;
  /** Clases extra de Tailwind para la imagen (por ejemplo, un zoom al pasar el cursor). */
  className?: string;
}

export function SmartImage({ src, alt, sizes, priority, className = '' }: Props) {
  // ESTADO: ¿ya terminó de cargar la imagen? Controla cuándo desaparece el esqueleto.
  const [loaded, setLoaded] = useState(false);
  // ESTADO: ¿falló la descarga? Si es así, mostramos un mensaje en lugar de la foto.
  const [failed, setFailed] = useState(false);

  return (
    // Contenedor: ocupa todo el espacio del padre y recorta lo que sobresalga.
    <div className="absolute inset-0 overflow-hidden bg-zinc-900">
      {/* Esqueleto pulsante: solo visible mientras carga. `animate-pulse` hace el parpadeo. */}
      {!loaded && !failed && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-linear-to-br from-zinc-800 via-zinc-900 to-zinc-800"
        />
      )}

      {failed ? (
        // Aviso de error de carga.
        <div className="absolute inset-0 grid place-items-center text-xs tracking-wider text-zinc-500 uppercase">
          Imagen no disponible
        </div>
      ) : (
        // Foto real. Empieza invisible (opacity-0) y aparece al cargar (opacity-100).
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </div>
  );
}
