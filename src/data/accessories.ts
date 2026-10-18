/**
 * ============================================================================
 *  src/data/accessories.ts — CATÁLOGO DE ACCESORIOS & EQUIPAMIENTO 4x4 VIP
 * ============================================================================
 *  Este archivo alimenta la sección "Accesorios 4x4" (src/components/
 *  AccessoriesSection.tsx). Aquí se definen las familias (pestañas) y cada
 *  accesorio con su precio. No hay que tocar ningún componente para cambiarlo.
 *
 *  ┌─────────────────────────────────────────────────────────────────────────┐
 *  │ CÓMO AGREGAR UN ACCESORIO                                               │
 *  │  1. Copia un bloque `{ ... },` de la lista ACCESSORIES.                 │
 *  │  2. Pégalo al final de la lista y cambia todos sus campos.              │
 *  │  3. `id` único (sin espacios); `category` debe ser una de las 4         │
 *  │     familias: 'suspension' | 'ruedas' | 'proteccion' | 'iluminacion'.   │
 *  │ CÓMO EDITAR UN PRECIO: cambia `priceUsd` (dólares, sin puntos).         │
 *  │ CÓMO ELIMINAR UNO: borra su bloque completo.                            │
 *  └─────────────────────────────────────────────────────────────────────────┘
 *
 *  FOTOS: son imágenes REFERENCIALES de Unsplash (licencia libre) guardadas en
 *  public/images/accessories/. No son fotos de producto de cada marca; varias se
 *  comparten entre accesorios parecidos. Para usar la foto real de un producto,
 *  reemplaza el archivo con el mismo nombre.
 *
 *  SOBRE LA HONESTIDAD DE LOS PRECIOS
 *  Todos los precios son ESTIMACIONES de ejemplo (referencia de mercado
 *  internacional + flete e instalación aproximados). No provienen de una
 *  cotización de AD Motors ni de un proveedor venezolano. Confírmalos antes
 *  de publicar. La compatibilidad real depende del modelo y año del vehículo;
 *  la web lo aclara y el asesor la confirma por WhatsApp.
 * ============================================================================
 */

import type { Accessory, AccessoryCategory } from '@/types/accessory';

/** Familias de accesorios, en el orden en que aparecen las pestañas. */
export const ACCESSORY_CATEGORIES: AccessoryCategory[] = [
  {
    id: 'suspension',
    title: 'Suspensión & Elevación',
    blurb: 'Más altura libre, mejor recorrido y control en trocha y carretera.',
  },
  {
    id: 'ruedas',
    title: 'Cauchos & Rines',
    blurb: 'Tracción y presencia: cauchos todoterreno y rines de competición.',
  },
  {
    id: 'proteccion',
    title: 'Parachoques & Protección',
    blurb: 'Defensas metálicas, snorkel y protección frontal y trasera.',
  },
  {
    id: 'iluminacion',
    title: 'Iluminación & Winches',
    blurb: 'Ver de noche y salir de cualquier atasco.',
  },
];

/** TODOS los accesorios. El orden de la lista es el orden en que se muestran dentro de su familia. */
export const ACCESSORIES: Accessory[] = [
  // ── SUSPENSIÓN & ELEVACIÓN ───────────────────────────────────────────────
  {
    id: 'ome-bp51',
    category: 'suspension',
    brand: 'Old Man Emu',
    name: 'Kit de suspensión BP-51 (amortiguador con reservorio)',
    description:
      'Amortiguadores bypass de alto rendimiento con resortes ajustados. Recorrido largo y control a alta velocidad en terreno abierto.',
    priceUsd: 3200,
    note: 'Kit completo',
    image: '/images/accessories/ome-bp51.jpg',
    imageAlt: 'Amortiguador con resorte helicoidal en primer plano',
  },
  {
    id: 'fox-factory',
    category: 'suspension',
    brand: 'Fox Factory',
    name: 'Kit de elevación Race Series 2.0',
    description:
      'Amortiguadores monotubo con depósito, de respuesta rápida y gran disipación de calor. Elevación nivelada con manejo firme.',
    priceUsd: 2400,
    note: 'Kit completo',
    image: '/images/accessories/fox-race-series-2.jpg',
    imageAlt: 'Todoterreno 4x4 escalando roca con suspensión de gran recorrido',
  },
  {
    id: 'dobinsons',
    category: 'suspension',
    brand: 'Dobinsons',
    name: 'Espirales y ballestas Heavy Duty',
    description:
      'Resortes y amortiguadores de gran recorrido con excelente relación calidad-precio. Ideal para uso mixto de ciudad y campo.',
    priceUsd: 1350,
    note: 'Kit completo',
    image: '/images/accessories/dobinsons-heavy-duty.jpg',
    imageAlt: 'Resorte helicoidal de suspensión en primer plano',
  },

  // ── CAUCHOS & RINES ──────────────────────────────────────────────────────
  {
    id: 'mt-baja-boss-35',
    category: 'ruedas',
    brand: 'Mickey Thompson',
    name: 'Baja Boss A/T 35"',
    description:
      'Cauchos todoterreno de banda agresiva y flancos reforzados, con tracción superior en barro, piedra y arena.',
    priceUsd: 2100,
    note: 'Juego de 4',
    image: '/images/accessories/mt-baja-boss-35.jpg',
    imageAlt: 'Camioneta 4x4 con caucho todoterreno cubierto de barro',
  },
  {
    id: 'method-race',
    category: 'ruedas',
    brand: 'Method Race Wheels',
    name: '305 NV Matte Black',
    description:
      'Rines forjados de aleación, resistentes y livianos, con diseño inspirado en el off-road de competencia.',
    priceUsd: 2200,
    note: 'Juego de 4',
    image: '/images/accessories/method-305-nv.jpg',
    imageAlt: 'Rin off-road oscuro con caucho todoterreno en camioneta 4x4',
  },
  {
    id: 'bfg-ko2',
    category: 'ruedas',
    brand: 'BFGoodrich',
    name: 'All-Terrain T/A KO2',
    description:
      'El caucho todoterreno de referencia: durabilidad, agarre en seco y mojado y resistencia a cortes en piedra.',
    priceUsd: 1900,
    note: 'Juego de 4',
    image: '/images/accessories/bfg-ko2.jpg',
    imageAlt: 'Banda de rodamiento de caucho todoterreno All-Terrain en primer plano',
  },

  // ── PARACHOQUES & PROTECCIÓN ─────────────────────────────────────────────
  {
    id: 'arb-summit',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Parachoques delantero Summit Bumper',
    description:
      'Defensa de acero con soporte para winche, luces auxiliares y puntos de recuperación. Protege el frente sin perder el ángulo de ataque.',
    priceUsd: 2300,
    image: '/images/accessories/arb-summit.jpg',
    imageAlt: 'Todoterreno 4x4 con defensa delantera metálica sobre terreno rocoso',
  },
  {
    id: 'arb-snorkel',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Snorkel Safari V-Spec',
    description:
      'Toma de aire elevada para cruzar ríos y zonas de polvo con el motor protegido. Instalación integrada a la carrocería.',
    priceUsd: 520,
    image: '/images/accessories/arb-snorkel.jpg',
    imageAlt: 'Land Cruiser blanca 4x4 subiendo una duna del desierto al atardecer',
  },
  {
    id: 'arb-skid-plate',
    category: 'proteccion',
    brand: 'ARB',
    name: 'Protector de cárter y chasis Skid Plate',
    description:
      'Platinas de acero para proteger cárter, transmisión y caja de transferencia de piedras y golpes en trocha.',
    priceUsd: 780,
    image: '/images/accessories/arb-skid-plate.jpg',
    imageAlt: 'Todoterreno 4x4 con los bajos expuestos escalando una roca',
  },

  // ── ILUMINACIÓN & WINCHES ────────────────────────────────────────────────
  {
    id: 'rigid-led',
    category: 'iluminacion',
    brand: 'Rigid Industries',
    name: 'Barra LED Adapt 50"',
    description:
      'Barra LED de alto lumen con haz combinado (flood + spot). Resistente al agua, al polvo y a las vibraciones.',
    priceUsd: 780,
    image: '/images/accessories/rigid-adapt-50.jpg',
    imageAlt: 'Silueta de un 4x4 bajo el cielo nocturno estrellado',
  },
  {
    id: 'baja-designs',
    category: 'iluminacion',
    brand: 'Baja Designs',
    name: 'Faros auxiliares LP9 Pro',
    description:
      'Par de faros auxiliares LED de iluminación precisa y larga distancia, con tecnología desarrollada en carreras off-road.',
    priceUsd: 1150,
    note: 'Par',
    image: '/images/accessories/baja-lp9-pro.jpg',
    imageAlt: 'Frente de un 4x4 rojo con dos faros auxiliares LED redondos',
  },
  {
    id: 'warn-vr-evo',
    category: 'iluminacion',
    brand: 'WARN',
    name: 'Winch VR EVO 12-S cuerda sintética',
    description:
      'Winche eléctrico de alta resistencia con cable sintético y control remoto inalámbrico. Capacidad para recuperar vehículos pesados.',
    priceUsd: 1250,
    image: '/images/accessories/warn-vr-evo-12s.jpg',
    imageAlt: 'Winch con cable en la defensa delantera de un 4x4',
  },
];
