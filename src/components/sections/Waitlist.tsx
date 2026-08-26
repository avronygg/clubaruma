import { Reveal } from '@/components/animations/Reveal'
import { WaitlistBenefits } from '@/components/forms/WaitlistBenefits'
import { WaitlistForm } from '@/components/forms/WaitlistForm'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { Section } from '@/components/ui/Section'
import { waitlist } from '@/data/home'
import { launch, socialLinks } from '@/data/site'

const TITLE_ID = 'lista-titulo'

/**
 * Cierre: lista de espera.
 *
 * Es el objetivo real de toda la página. Aquí sí aparece el wordmark —después
 * de siete secciones sin él— porque cierra la marca justo donde se pide el
 * correo. Fondo negro, mucho aire y un único punto de acción.
 */
export function Waitlist() {
  const whatsapp = socialLinks.find((link) => link.id === 'whatsapp')

  return (
    <Section
      id={waitlist.id}
      aria-labelledby={TITLE_ID}
      spacing="loose"
      className="isolate overflow-hidden bg-black"
    >
      {/* Rescoldo rojo bajo el bloque: profundidad sin gradiente evidente. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(163_15_26/0.22),transparent_70%)]"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <Eyebrow index={waitlist.index}>{waitlist.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <Logo decorative className="mt-11 w-[clamp(10rem,24vw,18rem)] text-white" />
          </Reveal>

          <Reveal delay={0.16}>
            <h2 id={TITLE_ID} className="mt-11 text-h2 font-light text-white">
              {waitlist.title[0]} <span className="title-accent">{waitlist.title[1]}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mt-7 max-w-[52ch] text-lead text-gray">{waitlist.body}</p>
          </Reveal>

          <Reveal delay={0.26} className="w-full">
            <WaitlistBenefits className="mt-8" />
          </Reveal>

          <Reveal delay={0.32} className="mt-10 flex w-full justify-center">
            <WaitlistForm source="seccion" />
          </Reveal>

          <Reveal delay={0.34}>
            <p className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-eyebrow text-muted uppercase">
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-red-bright" />
                {launch.shortLabel} · <span className="text-white/85">{launch.period}</span>
              </span>

              {whatsapp ? (
                <>
                  <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tap-target link-underline pb-0.5 text-white/70 transition-colors duration-(--duration-micro) [--tap-expand:0.5rem] hover:text-white"
                  >
                    {waitlist.secondary.label}
                  </a>
                </>
              ) : null}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
