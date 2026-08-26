import { Seo } from '@/components/layout/Seo'
import { Atmosphere } from '@/components/sections/Atmosphere'
import { Cocktails } from '@/components/sections/Cocktails'
import { Experience } from '@/components/sections/Experience'
import { Gallery } from '@/components/sections/Gallery'
import { Hero } from '@/components/sections/Hero'
import { Location } from '@/components/sections/Location'
import { Music } from '@/components/sections/Music'
import { Waitlist } from '@/components/sections/Waitlist'
import { Vip } from '@/components/sections/Vip'

/**
 * Home.
 *
 * Solo compone secciones en orden. Toda decisión de contenido vive en
 * `src/data/`; toda decisión visual, dentro de cada sección.
 */
export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <Experience />
      <Cocktails />
      <Atmosphere />
      <Vip />
      <Music />
      <Gallery />
      <Location />
      <Waitlist />
    </>
  )
}
