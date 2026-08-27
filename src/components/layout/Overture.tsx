import { createContext, use, useMemo, useState, type ReactNode } from 'react'

type OvertureValue = {
  /** `true` cuando la cortina se ha ido y la página puede empezar a montarse. */
  ready: boolean
  /** Lo llama el preloader al retirarse. */
  begin: () => void
}

const OvertureContext = createContext<OvertureValue>({ ready: true, begin: () => {} })

/**
 * Obertura: quién da la salida a la secuencia de entrada.
 *
 * El problema que resuelve: la página se monta debajo del preloader, así que
 * sin coordinación el encadenado de la portada —cabecera, titular línea a
 * línea, párrafo, botones— se representaba entero detrás de la cortina y el
 * visitante llegaba con la función terminada.
 *
 * Encadenarlo con retardos fijos no vale: el preloader se retira cuando la
 * página termina de cargar, con un suelo de medio segundo y un techo de uno y
 * medio, así que el momento exacto cambia en cada visita y con cada conexión.
 * Tiene que avisar él.
 *
 * Va por contexto y no por props porque quien anima —la portada— cuelga del
 * `outlet` del router, a varios niveles del preloader.
 */
export function OvertureProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const value = useMemo(() => ({ ready, begin: () => setReady(true) }), [ready])

  return <OvertureContext value={value}>{children}</OvertureContext>
}

/**
 * `ready` es `false` mientras la cortina siga puesta.
 *
 * Quien lo use debe partir de un estado oculto y pasar al visible cuando pase
 * a `true`, nunca al revés: si el preloader está desactivado, `begin` se llama
 * en el primer efecto y la espera dura un fotograma.
 */
export function useOverture(): OvertureValue {
  return use(OvertureContext)
}
