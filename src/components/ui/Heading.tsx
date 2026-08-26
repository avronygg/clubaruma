import { cn } from '@/lib/cn'

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3'
  size?: 'display' | 'h2' | 'h3'
  /** Parte neutra del titular, en sans. */
  lead: string
  /** Palabra emocional, en cursiva serif y en rojo. El acento de la marca. */
  accent?: string
  align?: 'left' | 'center'
  className?: string
  id?: string
}

const sizes: Record<NonNullable<HeadingProps['size']>, string> = {
  display: 'text-display',
  h2: 'text-h2',
  h3: 'text-h3',
}

/**
 * Titular del sistema.
 *
 * Todos los titulares comparten la misma construcción: sans ligera en blanco
 * más una palabra en cursiva serif y en rojo. La mezcla de las dos familias
 * es lo que separa la pieza de una landing de discoteca y la acerca a una
 * portada editorial; el color reparte la línea entre los dos tonos de marca
 * en lugar de dejarlos en bloques separados.
 */
export function Heading({
  as: Tag = 'h2',
  size = 'h2',
  lead,
  accent,
  align = 'left',
  className,
  id,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-sans font-light text-white',
        sizes[size],
        align === 'center' && 'text-center',
        className,
      )}
    >
      {lead}
      {accent ? (
        <>
          {' '}
          <span className="title-accent">{accent}</span>
        </>
      ) : null}
    </Tag>
  )
}
