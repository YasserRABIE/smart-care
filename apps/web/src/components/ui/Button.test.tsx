// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Button } from './Button'
import { ArrowUpRightIcon } from './icons'

afterEach(cleanup)

describe('Button', () => {
  it('renders a type="button" by default', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.getAttribute('type')).toBe('button')
  })

  it('renders an internal link when given an href', () => {
    render(<Button href="/contact">Contact</Button>)
    const link = screen.getByRole('link', { name: 'Contact' })
    expect(link.getAttribute('href')).toBe('/contact')
  })

  it('renders a plain anchor for external, mailto and tel links', () => {
    render(
      <Button href="https://wa.me/20123" target="_blank" rel="noopener noreferrer">
        WhatsApp
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'WhatsApp' })
    expect(link.getAttribute('href')).toBe('https://wa.me/20123')
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('hides decorative icons from assistive tech', () => {
    const { container } = render(<Button trailingIcon={ArrowUpRightIcon}>Send</Button>)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
