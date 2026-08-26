import { Reveal } from '@/components/animations/Reveal'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { atmosphere } from '@/data/home'
import { barDetail, entrance } from '@/data/media'

const TITLE_ID = 'ambiente-titulo'

/**
 * Ambiente.
 *
 * Maquetación de revista, no una grilla regular: la imagen grande arranca a la
 * izquierda, la pequeña baja y se desplaza a la derecha, y la columna central
 * se deja deliberadamente vacía. El hueco es parte de la composición.
 */
export function Atmosphere() {
  return (
    <Section id={atmosphere.id} aria-labelledby={TITLE_ID}>
      <Container>
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <Eyebrow index={atmosphere.index}>{atmosphere.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <Heading
                id={TITLE_ID}
                lead={atmosphere.title[0]}
                accent={atmosphere.title[1]}
                className="mt-7"
              />
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:mt-8">
            <Figure
              media={entrance}
              parallax
              sizes="(min-width: 1024px) 54vw, 92vw"
              caption="La entrada"
              from="left"
              hover
            />
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-24 lg:self-end">
            <Reveal delay={0.1}>
              <p className="max-w-prose text-lead text-gray">{atmosphere.body}</p>
            </Reveal>

            <Figure
              media={barDetail}
              parallax
              sizes="(min-width: 1024px) 30vw, 92vw"
              caption="Detalle de barra"
              delay={0.15}
              className="mt-10"
              from="right"
              hover
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
