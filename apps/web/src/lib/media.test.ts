import { describe, expect, it } from 'vitest'

import type { Media } from '@/payload-types'

import { populated, toImage } from './media'

const media = {
  id: 1,
  alt: 'Scissors',
  url: 'http://localhost:3000/api/media/file/product-scissors.jpg',
  width: 1024,
  height: 1024,
} as Media

describe('toImage', () => {
  it('turns an absolute Payload URL into a local path', () => {
    expect(toImage(media)).toEqual({
      src: '/api/media/file/product-scissors.jpg',
      width: 1024,
      height: 1024,
      alt: 'Scissors',
    })
  })

  it('keeps relative URLs', () => {
    expect(toImage({ ...media, url: '/api/media/file/a.jpg' })?.src).toBe('/api/media/file/a.jpg')
  })

  it('returns null for unpopulated or missing media', () => {
    expect(toImage(3)).toBeNull()
    expect(toImage(null)).toBeNull()
    expect(toImage({ ...media, url: null })).toBeNull()
  })
})

describe('populated', () => {
  it('returns populated docs and drops bare ids', () => {
    expect(populated({ id: 2, title: 'Urology' })).toEqual({ id: 2, title: 'Urology' })
    expect(populated(2)).toBeNull()
  })
})
