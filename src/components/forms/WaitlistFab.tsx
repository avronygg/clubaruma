import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { waitlistFab } from '@/data/home'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

/** El mensaje se despliega una vez por sesión; el botón se queda siempre. */
const SESSION_KEY = 'aruma:fab-visto'

/**
 * Lo que dura el «escribiendo…» antes de aparecer el mensaje. Suficiente para
 * que se lea como alguien tecleando, no tanto como para impacientar.
 */
const TYPING_DURATION = 1800

/**
 * Lo que permanece el mensaje antes de replegarse solo. En móvil la burbuja
 * tapa parte del hero, así que no se queda indefinidamente: se retira y deja
 * el círculo, que sigue abriendo el mismo formulario.
 */
const MESSAGE_DURATION = 9000

type Fase = 'oculto' | 'escribiendo' | 'mensaje'

type WaitlistFabProps = {
  onOpen: () => void
  /** Retardo del «escribiendo…», en milisegundos, desde que arranca la cuenta. */
  bubbleDelay: number
  /** Se oculta con el diálogo o el menú abiertos: estorbaría por encima. */
  hidden?: boolean
  /** Quien ya se inscribió no necesita que le insistan. */
  submitted?: boolean
}

function yaVisto(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function recordar(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* sin persistencia, sin drama */
  }
}

/**
 * Botón flotante de captación.
 *
 * Un círculo con el isotipo, siempre presente abajo a la derecha, que se
 * comporta como un asesor: a los pocos segundos aparece «escribiendo…» y
 * después el mensaje. Es la segunda oportunidad para quien cerró el popup de
 * entrada sin rellenarlo.
 *
 * La cuenta no arranca mientras el diálogo esté abierto, así que la secuencia
 * empieza cuando la persona cierra el popup y no antes: de otro modo el mensaje
 * se escribiría detrás de una capa que lo tapa.
 *
 * Abre el mismo diálogo que el popup: un solo formulario, los mismos campos.
 */
export function WaitlistFab({
  onOpen,
  bubbleDelay,
  hidden = false,
  submitted = false,
}: WaitlistFabProps) {
  const [fase, setFase] = useState<Fase>('oculto')

  useEffect(() => {
    if (hidden || submitted || yaVisto() || fase !== 'oculto') return

    const aparecer = window.setTimeout(() => setFase('escribiendo'), bubbleDelay)
    return () => window.clearTimeout(aparecer)
  }, [bubbleDelay, hidden, submitted, fase])

  useEffect(() => {
    if (fase !== 'escribiendo') return

    const escribir = window.setTimeout(() => {
      setFase('mensaje')
      recordar()
    }, TYPING_DURATION)

    return () => window.clearTimeout(escribir)
  }, [fase])

  useEffect(() => {
    if (fase !== 'mensaje') return

    const replegar = window.setTimeout(() => setFase('oculto'), MESSAGE_DURATION)
    return () => window.clearTimeout(replegar)
  }, [fase])

  const visible = fase !== 'oculto' && !hidden

  return (
    <div
      className={cn(
        // En móvil el flotante sube: a la altura habitual el mensaje caía justo
        // encima del botón «Únete a la lista» del hero, y el flotante competía
        // con la conversión principal en vez de reforzarla.
        'fixed right-gutter bottom-16 z-90 flex flex-col items-end gap-3 sm:bottom-6',
        'transition-opacity duration-(--duration-ui) ease-expensive',
        hidden && 'pointer-events-none opacity-0',
      )}
    >
      <AnimatePresence mode="wait">
        {visible ? (
          <m.div
            key={fase}
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: DURATION.ui, ease: EASE.expensive }}
            className="relative origin-bottom-right"
          >
            {fase === 'escribiendo' ? (
              /* Decorativo: no aporta nada a quien no lo ve, y el botón
                 circular ya ofrece la misma acción con su etiqueta. */
              <div
                aria-hidden="true"
                className="flex items-center gap-1.5 rounded-2xl rounded-br-md glass px-4 py-4"
              >
                {[0, 1, 2].map((i) => (
                  <m.span
                    key={i}
                    className="block size-1.5 rounded-full bg-white/70"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1.1,
                      ease: EASE.inout,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                  />
                ))}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpen}
                  className="block max-w-[16rem] rounded-2xl rounded-br-md glass px-4 py-3 text-left text-body leading-snug text-white transition-colors duration-(--duration-micro) hover:bg-white/10"
                >
                  {waitlistFab.message}
                </button>

                {/* Fuera del botón, no dentro: un botón anidado en otro es HTML
                    inválido y los lectores de pantalla no saben qué anunciar. */}
                <button
                  type="button"
                  onClick={() => setFase('oculto')}
                  aria-label={waitlistFab.dismiss}
                  className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full glass text-white/70 transition-colors duration-(--duration-micro) hover:text-white"
                >
                  <span aria-hidden="true" className="relative block size-2.5">
                    <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                    <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
                  </span>
                </button>
              </>
            )}
          </m.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={onOpen}
        aria-label={waitlistFab.open}
        className={cn(
          'group relative inline-flex size-14 items-center justify-center rounded-full',
          'bg-red text-white shadow-[0_10px_34px_-12px_rgb(0_0_0/0.8)]',
          'transition-colors duration-(--duration-micro) ease-expensive hover:bg-red-bright',
        )}
      >
        {/* Halo que respira: señala que el botón está vivo sin girar ni rebotar. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-halo rounded-full bg-red-bright"
        />
        <Logo variant="mark" decorative className="relative w-6" />
      </button>
    </div>
  )
}
