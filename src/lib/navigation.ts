/** Un destino de navegación es ancla de la página si empieza por `#`. */
export function isAnchor(href: string): boolean {
  return href.startsWith('#')
}
