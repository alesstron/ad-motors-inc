/**
 * ============================================================================
 *  AppointmentForm — FORMULARIO DE AGENDAMIENTO DE CITAS (sin pasarela de pago)
 * ============================================================================
 *  Qué hace: la persona elige el tipo de servicio (test-drive, inspección o
 *  compra a domicilio), el vehículo, su ubicación, fecha y horario. Al enviar:
 *    1. Se validan los campos obligatorios (muestra errores en rojo si faltan).
 *    2. Se arma un mensaje de texto con todos los datos.
 *    3. Se abre WhatsApp (número de src/data/site.ts) con ese mensaje listo.
 *  NO se guarda nada en ningún servidor ni se pide dinero.
 *
 *  PRE-LLENADO: cuando la persona pulsa "Solicitar Pre-Aprobación de
 *  Financiamiento" en la ficha técnica, este formulario aparece ya con el
 *  vehículo, el tipo "compra" y el resumen del financiamiento en las notas
 *  (datos que llegan por BookingContext). El formulario se reinicia con esos
 *  datos gracias a `key={prefillVersion}`.
 *
 *  Cómo modificarlo:
 *   - Tipos de servicio → lista `TIPOS`.
 *   - Franjas horarias  → lista `HORARIOS`.
 *   - Estados           → `ESTADOS_VE` en src/data/site.ts.
 *   - Texto del mensaje → función `submit`, variable `lines`.
 * ============================================================================
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { useBooking } from '@/context/BookingContext';
import { ESTADOS_VE } from '@/data/site';
import { VEHICLES } from '@/data/vehicles';
import { whatsappLink } from '@/lib/whatsapp';

/** Tipos de cita que puede pedir la persona. `id` es interno; `label` es lo que se lee. */
const TIPOS = [
  { id: 'test-drive', label: 'Test-Drive a domicilio' },
  { id: 'inspeccion', label: 'Inspección multipunto' },
  { id: 'compra', label: 'Compra con entrega a domicilio' },
] as const;

/** Franjas horarias disponibles. */
const HORARIOS = ['Mañana (8:00 – 12:00)', 'Tarde (12:00 – 17:00)', 'Noche (17:00 – 21:00)'];

/** Todos los datos que escribe la persona en el formulario. */
interface FormState {
  nombre: string;
  telefono: string;
  tipo: (typeof TIPOS)[number]['id'];
  estado: string;
  ciudad: string;
  fecha: string;
  horario: string;
  notas: string;
}

/** Valores iniciales (formulario vacío). */
const EMPTY: FormState = {
  nombre: '',
  telefono: '',
  tipo: 'test-drive',
  estado: 'Lara',
  ciudad: '',
  fecha: '',
  horario: HORARIOS[0],
  notas: '',
};

/**
 * Funciones auxiliares para conocer la fecha de HOY solo en el navegador.
 * (En el servidor devolvemos '' para que la página se pre-genere sin errores.)
 * `subscribeNoop` no hace nada: la fecha no cambia mientras la página está abierta.
 */
const subscribeNoop = () => () => {};

/** Devuelve la fecha de hoy en formato AAAA-MM-DD (el que usa <input type="date">). */
function todayISO() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Clases de Tailwind compartidas por todos los campos de texto, listas y fecha. */
const field =
  'min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-[15px] text-white placeholder:text-zinc-600 transition-colors hover:border-white/20 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none';

/**
 * Sección completa: columna de texto (izquierda) + tarjeta con el formulario (derecha).
 * El formulario real es <AppointmentCard>; aquí solo se le pone `key={prefillVersion}`
 * para que se reinicie cuando llegan datos pre-llenados.
 */
export function AppointmentForm() {
  const { prefillVersion } = useBooking();

  return (
    // Sección con id="citas" (destino del botón "Agendar Cita" de la ficha técnica).
    <section id="citas" className="relative isolate scroll-mt-24 overflow-hidden px-4 py-20">
      {/* Resplandor verde difuso de fondo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-96 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/12 blur-[130px]" />
      </div>

      {/* Dos columnas en computadora: texto explicativo (izquierda) y formulario (derecha). */}
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* COLUMNA IZQUIERDA: título y garantías. */}
        <div className="lg:pt-4">
          <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Citas</p>
          <h2 className="text-metal mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Agenda tu cita
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Test-drive en tu puerta, inspección de una unidad o compra con entrega a domicilio. Un
            asesor confirma por WhatsApp.
          </p>
          {/* Lista de garantías con icono de escudo. */}
          <ul className="mt-8 space-y-3 text-sm text-zinc-300">
            {[
              'Sin pasarela de pago: no pagas nada al agendar',
              'Cobertura en los 24 estados',
              'Confirmación personal por WhatsApp',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA DERECHA: tarjeta de cristal con el formulario. */}
        <div className="rounded-[2rem] border border-white/10 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <AppointmentCard key={prefillVersion} />
        </div>
      </div>
    </section>
  );
}

/** La tarjeta con el formulario y la pantalla de éxito. Guarda todo el estado del formulario. */
function AppointmentCard() {
  // Vehículo elegido y datos de pre-llenado (compartidos con la ficha técnica por el contexto).
  const { vehicleId, setVehicleId, prefill } = useBooking();

  // ESTADO: todo lo que la persona ha escrito. Si llega pre-llenado, arranca con él.
  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    tipo: prefill.tipo ?? EMPTY.tipo,
    notas: prefill.notas ?? EMPTY.notas,
  });
  // ESTADO: mensajes de error por campo (vacío = sin errores).
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  // ESTADO: ¿ya se envió? Si es true, se muestra la pantalla de "Solicitud lista".
  const [sent, setSent] = useState(false);
  // Fecha de hoy ('' en el servidor). Se usa como mínimo del calendario.
  const today = useSyncExternalStore(subscribeNoop, todayISO, () => '');

  /** Actualiza UN campo del formulario y borra su error al escribir. */
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /** Vehículo completo elegido (o undefined si no eligió ninguno). */
  const vehicle = VEHICLES.find((v) => v.id === vehicleId);

  /** Se ejecuta al pulsar "Agendar cita": valida, arma el mensaje y abre WhatsApp. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); // evita que el navegador recargue la página

    // 1) VALIDACIÓN: reúne los errores encontrados.
    const next: typeof errors = {};
    if (form.nombre.trim().length < 2) next.nombre = 'Escribe tu nombre completo.';
    if (form.telefono.replace(/\D/g, '').length < 10) next.telefono = 'Ingresa un teléfono válido.';
    if (form.ciudad.trim().length < 2) next.ciudad = 'Indica la ciudad o zona.';
    if (!form.fecha) next.fecha = 'Elige una fecha.';
    else if (today && form.fecha < today) next.fecha = 'La fecha no puede ser pasada.';
    setErrors(next);
    if (Object.keys(next).length) return; // si hay errores, se detiene aquí

    // 2) MENSAJE: cada línea de `lines` es una línea del mensaje de WhatsApp.
    const tipo = TIPOS.find((t) => t.id === form.tipo)!.label;
    const [y, m, d] = form.fecha.split('-'); // de AAAA-MM-DD a DD/MM/AAAA
    const lines = [
      `Hola AD Motors, quiero agendar una cita.`,
      ``,
      `Servicio: ${tipo}`,
      vehicle
        ? `Vehículo: ${vehicle.brand} ${vehicle.model} ${vehicle.trim} ${vehicle.year}`
        : `Vehículo: por definir con el asesor`,
      `Ubicación: ${form.ciudad.trim()}, ${form.estado}`,
      `Fecha: ${d}/${m}/${y} · ${form.horario}`,
      `Nombre: ${form.nombre.trim()}`,
      `Teléfono: ${form.telefono.trim()}`,
      form.notas.trim() ? `Notas: ${form.notas.trim()}` : '',
    ].filter((l, i, arr) => l !== '' || arr[i - 1] !== ''); // quita líneas vacías sobrantes

    // 3) ENVÍO: abre WhatsApp en una pestaña nueva y muestra la pantalla de éxito.
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  /** Vuelve a dejar el formulario en blanco ("Nueva cita"). */
  const reset = () => {
    setForm(EMPTY);
    setVehicleId('');
    setSent(false);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        // ─── PANTALLA DE ÉXITO (después de enviar) ───
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          className="flex flex-col items-center px-4 py-12 text-center"
        >
          <CheckCircle2 className="size-12 text-emerald-400" />
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">Solicitud lista</h3>
          <p className="mt-3 max-w-sm text-zinc-400">
            Abrimos WhatsApp con los datos de tu cita. Envía el mensaje y un asesor te confirmará.
            Si no se abrió, pulsa el botón.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink('Hola AD Motors, quiero confirmar mi cita.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none sm:w-auto"
            >
              <MessageCircle className="size-4" /> Abrir WhatsApp
            </a>
            <button
              type="button"
              onClick={reset}
              className="min-h-12 rounded-full border border-white/15 px-6 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
            >
              Nueva cita
            </button>
          </div>
        </motion.div>
      ) : (
        // ─── FORMULARIO ───
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={submit}
          noValidate // usamos nuestra propia validación, con mensajes en español
          className="grid gap-5"
        >
          {/* Aviso cuando el formulario viene pre-llenado desde la calculadora de financiamiento. */}
          {prefill.notas && (
            <p className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-xs leading-relaxed text-emerald-100">
              Pre-llenamos tu solicitud con el financiamiento que simulaste. Completa tus datos y
              envíala.
            </p>
          )}

          {/* Tipo de servicio: tres botones de opción (radio) con estilo de píldora. */}
          <fieldset>
            <legend className="mb-3 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
              Tipo de servicio
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {TIPOS.map((t) => (
                <label
                  key={t.id}
                  className={`flex min-h-14 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-sm font-medium transition-all focus-within:ring-2 focus-within:ring-indigo-400/70 ${
                    form.tipo === t.id
                      ? 'border-white bg-white text-zinc-900' // seleccionado
                      : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25'
                  }`}
                >
                  {/* El radio real está oculto (`sr-only`) pero sigue siendo accesible por teclado. */}
                  <input
                    type="radio"
                    name="tipo"
                    value={t.id}
                    checked={form.tipo === t.id}
                    onChange={() => set('tipo', t.id)}
                    className="sr-only"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Vehículo de interés (opcional). Se rellena solo si vienes de una ficha técnica. */}
          <Field label="Vehículo de interés" htmlFor="vehiculo">
            <select
              id="vehiculo"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className={field}
            >
              <option value="" className="bg-neutral-900">
                Aún no lo sé — asesórenme
              </option>
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id} className="bg-neutral-900">
                  {v.brand} {v.model} {v.trim} · {v.year}
                </option>
              ))}
            </select>
          </Field>

          {/* Datos personales y de ubicación: 2 columnas desde pantallas pequeñas. */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre y apellido" htmlFor="nombre" error={errors.nombre}>
              <input
                id="nombre"
                autoComplete="name"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                aria-invalid={!!errors.nombre}
                className={field}
                placeholder="María Pérez"
              />
            </Field>
            <Field label="Teléfono / WhatsApp" htmlFor="telefono" error={errors.telefono}>
              <input
                id="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)}
                aria-invalid={!!errors.telefono}
                className={field}
                placeholder="0412-0000000"
              />
            </Field>
            <Field label="Estado" htmlFor="estado">
              <select
                id="estado"
                value={form.estado}
                onChange={(e) => set('estado', e.target.value)}
                className={field}
              >
                {ESTADOS_VE.map((s) => (
                  <option key={s} value={s} className="bg-neutral-900">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ciudad / Zona" htmlFor="ciudad" error={errors.ciudad}>
              <input
                id="ciudad"
                value={form.ciudad}
                onChange={(e) => set('ciudad', e.target.value)}
                aria-invalid={!!errors.ciudad}
                className={field}
                placeholder="Barquisimeto, Av. Lara"
              />
            </Field>
            {/* Fecha: `min={today}` impide elegir días pasados; `scheme-dark` oscurece el calendario. */}
            <Field label="Fecha" htmlFor="fecha" error={errors.fecha}>
              <input
                id="fecha"
                type="date"
                min={today}
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                aria-invalid={!!errors.fecha}
                className={`${field} scheme-dark`}
              />
            </Field>
            <Field label="Horario" htmlFor="horario">
              <select
                id="horario"
                value={form.horario}
                onChange={(e) => set('horario', e.target.value)}
                className={field}
              >
                {HORARIOS.map((h) => (
                  <option key={h} value={h} className="bg-neutral-900">
                    {h}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Notas opcionales (aquí llega el resumen del financiamiento si vienes de la calculadora). */}
          <Field label="Notas (opcional)" htmlFor="notas">
            <textarea
              id="notas"
              rows={prefill.notas ? 5 : 3}
              value={form.notas}
              onChange={(e) => set('notas', e.target.value)}
              className={`${field} resize-none py-3`}
              placeholder="Punto de referencia, preferencias, preguntas…"
            />
          </Field>

          {/* Botón de envío. */}
          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 font-medium text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:outline-none"
          >
            <CalendarCheck className="size-5" />
            Agendar cita por WhatsApp
          </button>
          <p className="text-center text-xs text-zinc-500">
            Al enviar se abre WhatsApp con tus datos. No guardamos nada en este sitio.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/**
 * Field — envuelve un campo con su etiqueta arriba y su mensaje de error abajo.
 * Así todos los campos del formulario se ven y se comportan igual.
 */
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  /** Texto de la etiqueta. */
  label: string;
  /** `id` del campo al que pertenece la etiqueta. */
  htmlFor: string;
  /** Mensaje de error (si lo hay). */
  error?: string;
  /** El campo en sí (input, select o textarea). */
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[11px] font-medium tracking-wider text-zinc-500 uppercase"
      >
        {label}
      </label>
      {children}
      {/* El error en rojo; `role="alert"` hace que los lectores de pantalla lo anuncien. */}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
