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
