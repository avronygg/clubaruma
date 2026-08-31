import { Sequence, Step } from '@/components/animations/Sequence'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { cocktails } from '@/data/home'
import { cocktail } from '@/data/media'

const TITLE_ID = 'cocteleria-titulo'

/**
 * Coctelería.
 *
 * Se invierte la lectura respecto a la sección anterior: imagen a la izquierda,
 * texto a la derecha. La alternancia es lo que sostiene el ritmo editorial de
 * la página sin recurrir a tarjetas.
 */
export function Cocktails() {
  return (
    <Section id={cocktails.id} aria-labelledby={TITLE_ID} className="bg-black-soft">
      <Container>
        <div className="grid grid-cols-12 items-center gap-x-0 gap-y-12 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-6">
            <Figure
              media={cocktail}
              parallax
              sizes="(min-width: 1024px) 46vw, 92vw"
              caption="Cóctel de autor · Aruma Club"
              from="left"
              hover
            />
          </div>

          <Sequence className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Step>
              <Eyebrow index={cocktails.index}>{cocktails.eyebrow}</Eyebrow>
            </Step>

            <Step>
              <Heading
                id={TITLE_ID}
                lead={cocktails.title[0]}
                accent={cocktails.title[1]}
                className="mt-7"
              />
            </Step>

            <Step>
              <p className="mt-8 max-w-prose text-lead text-gray">{cocktails.body}</p>
            </Step>

            {cocktails.cta ? (
              <Step>
                <Button href={cocktails.cta.href} variant="ghost" className="mt-10">
                  {cocktails.cta.label}
                </Button>
              </Step>
            ) : null}
          </Sequence>
        </div>
      </Container>
    </Section>
  )
}
