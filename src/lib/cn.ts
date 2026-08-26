import clsx, { type ClassValue } from 'clsx'

/** Une clases condicionalmente. Único helper de clases del proyecto. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
