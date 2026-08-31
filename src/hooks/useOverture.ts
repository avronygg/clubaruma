import { createContext, use } from 'react'

export type OvertureValue = {
  /** `false` mientras la cortina del preloader siga puesta. */
  ready: boolean
  /** Lo llama el preloader al retirarse. */
  begin: () => void
}

/**
 * El contexto vive aquí, y no junto al proveedor, por una razón de
 * herramientas: un archivo que exporta a la vez un componente y algo que no lo
 * es rompe el refresco en caliente de Vite, que a partir de ahí recarga la
 * página entera en cada cambio en lugar de sustituir el módulo.
 *
 * El valor por defecto es `ready: true`: fuera del proveedor nadie se queda
 * esperando una señal que no va a llegar.
 */
export const OvertureContext = createContext<OvertureValue>({ ready: true, begin: () => {} })

/**
 * Quién da la salida a la secuencia de entrada.
 *
 * Quien lo use debe partir de un estado oculto y pasar al visible cuando
 * `ready` sea `true`, nunca al revés. Ver `components/layout/Overture.tsx`.
 */
export function useOverture(): OvertureValue {
  return use(OvertureContext)
}
