import { m } from 'motion/react'

import { MagneticButton } from '@/components/animations/MagneticButton'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { hero } from '@/data/home'
import { heroDesktop, heroMobile } from '@/data/media'
import { buildSrcSet, fallbackSrc } from '@/lib/images'
import { DURATION, EASE, STAGGER, staggerContainer } from '@/lib/motion'

/**
 * Corte de dirección de arte.
 *
 * A 1024px, no a 768: entre tablet y móvil el encuadre vertical del cliente
 * aguanta mucho mejor que el horizontal, que a 768×1024 perdería medio plano.
 */
const DESKTOP_QUERY = '(min-width: 64rem)'

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.hero, ease: EASE.expensive } },
}

/**
 * Hero.
 *
 * Dos archivos con su propio encuadre, no un `object-fit` distinto por
 * breakpoint: el horizontal en escritorio y el vertical en móvil. Los ajustes
 * de encuadre viven en `CROPS`, dentro de `scripts/generate-images.mjs`.
 *
 * El wordmark **no** se repite aquí: ya está en la navbar y grabado en el vaso
 * de la propia fotografía. Duplicarlo leía como error de montaje. La marca la
 * sostienen el logotipo de la cabecera y el aviso de apertura; el titular carga
 * con la propuesta, que en prelanzamiento es entrar como VIP.
 *
 * Todo va centrado y anclado abajo, sobre la zona más oscura del plano. La
 * legibilidad se resuelve con degradados direccionales, nunca con un velo plano
 * que apagaría la fotografía.
 */
export function Hero() {
  return (
    <section id="inicio" className="relative isolate min-h-svh w-full overflow-hidden bg-black">
      {/* --- Fotografía --------------------------------------------------- */}
      <m.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: EASE.expensive }}
      >
        <picture className="block h-full w-full">
          <source
            media={DESKTOP_QUERY}
            type="image/avif"
            srcSet={buildSrcSet(heroDesktop, 'avif')}
            sizes="100vw"
          />
          <source
            media={DESKTOP_QUERY}
            type="image/webp"
            srcSet={buildSrcSet(heroDesktop, 'webp')}
            sizes="100vw"
          />
          <source type="image/avif" srcSet={buildSrcSet(heroMobile, 'avif')} sizes="100vw" />
          <source type="image/webp" srcSet={buildSrcSet(heroMobile, 'webp')} sizes="100vw" />
          <img
            src={fallbackSrc(heroMobile)}
            alt={heroDesktop.alt}
            width={heroDesktop.width}
            height={heroDesktop.height}
            fetchPriority="high"
            decoding="sync"
            draggable={false}
            className="h-full min-h-svh w-full object-cover object-center"
          />
        </picture>
      </m.div>

      {/* --- Degradados de legibilidad -------------------------------------
          Se refuerza solo la mitad inferior, que es donde va el texto; el
          sujeto y la parte alta del plano conservan todo su rango. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(5_5_5/0.88)_0%,rgb(5_5_5/0.72)_20%,rgb(5_5_5/0.42)_42%,rgb(5_5_5/0.1)_66%,transparent_88%)] lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block lg:bg-[linear-gradient(to_top,rgb(5_5_5/0.94)_0%,rgb(5_5_5/0.85)_20%,rgb(5_5_5/0.63)_42%,rgb(5_5_5/0.22)_64%,transparent_86%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(to_bottom,rgb(5_5_5/0.68),transparent)]"
      />

      {/* --- Contenido ------------------------------------------------------ */}
      <m.div
        variants={staggerContainer(STAGGER.loose, 0.4)}
        initial="hidden"
        animate="visible"
        className="relative flex min-h-svh flex-col"
      >
        <Container className="flex flex-1 flex-col items-center justify-end pt-nav pb-[clamp(2rem,5vh,4.5rem)] text-center">
          <h1 className="m-0 flex flex-col items-center">
            {/* El nombre de marca queda en el h1 aunque no se pinte: el rótulo
                visible sobraba junto al logotipo de la navbar y al badge. */}
            <span className="sr-only">{hero.eyebrow} — </span>

            {/* Cada mitad en su propia línea. Dejado al ajuste natural, el
                titular partía como «Sé VIP desde la / primera noche.» y
                abandonaba el artículo al final del renglón. */}
            <m.span
              variants={rise}
              className="block max-w-[24ch] text-display font-light text-white"
            >
              <span className="block">{hero.title[0]}</span>
              <span className="block title-accent">{hero.title[1]}</span>
            </m.span>
          </h1>

          <m.p
            variants={rise}
            className="mt-6 max-w-[68ch] text-body text-gray sm:mt-7 sm:text-lead"
          >
            {hero.body}
          </m.p>

          <m.div
            variants={rise}
            className="mt-8 flex flex-col items-center gap-5 sm:mt-10 sm:flex-row sm:gap-7"
          >
            <MagneticButton className="w-full sm:w-auto">
              <Button href={hero.primary.href} className="w-full sm:w-auto">
                {hero.primary.label}
              </Button>
            </MagneticButton>

            <Button href={hero.secondary.href} variant="ghost">
              {hero.secondary.label}
            </Button>
          </m.div>
        </Container>
      </m.div>
    </section>
  )
}
