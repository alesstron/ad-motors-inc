/**
 * ============================================================================
 *  HeroIgnition — PORTADA ANIMADA ("encendido de faros")
 * ============================================================================
 *  Qué hace: el único momento "orquestado" de la página. Un haz de faros cruza
 *  la pantalla, el auto entra desde la oscuridad y el título sube palabra a
 *  palabra. Con "reducir movimiento" activado, solo hay un fundido.
 *
 *  Cómo modificarlo:
 *   - Texto, imagen y botones → se pasan como props desde src/components/Hero.tsx
 *     (la imagen se cambia en `HERO_IMAGE`, src/data/site.ts).
 *   - Tiempos (cuándo arranca el texto) → variable `base` más abajo.
 * ============================================================================
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { ease } from './tokens';

interface Props {
  /** Título principal (h1). Sube palabra por palabra. */
  title: string;
  /** Texto bajo el título (opcional). */
  subtitle?: string;
  /** Foto de fondo (ruta local o dominio permitido en next.config.ts). */
  imageSrc: string;
  /** Descripción de la foto para lectores de pantalla. */
  imageAlt: string;
  /** Parte de la foto que se mantiene visible al recortarla (CSS `object-position`). */
  imagePosition?: string;
  /** Botones (WhatsApp, ver inventario…). */
  children?: ReactNode;
}

/** Portada a pantalla casi completa con entrada orquestada. */
export default function HeroIgnition({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imagePosition = '50% 50%',
  children,
}: Props) {
  const reduce = useReducedMotion();
  const words = title.split(' ');
  // Segundo en que arranca el texto (después del haz de faros y de que entra el auto).
  const base = reduce ? 0 : 1.0;

  return (
    <div className="relative isolate flex min-h-[88svh] w-full max-w-full items-end overflow-hidden bg-black">
      {/* Haz de faros: una línea de luz que cruza de izquierda a derecha. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[45%] z-10 h-0.5 origin-left bg-linear-to-r from-transparent via-white to-transparent shadow-[0_0_40px_8px_rgba(255,255,255,0.35)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, ease: ease.inOut, times: [0, 0.6, 1] }}
        />
      )}

      {/* El auto entra desde la oscuridad (desenfoque y brillo suben a normal). */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.08, x: '4%', filter: 'blur(12px) brightness(0.4)' }
        }
        animate={{ opacity: 1, scale: 1, x: '0%', filter: 'blur(0px) brightness(1)' }}
        transition={{ duration: 1.4, delay: reduce ? 0 : 0.5, ease: ease.out }}
      >
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
        {/* Degradado oscuro inferior para que el texto se lea. */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </motion.div>

      {/* Texto: título palabra a palabra, luego subtítulo y botones. */}
      <div className="relative w-full px-5 pt-32 pb-12 sm:px-10 sm:pb-16 lg:px-16">
        <h1 className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, delay: base + i * 0.06, ease: ease.out }}
                >
                  {w}
                </motion.span>
              </span>{' '}
            </span>
          ))}
        </h1>

        {(subtitle || children) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: base + words.length * 0.06 + 0.2, ease: ease.out }}
          >
            {subtitle && (
              <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">{subtitle}</p>
            )}
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
