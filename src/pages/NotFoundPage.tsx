import { Link } from 'react-router'

import { Seo } from '@/components/layout/Seo'
import { Container } from '@/components/ui/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { Section } from '@/components/ui/Section'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Página no encontrada — ARUMA CLUB" path="/404" />

      <Section spacing="loose" className="flex min-h-svh items-center">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <Logo decorative className="w-40 text-white" />
            <Eyebrow index="404" className="mt-12">
              Fuera de ruta
            </Eyebrow>
            <h1 className="mt-8 text-h2 font-light text-white">
              Esta puerta{' '}
              <span className="font-serif font-normal tracking-normal italic">no existe.</span>
            </h1>
            <p className="mt-6 text-lead text-gray">La página que buscas no está disponible.</p>
            <Link
              to="/"
              className="mt-10 inline-flex h-12 items-center rounded-pill bg-red px-8 text-nav font-medium tracking-[0.16em] text-white uppercase transition-colors duration-(--duration-micro) hover:bg-red-bright"
            >
              Volver al inicio
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
