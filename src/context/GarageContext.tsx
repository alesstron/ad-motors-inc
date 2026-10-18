/**
 * ============================================================================
 *  src/context/GarageContext.tsx — GARAJE (FAVORITOS), COMPARADOR Y FICHA ACTIVA
 * ============================================================================
 *  Reúne el estado "de exploración" del catálogo que comparten varios
 *  componentes:
 *   - GARAJE: lista de vehículos favoritos. Se guarda en localStorage (clave
 *     "adm.garage"), así que sobrevive al cerrar el navegador.
 *   - COMPARADOR: hasta 2 vehículos para ver lado a lado (solo en memoria).
 *   - FICHA ACTIVA: qué vehículo tiene abierta su ficha técnica. Vive aquí
 *     (y no dentro de VehicleGrid) para poder abrirla también desde el
 *     panel del Garaje.
 *   - Paneles: si el cajón del Garaje y el modal del comparador están abiertos.
 * ============================================================================
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { createLocalStore } from '@/lib/localStore';

/** Lista vacía constante (misma referencia siempre, requisito de useSyncExternalStore). */
const EMPTY: string[] = [];

/** Almacén de favoritos conectado a localStorage (ver src/lib/localStore.ts). */
const garageStore = createLocalStore<string[]>('adm.garage', EMPTY);

interface GarageContextValue {
  /** `id` de los vehículos guardados en el Garaje. */
  favorites: string[];
  isFavorite: (id: string) => boolean;
  /** Agrega el vehículo al Garaje, o lo quita si ya estaba. */
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;

  /** `id` de los vehículos elegidos para comparar (máximo 2). */
  compareIds: string[];
  isComparing: (id: string) => boolean;
  /** Agrega/quita de la comparación. Si ya hay 2, el más antiguo sale. */
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  /** `id` del vehículo con ficha técnica abierta ('' = ninguna). */
  activeId: string;
  openVehicle: (id: string) => void;
  closeVehicle: () => void;

  garageOpen: boolean;
  setGarageOpen: (open: boolean) => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
}

const GarageContext = createContext<GarageContextValue | null>(null);

/**
 * Proveedor del garaje, el comparador y la ficha activa. Solo los favoritos se
 * persisten (localStorage, vía `garageStore`); el resto se pierde al recargar.
 */
export function GarageProvider({ children }: { children: React.ReactNode }) {
  // FAVORITOS: se leen de localStorage. En el servidor el valor es la lista vacía.
  const favorites = useSyncExternalStore(
    garageStore.subscribe,
    garageStore.read,
    garageStore.getServer,
  );

  // ESTADOS simples (solo en memoria).
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState('');
  const [garageOpen, setGarageOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    const current = garageStore.read();
    garageStore.write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);

  const clearFavorites = useCallback(() => garageStore.write(EMPTY), []);

  const isComparing = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id); // ya estaba: se quita
      return cur.length < 2 ? [...cur, id] : [cur[1], id]; // si ya hay 2, sale el más antiguo
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);
  const openVehicle = useCallback((id: string) => setActiveId(id), []);
  const closeVehicle = useCallback(() => setActiveId(''), []);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      compareIds,
      isComparing,
      toggleCompare,
      clearCompare,
      activeId,
      openVehicle,
      closeVehicle,
      garageOpen,
      setGarageOpen,
      compareOpen,
      setCompareOpen,
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      compareIds,
      isComparing,
      toggleCompare,
      clearCompare,
      activeId,
      openVehicle,
      closeVehicle,
      garageOpen,
      compareOpen,
    ],
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}

/** Hook para usar el garaje, el comparador y la ficha activa. */
export function useGarage(): GarageContextValue {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error('useGarage debe usarse dentro de <GarageProvider>');
  return ctx;
}
