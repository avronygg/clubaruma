# ARUMA CLUB

Sitio web oficial de Aruma Club: club nocturno exclusivo. Una sola página,
construida para generar expectativa y captar lista de espera antes de la apertura.

---

## Estado del proyecto

**Prelanzamiento.** El club todavía no ha abierto, así que toda la web está
escrita en clave de anticipación y su objetivo real es una conversión: el correo
de la lista de espera.

**Hecho**

- Home completa: hero, experiencia, coctelería, ambiente, VIP, música, galería y
  lista de espera, más cabecera y pie.
- Sistema de diseño con tokens centralizados y componentes reutilizables.
- Sistema de animación coherente, con respeto a `prefers-reduced-motion`.
- Pipeline de imágenes AVIF/WebP responsive.
- Accesibilidad: WCAG 2.2 AA verificado en navegador (contraste, foco, teclado,
  áreas táctiles, menú modal).
- SEO: metadatos, Open Graph, Twitter Card, canonical, favicons, manifest y JSON-LD.

**Pendiente**

- Conectar el formulario de la lista de espera a un servicio real.
- Confirmar los datos de contacto marcados como `TODO`.

---

## Puesta en marcha

Requiere Node 20 o superior.

```bash
npm install
npm run dev
```

### Scripts

| Script                 | Qué hace                                                               |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con recarga en caliente.                        |
| `npm run build`        | Comprueba tipos y genera la build de producción en `dist/`.            |
| `npm run preview`      | Sirve la build de producción para revisarla en local.                  |
| `npm run typecheck`    | Solo comprobación de tipos, sin emitir.                                |
| `npm run lint`         | ESLint sobre todo el proyecto.                                         |
| `npm run lint:fix`     | ESLint aplicando las correcciones automáticas.                         |
| `npm run format`       | Formatea con Prettier.                                                 |
| `npm run format:check` | Verifica el formato sin escribir.                                      |
| `npm run check`        | Tipos + lint + formato. Ejecútalo antes de publicar.                   |
| `npm run images`       | Regenera los derivados responsive desde `assets-source/`.              |
| `npm run sync:fonts`   | Recopia los subsets de fuentes desde `node_modules` a `public/fonts/`. |

---

## Arquitectura

```
src/
  app/              Raíz de la aplicación: providers de animación y rutas
  components/
    ui/             Sistema de diseño: Button, Container, Section, Heading,
                    Eyebrow, Divider, Logo, Image, Figure, Placeholder
    layout/         RootLayout, Footer, Preloader, Seo
    navigation/     NavBar, MobileMenu, NavLink, MenuToggle, ScrollProgress
    sections/       Una sección de la home por archivo
    animations/     Reveal, FadeIn, SlideUp, Stagger, ImageReveal,
                    AnimatedText, MagneticButton, PageTransition
    forms/          WaitlistForm
  data/             TODO el contenido y la configuración. Cero texto en JSX
  hooks/            useScrolled, useLockBodyScroll, usePrefersReducedMotion,
                    useMediaQuery
  lib/              cn, motion (tokens de animación), images, navigation, waitlist
  pages/            HomePage, NotFoundPage
  styles/           globals.css: TODOS los design tokens
  types/            Contratos de dominio
```

El criterio de separación es estricto:

- **Contenido** vive en `src/data/`. Ninguna sección escribe texto a mano.
- **Tokens** viven en `src/styles/globals.css`. Ningún componente inventa un
  color, un espacio ni una curva.
- **Animación** vive en `src/lib/motion.ts` y en `components/animations/`. Las
  secciones componen, no definen transiciones.
- **Layout y routing** viven en `components/layout/` y `app/`. Las secciones no
  saben en qué página están.

Gracias a eso, migrar el contenido a un CMS consiste en cambiar el origen de
`src/data/` sin tocar un solo componente.

---

## Design tokens

Todo está en [`src/styles/globals.css`](src/styles/globals.css), dentro del
bloque `@theme`: paleta, tipografía fluida, escala de espaciado, radios, curvas
de animación y breakpoints.

La paleta por defecto de Tailwind está deliberadamente vaciada
(`--color-*: initial`). Eso significa que **`bg-blue-500` no existe**: si un
color no está en la marca, no se puede escribir por accidente.

Las duraciones se declaran dos veces a propósito —en CSS y en
[`src/lib/motion.ts`](src/lib/motion.ts)— para que JS y CSS compartan el mismo
tempo. Si cambias una, cambia la otra.

---

## Fotografía

Los masters del cliente viven en `assets-source/` y **nunca se publican**: pesan
decenas de MB. `npm run images` los procesa y escribe en `public/images/` los
derivados optimizados que consume la web.

Convención de nombres:

```
public/images/{nombre}-{ancho}.{avif|webp}
```

El hero de escritorio sale a **75 kB en AVIF a 1920px**.

> **Resolución del hero de escritorio.** El máster mide 1920×1080, que es exacto
> para pantallas 1x pero se queda corto en pantallas de alta densidad: un portátil
> Retina a 1440px lógicos pide 2880px y el navegador tendrá que escalar. Si existe
> una exportación de mayor resolución del mismo plano, sustitúyela y sube los
> anchos en `scripts/generate-images.mjs`.

### Sustituir un marcador por una foto real

1. Deja el master en `assets-source/<nombre>.png` o `.jpg`.
2. Añade una línea al array `JOBS` de
   [`scripts/generate-images.mjs`](scripts/generate-images.mjs).
3. Ejecuta `npm run images` y anota las dimensiones que imprime por consola.
4. En [`src/data/media.ts`](src/data/media.ts), cambia esa entrada de
   `kind: 'placeholder'` por el `ImageAsset` equivalente.

**No hay que tocar ninguna sección.** El componente `Figure` acepta
indistintamente una foto real o un marcador.

---

## Fotografía

Todas las piezas tienen foto real. No queda ningún marcador.

| Imagen                    | Dónde se usa                                  |
| ------------------------- | --------------------------------------------- |
| `heroDesktop` (1920×1080) | Hero de escritorio                            |
| `heroMobile` (1290×2053)  | Hero de móvil, encuadre vertical propio       |
| `experienceMain`          | Experiencia — invitadas brindando en la barra |
| `experienceDetail`        | Experiencia — placa metálica de la marca      |
| `cocktail`                | Coctelería — servido en copa de marca         |
| `entrance`                | Ambiente — entrada del local                  |
| `barDetail`               | Ambiente — detalle de barra                   |
| `vipCard`                 | VIP — tarjeta de socio                        |
| `dancefloor`              | Música — invitada bailando                    |
| `guestsToast`             | Galería — invitados                           |
| `vipTable`                | Galería — reservados                          |
| `galleryRoom`             | Galería — sala                                |
| `guestsBottle`            | Galería — brindis                             |
| `guestPortrait`           | Galería — la noche                            |
| `bottleService`           | Galería — servicio de botella                 |

El componente `Placeholder` sigue en el sistema y el tipo `Media` admite
`kind: 'placeholder'`: si más adelante se añade una sección sin material, el
hueco se declara en pantalla sin tocar ningún componente.

---

## Lista de espera

El formulario está construido, validado y con todos sus estados, pero **no tiene
backend**. Se conecta apuntando una variable de entorno a cualquier servicio que
acepte un POST con JSON — Formspree, Brevo, Mailchimp o una función propia:

```bash
# .env.local
VITE_WAITLIST_ENDPOINT="https://…"
```

El cuerpo que envía es:

```json
{ "email": "…", "source": "web-prelanzamiento" }
```

Mientras la variable esté vacía, el formulario **avisa en pantalla** de que está
en modo demostración en lugar de fingir que ha guardado el correo. Ese aviso
desaparece solo en cuanto configuras el endpoint.

Lógica en [`src/lib/waitlist.ts`](src/lib/waitlist.ts).

---

## Datos por completar

Todos están en [`src/data/site.ts`](src/data/site.ts) y marcados con `TODO`.
**Hay que confirmarlos antes de publicar**: hoy son marcadores de posición.

| Dato                | Línea | Valor actual              |
| ------------------- | ----- | ------------------------- |
| Dominio definitivo  | 13    | `https://arumaclub.cl`    |
| Fecha de apertura   | 31    | `Septiembre 2026`         |
| Dirección           | 39    | `Dirección por confirmar` |
| WhatsApp            | 42    | `+56900000000`            |
| Correo comercial    | 45    | `hola@arumaclub.cl`       |
| Handle de Instagram | 59    | `@arumaclub`              |

El dominio aparece además en el JSON-LD de [`index.html`](index.html); cámbialo
en los dos sitios.

---

## Cuando el club abra

1. Pon `launch.open: true` en `src/data/site.ts`.
2. Revisa en `src/data/home.ts` todas las entradas marcadas con
   `PRELANZAMIENTO`: están escritas para un club que aún no existe.
3. En el pie, el horario se presenta como **previsto**. Quita ese matiz en
   `src/components/layout/Footer.tsx`.
4. Reconsidera la sección de lista de espera: pasa a ser reservas.

---

## Añadir una página nueva

La arquitectura ya está preparada; hoy solo existe la home por decisión de
alcance, no por limitación.

1. Crea el archivo en `src/pages/`, con su propio `<Seo />`.
2. Añade la ruta en [`src/app/App.tsx`](src/app/App.tsx) — hay un bloque
   comentado con las rutas previstas: `/experiencia`, `/vip`, `/cocteleria`,
   `/eventos`, `/galeria`, `/contacto`.
3. En `src/data/navigation.ts`, cambia el `href` del ancla (`#vip`) por la ruta
   (`/vip`). `NavLink` detecta solo si es ancla o ruta y usa scroll suave o el
   router según corresponda.

El layout, la navegación y la transición entre páginas ya están montados.

---

## Accesibilidad y rendimiento

**Accesibilidad**

- Un único `h1` por página y jerarquía de encabezados coherente.
- Landmarks reales: `header`, `nav`, `main`, `footer`. Cero `div` con `onClick`.
- Menú móvil como diálogo modal: `role="dialog"`, `aria-modal`, foco gestionado,
  cierre con Escape y el resto de la página marcada como `inert`.
- Contraste verificado sobre el fondo real: todas las combinaciones de texto
  superan 4.5:1.
- Áreas táctiles de 24×24 px como mínimo, ampliadas sin alterar el diseño.
- `prefers-reduced-motion` respetado en tres capas: `MotionConfig`, hooks y una
  red de seguridad en CSS.

**Rendimiento**

- AVIF con respaldo WebP, `srcset` y `sizes` en todas las imágenes.
- Precarga únicamente del LCP, y solo del encuadre que corresponde al dispositivo.
- `width` y `height` siempre presentes: cero layout shift.
- Tipografías auto-hospedadas, sin depender de ningún CDN.
- Animaciones limitadas a `opacity`, `transform` y `clip-path`.
- `LazyMotion` con `domAnimation`: unos 20 kB comprimidos menos que la librería
  completa.
- Vendors separados en chunks propios para que se cacheen entre despliegues.

Consulta [`docs/decisiones.md`](docs/decisiones.md) para el porqué de cada
decisión de diseño e ingeniería.
