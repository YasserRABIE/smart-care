'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { inquiryFieldErrors, inquirySchema, type InquiryFieldErrors } from '@smart-care/shared'
import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { ArrowUpRightIcon, CheckIcon, XIcon } from '@/components/ui/icons'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { messages } from '@/messages/en'

import { submitInquiry } from './actions'
import type { InquiryFormState } from './handle-inquiry'

export type InquiryFormProps = {
  /** Prefix for field ids, so two forms can never clash on one page. */
  id?: string
  /** Path of the page hosting the form, stored with the inquiry. */
  sourcePage: string
  /** Product from `/contact?product=`, attached to the inquiry. */
  product?: { slug: string; title: string } | null
  defaultSubject?: string
  /** Cloudflare Turnstile site key; omitted in local development. */
  turnstileSiteKey?: string
  className?: string
}

const initialState: InquiryFormState = { status: 'idle' }

export function InquiryForm({ className, ...props }: InquiryFormProps) {
  // Bumping the key remounts the form with fresh state ("Send another message").
  const [formKey, setFormKey] = useState(0)
  return (
    <Card variant="muted" className={cn('rounded-md p-6 md:p-10', className)}>
      <InquiryFormInner key={formKey} {...props} onReset={() => setFormKey((key) => key + 1)} />
    </Card>
  )
}

function InquiryFormInner({
  id = 'inquiry',
  sourcePage,
  product,
  defaultSubject,
  turnstileSiteKey,
  onReset,
}: Omit<InquiryFormProps, 'className'> & { onReset: () => void }) {
  const t = messages.form
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)
  const [clientErrors, setClientErrors] = useState<InquiryFieldErrors | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const statusRef = useRef<HTMLHeadingElement>(null)

  const serverErrors = state.status === 'error' ? state.fieldErrors : undefined
  const errors = clientErrors ?? serverErrors ?? {}
  const values = state.status === 'error' ? state.values : undefined

  // After a server response: tokens are single-use, so reset Turnstile on errors; move focus
  // to the first invalid field, or to the success message.
  useEffect(() => {
    if (state.status === 'error') {
      turnstileRef.current?.reset()
      focusFirstError(formRef.current, state.fieldErrors)
    }
    if (state.status === 'success') statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <CheckIcon aria-hidden size={24} />
        </span>
        <h2
          ref={statusRef}
          tabIndex={-1}
          className="font-display text-display-xs text-fg-primary outline-none md:text-display-sm"
        >
          {t.successTitle}
        </h2>
        <p className="text-md text-fg-secondary">{t.successBody}</p>
        <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
          {t.sendAnother}
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={(event) => {
        // Instant feedback with the same schema the server uses; the server still re-checks.
        const result = inquirySchema.safeParse(
          Object.fromEntries(new FormData(event.currentTarget)),
        )
        if (result.success) {
          setClientErrors(null)
          return
        }
        event.preventDefault()
        const fieldErrors = inquiryFieldErrors(result.error)
        setClientErrors(fieldErrors)
        focusFirstError(event.currentTarget, fieldErrors)
      }}
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3">
        <h2
          id={`${id}-title`}
          className="font-display text-display-xs text-fg-primary md:text-display-sm"
        >
          {t.title}
        </h2>
        {product && (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 py-1 ps-3 pe-1 text-sm text-brand-600">
            <span>
              {t.about}: <span className="font-semibold">{product.title}</span>
            </span>
            <Link
              href={sourcePage}
              scroll={false}
              aria-label={t.removeProduct}
              className="inline-flex size-6 items-center justify-center rounded-full focus-ring hover:bg-white"
            >
              <XIcon aria-hidden size={14} />
            </Link>
          </p>
        )}
      </div>

      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-md bg-error-600/10 px-4 py-3 text-sm text-error-600">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id={`${id}-name`} label={t.name} required error={errors.name}>
            {(field) => (
              <Input
                {...field}
                name="name"
                autoComplete="name"
                defaultValue={values?.name}
                placeholder={t.namePlaceholder}
              />
            )}
          </Field>
          <Field id={`${id}-email`} label={t.email} required error={errors.email}>
            {(field) => (
              <Input
                {...field}
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={values?.email}
                placeholder={t.emailPlaceholder}
              />
            )}
          </Field>
        </div>
        <Field id={`${id}-subject`} label={t.subject} required error={errors.subject}>
          {(field) => (
            <Input
              {...field}
              name="subject"
              defaultValue={values?.subject ?? defaultSubject}
              placeholder={t.subjectPlaceholder}
            />
          )}
        </Field>
        <Field id={`${id}-message`} label={t.message} required error={errors.message}>
          {(field) => (
            <Textarea
              {...field}
              name="message"
              rows={3}
              defaultValue={values?.message}
              placeholder={t.messagePlaceholder}
            />
          )}
        </Field>
      </div>

      <input type="hidden" name="sourcePage" value={sourcePage} />
      {product && <input type="hidden" name="product" value={product.slug} />}

      {/* Honeypot: off-screen and hidden from assistive tech; bots fill it, people do not. */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>{t.honeypot}</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && (
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          options={{ size: 'flexible', theme: 'light', appearance: 'interaction-only' }}
        />
      )}

      <Button
        type="submit"
        fullWidth
        trailingIcon={ArrowUpRightIcon}
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? t.sending : t.submit}
      </Button>
    </form>
  )
}

function focusFirstError(form: HTMLFormElement | null, errors: InquiryFieldErrors | undefined) {
  if (!form || !errors) return
  const first = (['name', 'email', 'subject', 'message'] as const).find((field) => errors[field])
  if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
}
