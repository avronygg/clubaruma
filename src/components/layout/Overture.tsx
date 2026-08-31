import { useMemo, useState, type ReactNode } from 'react'

import { OvertureContext } from '@/hooks/useOverture'

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
 *
 * El contexto y el hook viven en `hooks/useOverture.ts`: aquí solo puede haber
 * componentes, o Vite deja de refrescar en caliente.
 */
export function OvertureProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const value = useMemo(() => ({ ready, begin: () => setReady(true) }), [ready])

  return <OvertureContext value={value}>{children}</OvertureContext>
}
