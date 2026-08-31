import { Sequence, Step } from '@/components/animations/Sequence'
import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Figure } from '@/components/ui/Figure'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { experience, experienceDetails } from '@/data/home'
import { experienceDetail, experienceMain } from '@/data/media'

const TITLE_ID = 'experiencia-titulo'

/**
 * Experiencia.
 *
 * Composición asimétrica: la columna de texto ocupa un tercio y respira, la
 * fotografía cae desplazada a la derecha atravesando las dos filas. El cuadrado
 * pequeño que se solapa rompe la retícula justo lo suficiente para que la
 * página deje de parecer una plantilla.
 */
export function Experience() {
  return (
    <Section id={experience.id} aria-labelledby={TITLE_ID}>
      <Container>
        <div className="grid grid-cols-12 gap-x-0 gap-y-12 lg:gap-x-8 lg:gap-y-16">
          <Sequence className="col-span-12 lg:col-span-4 lg:self-end lg:pb-4">
            <Step>
              <Eyebrow index={experience.index}>{experience.eyebrow}</Eyebrow>
            </Step>
            <Step>
              <Heading
                id={TITLE_ID}
                lead={experience.title[0]}
                accent={experience.title[1]}
                className="mt-7"
              />
            </Step>
          </Sequence>

          <div className="relative col-span-12 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            <Figure
              media={experienceMain}
              parallax
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="w-full"
              from="right"
              hover
            />

            {/* Detalle solapado: textura real del techo del local. */}
            <Figure
              media={experienceDetail}
              sizes="12vw"
              delay={0.35}
              from="left"
              className="absolute bottom-12 -left-14 hidden w-36 lg:block xl:-left-20 xl:w-44"
            />
          </div>

          <Sequence className="col-span-12 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-start">
            <Step>
              <p className="max-w-prose text-lead text-gray">{experience.body}</p>
            </Step>

            <Step>
              <dl className="mt-12 max-w-md">
                {experienceDetails.map((detail) => (
                  <div key={detail.id}>
                    <Divider />
                    <div className="flex items-baseline justify-between gap-6 py-4">
                      <dt className="text-eyebrow text-muted-strong uppercase">{detail.label}</dt>
                      <dd className="m-0 text-eyebrow text-white/85 uppercase">{detail.value}</dd>
                    </div>
                  </div>
                ))}
                <Divider />
              </dl>
            </Step>
          </Sequence>
        </div>
      </Container>
    </Section>
  )
}
