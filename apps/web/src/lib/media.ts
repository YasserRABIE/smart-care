import type { Media } from '@/payload-types'

export type ImageData = { src: string; width: number; height: number; alt: string }

/**
 * Props for next/image from a populated upload field. Payload returns absolute URLs (serverURL);
 * we keep only the path so next/image treats them as local (`images.localPatterns`).
 */
export function toImage(media: number | Media | null | undefined): ImageData | null {
  if (!media || typeof media === 'number' || !media.url) return null
  const src = media.url.startsWith('/') ? media.url : new URL(media.url).pathname
  return {
    src,
    width: media.width ?? 1200,
    height: media.height ?? 800,
    alt: media.alt ?? '',
  }
}

/** Resolve a relationship that may or may not be populated. */
export function populated<T extends { id: number }>(
  value: number | T | null | undefined,
): T | null {
  return value && typeof value === 'object' ? value : null
}
