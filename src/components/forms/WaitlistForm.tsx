import { AnimatePresence, m } from 'motion/react'
import { useId, useRef, useState, type FormEvent } from 'react'

import { waitlistForm } from '@/data/home'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'
import {
  isWaitlistConfigured,
  submitWaitlist,
  validateLead,
  type WaitlistField,
  type WaitlistLead,
  type WaitlistSource,
} from '@/lib/waitlist'

type Status = 'idle' | 'submitting' | 'success' | 'demo' | 'error'

const EMPTY: WaitlistLead = { nombre: '', apellido: '', email: '', telefono: '' }

/** Orden de aparición. Los dos primeros comparten fila en pantallas anchas. */
const FIELDS: readonly { name: WaitlistField; type: string; half: boolean }[] = [
  { name: 'nombre', type: 'text', half: true },
  { name: 'apellido', type: 'text', half: true },
  { name: 'email', type: 'email', half: false },
  { name: 'telefono', type: 'tel', half: false },
]

type WaitlistFormProps = {
  /** Se envía con el alta para saber qué punto de captación convierte mejor. */
  source: WaitlistSource
  /** El popup avisa al completarse para poder cerrarse solo. */
  onSuccess?: () => void
  className?: string
}

/**
 * Formulario de alta en la lista VIP.
 *
 * Es el objetivo de conversión de toda la web, y el mismo componente sirve a la
 * sección de cierre y al popup de entrada: así los contactos llegan con los
 * mismos campos vengan de donde vengan.
 *
 * El envío real se configura con `VITE_WAITLIST_ENDPOINT` (ver `lib/waitlist.ts`).
 * Mientras no haya endpoint, el estado `demo` muestra el mensaje de éxito
 * acompañado de un aviso visible de que todavía no está conectado: enseñable al
 * cliente sin engañar a quien lo rellene.
 */
export function WaitlistForm({ source, onSuccess, className }: WaitlistFormProps) {
  const fieldId = useId()
  const statusId = useId()
  const [lead, setLead] = useState<WaitlistLead>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<WaitlistField, true>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const firstInvalidRef = useRef<HTMLInputElement>(null)

  const submitted = status === 'success' || status === 'demo'
  const message = submitted ? waitlistForm.success : status === 'error' ? waitlistForm.error : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const found = validateLead(lead)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      // El foco va al primer campo con error: sin esto, en un formulario de
      // cuatro campos hay que buscar a ojo cuál falló.
      firstInvalidRef.current?.focus()
      return
    }

    setStatus('submitting')

    try {
      const result = await submitWaitlist(lead, source)
      setStatus(result === 'ok' ? 'success' : 'demo')
      setLead(EMPTY)
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  function update(field: WaitlistField, value: string) {
    setLead((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status === 'error') setStatus('idle')
  }

  const firstInvalid = FIELDS.find((f) => errors[f.name])?.name

  return (
    <div className={cn('w-full text-left', className)}>
      <form
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
        noValidate
        className="rounded-[1.5rem] glass p-4 sm:p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const copy = waitlistForm.fields[field.name]
            const invalid = Boolean(errors[field.name])
            const id = `${fieldId}-${field.name}`

            return (
              <div
                key={field.name}
                className={cn('flex flex-col gap-2', !field.half && 'sm:col-span-2')}
              >
                <label htmlFor={id} className="text-label text-muted uppercase">
                  {copy.label}
                </label>

                <input
                  ref={field.name === firstInvalid ? firstInvalidRef : undefined}
                  id={id}
                  name={field.name}
                  type={field.type}
                  value={lead[field.name]}
                  onChange={(event) => update(field.name, event.target.value)}
                  placeholder={copy.placeholder}
                  autoComplete={copy.autoComplete}
                  required
                  disabled={status === 'submitting'}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? `${id}-error` : undefined}
                  className={cn(
                    'h-12 w-full rounded-xl border bg-black/40 px-4 text-body text-white',
                    'transition-[border-color] duration-(--duration-micro) ease-expensive',
                    'placeholder:text-muted-strong focus:outline-none disabled:opacity-60',
                    invalid ? 'border-red-bright' : 'border-line-strong focus:border-white/45',
                  )}
                />

                {invalid ? (
                  <p id={`${id}-error`} className="text-label text-red-bright uppercase">
                    {waitlistForm.errors[field.name]}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'mt-5 h-12 w-full rounded-pill bg-red text-nav font-medium tracking-[0.16em] text-white uppercase',
            'transition-colors duration-(--duration-micro) ease-expensive',
            'hover:bg-red-bright disabled:cursor-not-allowed disabled:opacity-70',
          )}
        >
          {status === 'submitting' ? waitlistForm.submitting : waitlistForm.submit}
        </button>

        {/* Región viva: el resultado se anuncia sin mover el foco. */}
        <div aria-live="polite" className="min-h-6">
          <AnimatePresence mode="wait">
            {message ? (
              <m.p
                key={status}
                id={statusId}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.micro, ease: EASE.expensive }}
                className={cn(
                  'mt-4 text-center text-eyebrow uppercase',
                  submitted ? 'text-white/85' : 'text-red-bright',
                )}
              >
                {message}
              </m.p>
            ) : null}
          </AnimatePresence>
        </div>
      </form>

      {/* Letra pequeña en caja baja: las versalitas del sistema sirven para
          etiquetas de dos palabras, no para una frase de dos líneas. */}
      <p className="mt-3 text-center text-[0.6875rem] leading-relaxed text-muted-strong">
        {waitlistForm.privacy}
      </p>

      {/* Aviso persistente mientras el formulario no tenga endpoint.
          Desaparece solo al configurar VITE_WAITLIST_ENDPOINT. */}
      {!isWaitlistConfigured() ? (
        <p className="mt-2 text-center text-label text-red-bright uppercase">{waitlistForm.demo}</p>
      ) : null}
    </div>
  )
}
