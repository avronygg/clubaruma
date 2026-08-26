import { site } from '@/data/site'

type SeoProps = {
  title?: string
  description?: string
  /** Ruta relativa: '/', '/vip'… Se usa para el canonical. */
  path?: string
  image?: string
}

/**
 * `VITE_NOINDEX=1` bloquea la indexación de todo el sitio.
 *
 * Mientras la web viva en un dominio de vista previa hay que tenerlo puesto.
 * Si Google indexa el `.vercel.app`, al mudarse al dominio definitivo queda
 * una copia vieja compitiendo con la buena, y quitarla del índice después
 * cuesta bastante más que ponerlo ahora.
 */
const NOINDEX = import.meta.env['VITE_NOINDEX'] === '1'

/**
 * Metadatos de página.
 *
 * React 19 eleva `<title>`, `<meta>` y `<link>` al `<head>` desde cualquier
 * punto del árbol, así que no hace falta ninguna librería tipo Helmet.
 * Cada página futura solo tiene que renderizar su propio `<Seo>`.
 */
export function Seo({
  title = site.title,
  description = site.description,
  path = '/',
  image = '/og-image.jpg',
}: SeoProps) {
  const url = `${site.url}${path}`
  const imageUrl = `${site.url}${image}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {NOINDEX ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${site.name} — ${site.tagline}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  )
}
