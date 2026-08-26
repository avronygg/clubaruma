/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint que recibe los correos de la lista de espera.
   * Sin él, el formulario avisa en pantalla de que no está conectado.
   * Ver `src/lib/waitlist.ts`.
   */
  readonly VITE_WAITLIST_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
