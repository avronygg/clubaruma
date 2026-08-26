import { MagneticButton } from '@/components/animations/MagneticButton'
import { Reveal } from '@/components/animations/Reveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { vip } from '@/data/home'
import { vipCard } from '@/data/media'

const TITLE_ID = 'vip-titulo'

/**
 * VIP.
 *
 * El corte de capítulo de la página: negro puro y pocos elementos, porque
 * después de tres secciones ilustradas el vacío es lo que la hace leer como
 * club privado y no como promoción.
 *
 * La tarjeta de socio sustituye al filete rojo decorativo que había antes: en
 * la sección donde se pide entrar como VIP, un objeto que muestra exactamente
 * eso pesa más que un adorno, y el recuento de elementos no sube.
 */
export function Vip() {
  return (
    <Section
      id={vip.id}
      aria-labelledby={TITLE_ID}
      spacing="loose"
      className="isolate overflow-hidden border-y border-line bg-black"
    >
      {/* Rescoldo rojo apenas perceptible: da profundidad al negro. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(65%_60%_at_50%_50%,rgb(163_15_26/0.13),transparent_72%)]"
      />

      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Figure
            media={vipCard}
            sizes="(min-width: 1024px) 26rem, 78vw"
            className="w-[min(78vw,26rem)]"
          />

          <Reveal delay={0.06} className="mt-10">
            <Eyebrow index={vip.index}>{vip.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.12}>
            <Heading
              id={TITLE_ID}
              lead={vip.title[0]}
              accent={vip.title[1]}
              align="center"
              className="mt-7"
            />
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-8 max-w-[36ch] text-lead text-gray">{vip.body}</p>
          </Reveal>

          {vip.cta ? (
            <Reveal delay={0.24}>
              <MagneticButton className="mt-11">
                <Button href={vip.cta.href}>{vip.cta.label}</Button>
              </MagneticButton>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
