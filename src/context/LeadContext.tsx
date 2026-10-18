/**
 * ============================================================================
 *  src/context/LeadContext.tsx — DATOS PARA CAPTAR CLIENTES (accesorios + ciudad)
 * ============================================================================
 *  Guarda lo que la persona va eligiendo mientras navega y que después viaja
 *  en el mensaje de WhatsApp (ver src/lib/leads.ts):
 *   - Ciudad / ubicación (Barquisimeto, Caracas, Valencia…).
 *   - Accesorios 4x4 seleccionados (se eligen en AccessoriesSection pero se
 *     incluyen también en la consulta de la ficha técnica).
 *   - Vehículo que se está equipando.
 * ============================================================================
 */

'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ACCESSORIES } from '@/data/accessories';
import { CIUDADES } from '@/data/site';
import { scrollToSection } from '@/lib/scroll';
import type { Accessory } from '@/types/accessory';

interface LeadContextValue {
  /** Ciudad elegida para entrega/contacto. */
  location: string;
  setLocation: (city: string) => void;

  /** `id` de los accesorios seleccionados. */
  accessoryIds: string[];
  /** Los accesorios seleccionados ya como objetos completos (en el orden del catálogo). */
  accessories: Accessory[];
  toggleAccessory: (id: string) => void;
  clearAccessories: () => void;

  /** `id` del vehículo que se está equipando ('' = ninguno elegido todavía). */
  equipVehicleId: string;
  setEquipVehicleId: (id: string) => void;
  /** Elige el vehículo a equipar y lleva a la sección de accesorios. */
  equipVehicle: (id: string) => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  // ESTADO: ciudad. Barquisimeto es la sede principal, así que es el valor inicial.
  const [location, setLocation] = useState<string>(CIUDADES[0]);
  // ESTADO: accesorios elegidos.
  const [accessoryIds, setAccessoryIds] = useState<string[]>([]);
  // ESTADO: vehículo a equipar.
  const [equipVehicleId, setEquipVehicleId] = useState('');

  /** Agrega el accesorio a la selección, o lo quita si ya estaba. */
  const toggleAccessory = useCallback((id: string) => {
    setAccessoryIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }, []);

  const clearAccessories = useCallback(() => setAccessoryIds([]), []);

  /** Elige el vehículo y baja a #accesorios (espera a que se cierre la ficha técnica). */
  const equipVehicle = useCallback((id: string) => {
    setEquipVehicleId(id);
    scrollToSection('accesorios');
  }, []);

  /** Objetos completos de los accesorios elegidos, conservando el orden del catálogo. */
  const accessories = useMemo(
    () => ACCESSORIES.filter((a) => accessoryIds.includes(a.id)),
    [accessoryIds],
  );

  const value = useMemo(
    () => ({
      location,
      setLocation,
      accessoryIds,
      accessories,
      toggleAccessory,
      clearAccessories,
      equipVehicleId,
      setEquipVehicleId,
      equipVehicle,
    }),
    [
      location,
      accessoryIds,
      accessories,
      toggleAccessory,
      clearAccessories,
      equipVehicleId,
      equipVehicle,
    ],
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

/** Hook para usar la ciudad y los accesorios elegidos. */
export function useLead(): LeadContextValue {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLead debe usarse dentro de <LeadProvider>');
  return ctx;
}
