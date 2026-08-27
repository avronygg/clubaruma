import { Sequence, Step } from '@/components/animations/Sequence'
import { Container } from '@/components/ui/Container'
import { Divider } from '@/components/ui/Divider'
import { Logo } from '@/components/ui/Logo'
import { footerLinks } from '@/data/navigation'
import { contact, launch, openingHours, site, socialLinks } from '@/data/site'

const YEAR = new Date().getFullYear()

const columnTitle = 'text-label font-medium uppercase text-muted-strong'
const columnLink =
  'link-underline tap-target [--tap-expand:0.4375rem] pb-0.5 text-white/70 ' +
  'transition-colors duration-(--duration-micro) hover:text-white'

/**
 * Pie mínimo: marca, navegación, contacto y horarios. Nada más.
 * Cuatro columnas en escritorio, apiladas con filetes en móvil.
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-black">
      <Container className="py-16 lg:py-20">
        <Sequence className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <Step className="lg:col-span-4">
            <Logo decorative className="w-32 text-white" />
            <p className="mt-6 max-w-[24ch] serif-accent text-lead text-muted">{site.tagline}</p>
          </Step>

          <Step className="lg:col-span-2 lg:col-start-6">
            <nav aria-label="Pie de página">
              <h2 className={columnTitle}>Explorar</h2>
              <ul className="mt-5 flex flex-col gap-3.5 text-eyebrow uppercase">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className={columnLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Step>

          <Step className="lg:col-span-2">
            <h2 className={columnTitle}>Contacto</h2>
            <ul className="mt-5 flex flex-col gap-3.5 text-eyebrow uppercase">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={columnLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contact.email}`} className={columnLink}>
                  Email
                </a>
              </li>
            </ul>
          </Step>

          <Step className="lg:col-span-3 lg:col-start-10">
            <h2 className={columnTitle}>Visítanos</h2>

            <p className="mt-5 flex items-center gap-3 text-eyebrow text-white/85 uppercase">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-red-bright" />
              {launch.shortLabel} · {launch.period}
            </p>

            <address className="mt-5 flex flex-col gap-2.5 text-eyebrow text-white/70 uppercase not-italic">
              <span className="text-white/85">{contact.venue}</span>
              <span>{contact.address}</span>
              <span className="text-muted-strong">{contact.city}</span>
            </address>

            {/* El club no ha abierto: el horario se presenta como previsto. */}
            <p className="mt-6 text-label text-muted-strong uppercase">Horario previsto</p>
            <ul className="mt-2.5 flex flex-col gap-2.5 text-eyebrow text-muted-strong uppercase">
              {openingHours.map((slot) => (
                <li key={slot.days}>
                  {slot.days} · {slot.hours}
                </li>
              ))}
            </ul>
          </Step>
        </Sequence>

        <Divider className="mt-16" />

        <div className="mt-6 flex flex-col gap-3 text-label text-muted-strong uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {site.name}. Todos los derechos reservados.
          </p>
          <p>
            <a
              href={socialLinks[0]?.href ?? '#'}
              target="_blank"
              rel="noreferrer noopener"
              className={columnLink}
            >
              {socialLinks[0]?.handle}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
