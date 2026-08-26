/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint que recibe los correos de la lista de espera.
   * Sin él, el formulario avisa en pantalla de que no está conectado.
   * Ver `src/lib/waitlist.ts`.
   */
  readonly VITE_WAITLIST_ENDPOINT?: string

  /**
   * Dominio público, sin barra final. Lo consumen `src/data/site.ts` para el
   * canonical y el plugin `aruma-site-url` de `vite.config.ts` para sustituir
   * `%SITE_URL%` en las etiquetas Open Graph estáticas de `index.html`.
   */
  readonly VITE_SITE_URL?: string

  /**
   * `'1'` añade `noindex, nofollow`. Va puesto mientras la web esté en un
   * dominio de vista previa. Ver `src/components/layout/Seo.tsx`.
   */
  readonly VITE_NOINDEX?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
