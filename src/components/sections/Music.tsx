import { Reveal } from '@/components/animations/Reveal'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { music } from '@/data/home'
import { dancefloor } from '@/data/media'

const TITLE_ID = 'musica-titulo'

/**
 * Música.
 *
 * Sección mínima: texto a la izquierda, retrato a la derecha, nada más.
 * La fotografía de cabina todavía no existe, así que se declara como hueco
 * pendiente con el briefing dentro del propio marco.
 */
export function Music() {
  return (
    <Section id={music.id} aria-labelledby={TITLE_ID} className="bg-black-soft">
      <Container>
        <div className="grid grid-cols-12 items-center gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <Eyebrow index={music.index}>{music.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.08}>
              <Heading
                id={TITLE_ID}
                lead={music.title[0]}
                accent={music.title[1]}
                className="mt-7"
              />
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-8 max-w-prose text-lead text-gray">{music.body}</p>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Figure
              media={dancefloor}
              parallax
              sizes="(min-width: 1024px) 46vw, 92vw"
              from="right"
              hover
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
