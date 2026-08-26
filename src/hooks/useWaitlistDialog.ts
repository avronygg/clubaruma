import { useCallback, useEffect, useState } from 'react'

/** Ya se mostró solo en esta sesión: no vuelve a abrirse al navegar. */
const SESSION_KEY = 'aruma:popup-visto'
/** Ya se inscribió: no vuelve a abrirse solo nunca en este navegador. */
const DONE_KEY = 'aruma:lista-hecha'

function leer(almacen: Storage | undefined, clave: string): boolean {
  try {
    return almacen?.getItem(clave) === '1'
  } catch {
    // Modo privado o almacenamiento bloqueado: se trata como primera visita.
    return false
  }
}

function escribir(almacen: Storage | undefined, clave: string): void {
  try {
    almacen?.setItem(clave, '1')
  } catch {
    /* sin persistencia, sin drama */
  }
}

type WaitlistDialog = {
  open: boolean
  /** Apertura a demanda: botón flotante o cualquier otro disparador. */
  show: () => void
  close: () => void
  /** `true` cuando ya se completó el alta en este navegador. */
  submitted: boolean
  markSubmitted: () => void
}

/**
 * Estado del diálogo de la lista VIP.
 *
 * Separa **cuándo se abre solo** de **quién puede abrirlo**: el temporizador de
 * entrada y el botón flotante llaman al mismo `show`, así que hay un único
 * diálogo y un único formulario.
 *
 * La apertura automática obedece a tres reglas:
 *
 *   1. **No es instantánea.** Espera unos segundos. Si salta a la vez que la
 *      animación del hero, tapa la primera impresión y dispara el rechazo.
 *   2. **Una vez por sesión.** Volver atrás o recargar no la repite.
 *   3. **Nunca a quien ya se inscribió.** Eso se recuerda entre sesiones.
 *
 * Abrirlo a mano no tiene ninguna de esas restricciones: si alguien pulsa el
 * botón, se abre.
 */
export function useWaitlistDialog(delay: number, autoOpen = true): WaitlistDialog {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(() => leer(window.localStorage, DONE_KEY))

  const show = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const markSubmitted = useCallback(() => {
    escribir(window.localStorage, DONE_KEY)
    setSubmitted(true)
  }, [])

  useEffect(() => {
    if (!autoOpen) return
    if (leer(window.localStorage, DONE_KEY)) return
    if (leer(window.sessionStorage, SESSION_KEY)) return

    const timer = window.setTimeout(() => {
      setOpen(true)
      escribir(window.sessionStorage, SESSION_KEY)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [delay, autoOpen])

  return { open, show, close, submitted, markSubmitted }
}
