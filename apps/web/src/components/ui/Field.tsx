import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Label } from './Label'

export type FieldControlProps = {
  id: string
  required?: boolean
  'aria-invalid'?: true
  'aria-describedby'?: string
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  /** Render the control with the ids and aria attributes the field wires up. */
  children: (control: FieldControlProps) => ReactNode
}

/** Label + control + hint/error, with the accessibility attributes connected. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  // The error replaces the hint, so only one of them is ever rendered and referenced.
  const hintId = hint && !error ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children({
        id,
        required,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hintId && (
        <p id={hintId} className="text-xs text-fg-quaternary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-error-600">
          {error}
        </p>
      )}
    </div>
  )
}
