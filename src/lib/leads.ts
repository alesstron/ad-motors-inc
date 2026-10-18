/**
 * ============================================================================
 *  src/lib/leads.ts — MENSAJES DE WHATSAPP PARA CAPTAR CLIENTES (Lead Gen)
 * ============================================================================
 *  Arma el texto que llega al WhatsApp de AD Motors (04245535901) cuando la
 *  persona pulsa un botón de consulta. Cada mensaje incluye lo que eligió:
 *  modelo, año, precio, ubicación y accesorios. Para cambiar la redacción,
 *  edita las líneas de cada función; para cambiar el número, ver
 *  src/data/site.ts.
 * ============================================================================
 */

import type { Accessory } from '@/types/accessory';
import type { Vehicle } from '@/types/vehicle';
import { formatBs, formatPrice } from './format';
import { whatsappLink } from './whatsapp';

/** Nombre completo del vehículo: "Toyota 4Runner Limited 4WD 2008". */
export const vehicleName = (v: Vehicle): string => `${v.brand} ${v.model} ${v.trim} ${v.year}`;

/** Convierte una lista de líneas en texto, descartando las vacías consecutivas. */
const join = (lines: string[]): string =>
  lines.filter((l, i, arr) => l !== '' || arr[i - 1] !== '').join('\n');

/** Líneas con la lista de accesorios y su subtotal (vacío si no hay accesorios). */
function accessoryLines(accessories: Accessory[]): string[] {
  if (accessories.length === 0) return [];
  const subtotal = accessories.reduce((sum, a) => sum + a.priceUsd, 0);
  return [
    '',
    'Accesorios 4x4 que me interesan:',
    ...accessories.map((a) => `• ${a.brand} ${a.name} (${formatPrice(a.priceUsd)})`),
    `Subtotal accesorios (estimado): ${formatPrice(subtotal)}`,
  ];
}

/** Datos de un vehículo + ubicación + accesorios para armar una consulta. */
interface LeadInput {
  vehicle: Vehicle;
  /** Ciudad de la persona (por ejemplo "Caracas"). */
  location: string;
  /** Accesorios elegidos (puede estar vacío). */
  accessories: Accessory[];
  /** Tipo de cambio, para mostrar el precio también en bolívares. */
  rate: number;
}

/** Consulta sobre UN vehículo (botón de la ficha técnica). */
export function vehicleLeadUrl({ vehicle, location, accessories, rate }: LeadInput): string {
  const total = vehicle.price + accessories.reduce((s, a) => s + a.priceUsd, 0);
  return whatsappLink(
    join([
      'Hola AD Motors, me interesa este vehículo:',
      '',
      `Modelo: ${vehicleName(vehicle)}`,
      `Año: ${vehicle.year}`,
      `Precio: ${formatPrice(vehicle.price)} (${formatBs(vehicle.price * rate)})`,
      `Ubicación: ${location}`,
      ...accessoryLines(accessories),
      ...(accessories.length ? [`Presupuesto estimado total: ${formatPrice(total)}`] : []),
      '',
      '¿Está disponible? Quedo atento.',
    ]),
  );
}

/** Pedido "Equipar este vehículo" (sección de accesorios). */
export function equipLeadUrl({ vehicle, location, accessories, rate }: LeadInput): string {
  const subtotal = accessories.reduce((s, a) => s + a.priceUsd, 0);
  const total = vehicle.price + subtotal;
  return whatsappLink(
    join([
      'Hola AD Motors, quiero equipar este vehículo:',
      '',
      `Modelo: ${vehicleName(vehicle)}`,
      `Precio del vehículo: ${formatPrice(vehicle.price)}`,
      `Ubicación: ${location}`,
      ...accessoryLines(accessories),
      '',
      `Presupuesto estimado total: ${formatPrice(total)} (${formatBs(total * rate)})`,
      '',
      'Quedo atento a la cotización final.',
    ]),
  );
}

/** Consulta por varios vehículos guardados en el Garaje (favoritos). */
export function garageLeadUrl(vehicles: Vehicle[], location: string, rate: number): string {
  return whatsappLink(
    join([
      'Hola AD Motors, estos son los vehículos de mi Garaje:',
      '',
      ...vehicles.map(
        (v) => `• ${vehicleName(v)} — ${formatPrice(v.price)} (${formatBs(v.price * rate)})`,
      ),
      '',
      `Ubicación: ${location}`,
      '',
      'Me gustaría recibir más información.',
    ]),
  );
}
