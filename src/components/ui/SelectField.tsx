/**
 * ============================================================================
 *  SelectField — LISTA DESPLEGABLE CON ESTILO DE CRISTAL
 * ============================================================================
 *  Qué hace: un <select> nativo (funciona bien en móvil) con la apariencia
 *  del sitio: etiqueta pequeña arriba, icono a la izquierda y flecha a la
 *  derecha. Se usa en el buscador del Hero.
 * ============================================================================
 */

import { ChevronDown } from 'lucide-react';

interface Props {
  /** `id` único del campo; conecta la etiqueta con la lista (accesibilidad). */
  id: string;
  /** Texto pequeño que aparece arriba del valor, por ejemplo "Marca". */
  label: string;
  /** Icono que se muestra a la izquierda. */
  icon: React.ReactNode;
  /** Opción elegida actualmente. */
  value: string;
  /** Se llama con la nueva opción cuando la persona elige otra. */
  onChange: (v: string) => void;
  /** Opciones disponibles. */
  options: string[];
}

export function SelectField({ id, label, icon, value, onChange, options }: Props) {
  return (
    // Contenedor: se ilumina un poco al pasar el cursor o al enfocar.
    <div className="relative rounded-2xl transition-colors focus-within:bg-white/5 hover:bg-white/5">
      {/* Etiqueta pequeña flotante sobre el valor. */}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-2.5 left-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"
      >
        {label}
      </label>
      {/* Icono izquierdo (no interfiere con los clics). */}
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
        {icon}
      </span>
      {/* La lista real. `appearance-none` oculta la flecha del navegador para poner la nuestra. */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 w-full cursor-pointer appearance-none rounded-2xl bg-transparent pt-4 pr-10 pl-11 text-left text-[15px] text-white focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-neutral-900">
            {o}
          </option>
        ))}
      </select>
      {/* Flecha derecha. */}
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}
