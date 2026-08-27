import { Sequence, Step } from '@/components/animations/Sequence'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { location } from '@/data/home'
import { contact } from '@/data/site'

const TITLE_ID = 'donde-titulo'

/**
 * Dónde está el club.
 *
 * ── Por qué un mapa y no solo una dirección ────────────────────────────────
 * El club abre en Ovalle y buena parte de quien llega a la web da por hecho
 * que un sitio así está en Santiago. Un mapa lo desmiente de un vistazo y, de
 * paso, convierte el club en un lugar real al que se puede ir en lugar de una
 * promesa abstracta.
 *
 * ── El mapa oscuro ─────────────────────────────────────────────────────────
 * El incrustado de Google llega siempre en claro y no admite estilos: un
 * rectángulo blanco en mitad de una página negra rompería la pieza entera. Se
 * invierte con un filtro y se le devuelve el tono con un giro de matiz, que es
 * la única vía sin clave de API. El resultado es gris oscuro, no el gris azul
 * de un tema nocturno de verdad, así que por encima va un velo rojo muy tenue
 * que lo ata a la paleta.
 *
 * ── Rendimiento ────────────────────────────────────────────────────────────
 * `loading="lazy"`: el mapa está al final de la página y son varios cientos de
 * kilobytes de Google que no tienen por qué competir con la portada.
 */
export function Location() {
  return (
    <Section id={location.id} aria-labelledby={TITLE_ID}>
      <Container>
        <div className="grid grid-cols-12 items-center gap-x-8 gap-y-12">
          <Sequence className="col-span-12 lg:col-span-5">
            <Step>
              <Eyebrow index={location.index}>{location.eyebrow}</Eyebrow>
            </Step>

            <Step>
              <Heading
                id={TITLE_ID}
                lead={location.title[0]}
                accent={location.title[1]}
                className="mt-7"
              />
            </Step>

            <Step>
              <p className="mt-8 max-w-prose text-lead text-gray">{location.body}</p>
            </Step>

            <Step>
              <Button
                href={contact.mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="mt-9"
              >
                {location.cta.label}
              </Button>
            </Step>
          </Sequence>

          <Sequence className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Step>
              <div className="group relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none figure-glow rounded-[1.5rem] group-hover:scale-100 group-hover:opacity-25"
                />

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black-soft sm:aspect-[16/10]">
                  <iframe
                    title={location.mapTitle}
                    src={contact.mapsEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0 brightness-[0.92] contrast-[0.88] grayscale-[0.4] hue-rotate-180 invert"
                  />

                  {/* Velo de marca. No intercepta el puntero, así que el mapa
                      sigue siendo utilizable por debajo. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-red-dark/12 mix-blend-multiply"
                  />
                </div>
              </div>
            </Step>
          </Sequence>
        </div>
      </Container>
    </Section>
  )
}
