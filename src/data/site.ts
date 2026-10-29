/**
 * ============================================================================
 *  src/data/site.ts — DATOS GENERALES DEL NEGOCIO
 * ============================================================================
 *  Aquí viven los datos de contacto y ubicación que se repiten por toda la
 *  página: nombre, WhatsApp, sedes y estados de Venezuela. Si cambia el
 *  teléfono o abres una sede nueva, edítalo SOLO aquí y se actualizará en
 *  el botón flotante, la barra superior, el formulario y las tarjetas de sedes.
 * ============================================================================
 */

/** Nombre comercial. Se usa en la barra superior, el pie de página y el título. */
export const BRAND_NAME = 'AD Motors INC.';

/**
 * Número de WhatsApp en formato internacional, SOLO dígitos (sin "+", espacios ni guiones).
 * Venezuela = 58. El 0 inicial del número local se quita:
 *   04245535901  →  584245535901
 */
export const WHATSAPP_NUMBER = '584245535901';

/** Cómo se muestra el número a las personas (formato local, con guion). */
export const WHATSAPP_DISPLAY = '0424-5535901';

/**
 * TIPO DE CAMBIO: bolívares (Bs.) por 1 dólar (USD).
 * Valor tomado de los anuncios de Mercado Libre Venezuela del 18/10/2026
 * (ej.: US$ 69.900 = Bs. 61.586.793  →  881,07). ES UN VALOR FIJO, NO EN VIVO:
 * actualízalo aquí cuando cambie. Lo usan el switch USD/Bs., la calculadora
 * de financiamiento y la lista de precios.
 */
export const USD_TO_BS = 881.07;

/** Fecha en que se tomó el tipo de cambio (se muestra junto al switch de divisa). */
export const USD_TO_BS_DATE = '18/10/2026';

/**
 * TASAS PARA EL PRECIO ANIMADO DE LA FICHA (PriceTicker): cuántas unidades de cada
 * moneda vale 1 USD. Bs. reutiliza `USD_TO_BS` (una sola fuente).
 * EUR: PENDIENTE de definir. Cuando tengas la tasa, agrega la línea `EUR: 0.00,`
 * (euros por 1 USD) y el botón "€" aparecerá solo; mientras no exista, no se muestra.
 */
export const PRICE_RATES: { EUR?: number; VES: number } = {
  VES: USD_TO_BS,
};

/** Mensaje que aparece escrito al abrir WhatsApp desde la portada y el botón flotante. */
export const WHATSAPP_DEFAULT_MESSAGE =
  'Hola AD Motors, me gustaría recibir información sobre sus vehículos.';

/**
 * FOTO DE LA PORTADA (HeroIgnition). Es una foto horizontal de alta resolución de Unsplash
 * (Phillip Brecht, licencia Unsplash). Para cambiarla: pon otra URL de images.unsplash.com
 * (mantén `w=1920&q=60`; con valores mayores el origen tarda mucho) o copia tu foto a
 * public/images/ y usa su ruta. `position` decide qué parte se ve cuando la foto se recorta
 * (en celular se ve solo una franja): "18% 50%" = muestra el frente y el lateral del auto.
 */
export const HERO_IMAGE = {
  src: 'https://images.unsplash.com/photo-1694575341078-623b82078d64?auto=format&fit=crop&w=1920&q=60',
  alt: 'Lamborghini Aventador negro de perfil frente a un garaje',
  position: '18% 50%',
};

/**
 * PARÁMETROS DEL FINANCIAMIENTO VIP (calculadora de la ficha técnica).
 *  - annualRate: tasa anual REFERENCIAL (0.12 = 12 %). NO es una tasa oficial de AD Motors:
 *    es un valor de ejemplo. Cámbialo por la tasa real o ponlo en 0 para cuotas sin interés.
 *  - downMin / downMax / downStep: % de inicial permitido (30 % a 70 %, de 5 en 5).
 *  - terms: plazos disponibles, en meses.
 */
export const FINANCING = {
  annualRate: 0.12,
  downMin: 30,
  downMax: 70,
  downStep: 5,
  terms: [6, 12, 18, 24, 36],
} as const;

/** Ciudades de entrega / contacto para los mensajes de WhatsApp (selector de ubicación). */
export const CIUDADES: string[] = [
  'Barquisimeto',
  'Caracas',
  'Valencia',
  'Maracay',
  'Maracaibo',
  'Barcelona',
  'Puerto La Cruz',
  'Mérida',
  'San Cristóbal',
  'Otra ciudad',
];

/** Tipo de una sede (oficina física o punto de atención). */
export interface Sede {
  /** Identificador único, sin espacios. */
  id: string;
  city: string;
  /** Estado, provincia o región. */
  region: string;
  country: string;
  /** Dirección física. Déjala fuera si aún no hay (se mostrará "Atención con cita previa"). */
  address?: string;
  /** true = sede principal (se destaca con borde y etiqueta verde). Solo una debería serlo. */
  primary?: boolean;
}

/**
 * Lista de sedes. Para agregar una, copia un bloque `{ ... },` y cambia sus datos.
 * Cambia el estilo de la lista en src/components/Locations.tsx.
 */
export const SEDES: Sede[] = [
  {
    id: 'barquisimeto',
    city: 'Barquisimeto',
    region: 'Estado Lara',
    country: 'Venezuela',
    address: 'Avenida Pedro León Torres',
    primary: true,
  },
  { id: 'cdmx', city: 'Ciudad de México', region: 'CDMX', country: 'México' },
  { id: 'madrid', city: 'Madrid', region: 'Comunidad de Madrid', country: 'España' },
];

/** Estados de Venezuela para el selector de entrega a domicilio del formulario de citas. */
export const ESTADOS_VE: string[] = [
  'Amazonas',
  'Anzoátegui',
  'Apure',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Delta Amacuro',
  'Distrito Capital',
  'Falcón',
  'Guárico',
  'La Guaira',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'Yaracuy',
  'Zulia',
];
