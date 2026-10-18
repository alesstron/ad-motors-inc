/**
 * ============================================================================
 *  RangeSlider — DESLIZADOR DE RANGO DOBLE (mínimo y máximo)
 * ============================================================================
 *  Qué hace: dibuja una barra con dos perillas para elegir un rango, por
 *  ejemplo "años 2015 – 2023" o "precio $20K – $80K". Se usa para los filtros
 *  de Año y Precio en VehicleGrid.
 *
 *  Truco: son DOS <input type="range"> encimados. El estilo de las perillas
 *  está en la clase `.range` de src/app/globals.css.
 * ============================================================================
 */

'use client';

interface Props {
  /** Título del control (también se usa en las etiquetas de accesibilidad). */
  label: string;
  /** Valor más bajo permitido. */
  min: number;
  /** Valor más alto permitido. */
  max: number;
  /** Cuánto salta cada movimiento (1 para años, 5000 para precio, etc.). */
  step: number;
  /** Rango actual: [mínimo elegido, máximo elegido]. */
  value: [number, number];
  /** Se llama cada vez que la persona mueve una perilla. */
  onChange: (v: [number, number]) => void;
  /** Cómo escribir cada valor en pantalla (por ejemplo, `formatCompact` → "$75K"). */
  format: (n: number) => string;
  /** Texto añadido al máximo cuando está en el tope (por ejemplo "+": "$200K+"). */
  maxSuffix?: string;
}

export function RangeSlider({ label, min, max, step, value, onChange, format, maxSuffix }: Props) {
  /** Convierte un valor en porcentaje (0–100) de la barra, para pintar la parte activa. */
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const [lo, hi] = value;

  return (
    <div className="w-full">
      {/* Fila superior: título a la izquierda y valores elegidos a la derecha. */}
      <div className="mb-3 flex items-baseline justify-between text-sm">
        <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
          {label}
        </span>
        <span className="font-medium text-zinc-200 tabular-nums">
          {format(lo)} – {format(hi)}
          {hi === max && maxSuffix}
        </span>
      </div>

      {/* Barra: pista gris, tramo activo en blanco y las dos perillas encima. */}
      <div className="relative h-5">
        {/* Pista gris de fondo. */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/10" />
        {/* Tramo activo (entre las dos perillas), calculado con porcentajes. */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />
        {/* Perilla del MÍNIMO. Nunca puede pasar de (máximo − un paso). */}
        <input
          type="range"
          className="range"
          aria-label={`${label} mínimo`}
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        />
        {/* Perilla del MÁXIMO. Nunca puede bajar de (mínimo + un paso). */}
        <input
          type="range"
          className="range"
          aria-label={`${label} máximo`}
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        />
      </div>
    </div>
  );
}
