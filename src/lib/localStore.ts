/**
 * ============================================================================
 *  src/lib/localStore.ts — ALMACÉN SENCILLO SOBRE LOCALSTORAGE
 * ============================================================================
 *  PROBLEMA: React necesita saber cuándo cambia un dato guardado en el
 *  navegador (localStorage), y en el servidor localStorage NO existe.
 *
 *  SOLUCIÓN: este "almacén" se conecta a React con `useSyncExternalStore`
 *  (ver src/context/GarageContext.tsx). Ofrece:
 *    - read():       lee el valor actual (devuelve el mismo objeto si no cambió).
 *    - write(v):     guarda un valor nuevo y avisa a los componentes.
 *    - subscribe(f): para que React se entere de los cambios (también los
 *                    hechos desde otra pestaña del navegador).
 *    - getServer():  valor que se usa al pre-generar la página en el servidor.
 *
 *  Todo está protegido con try/catch: si el navegador bloquea localStorage
 *  (modo privado, por ejemplo), la app sigue funcionando guardando en memoria.
 * ============================================================================
 */

export function createLocalStore<T>(key: string, fallback: T) {
  /** Funciones que hay que avisar cuando el valor cambia. */
  const listeners = new Set<() => void>();
  /** Último texto leído de localStorage (sirve para saber si cambió). */
  let cachedRaw: string | null | undefined;
  /** Último valor ya interpretado (se reutiliza para devolver siempre el mismo objeto). */
  let cachedValue: T = fallback;

  /** Lee el valor guardado. Devuelve el MISMO objeto mientras el texto no cambie. */
  function read(): T {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue; // localStorage bloqueado: seguimos con lo que hay en memoria
    }
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      cachedValue = fallback; // dato corrupto: se ignora
    }
    return cachedValue;
  }

  /** Guarda un valor nuevo y avisa a todos los que estén escuchando. */
  function write(value: T) {
    cachedValue = value;
    try {
      const raw = JSON.stringify(value);
      window.localStorage.setItem(key, raw);
      cachedRaw = raw;
    } catch {
      // Sin localStorage: el valor queda solo en memoria hasta cerrar la pestaña.
    }
    listeners.forEach((l) => l());
  }

  /** React llama a esta función para suscribirse; devuelve cómo cancelar la suscripción. */
  function subscribe(callback: () => void) {
    listeners.add(callback);
    // Si otra pestaña cambia el dato, también avisamos.
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', onStorage);
    };
  }

  return { read, write, subscribe, getServer: () => fallback };
}
