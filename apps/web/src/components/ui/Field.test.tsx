// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Field } from './Field'
import { Input } from './Input'

afterEach(cleanup)

describe('Field', () => {
  it('connects the label to the control', () => {
    render(
      <Field id="email" label="Email Address" required>
        {(p) => <Input {...p} />}
      </Field>,
    )
    const input = screen.getByLabelText(/Email Address/)
    expect(input.id).toBe('email')
    expect(input.hasAttribute('required')).toBe(true)
  })

  it('marks the control invalid and describes it with the error', () => {
    render(
      <Field id="email" label="Email" hint="We reply within a day" error="Enter a valid email">
        {(p) => <Input {...p} />}
      </Field>,
    )
    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe('email-error')
    expect(screen.getByText('Enter a valid email').id).toBe('email-error')
    // the hint is replaced by the error
    expect(screen.queryByText('We reply within a day')).toBeNull()
  })
})
