'use client'

import {
  inquiryFieldErrors,
  inquirySchema,
  type InquiryFieldErrors,
  type InquiryInput,
} from '@smart-care/shared'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { CheckIcon, WhatsappLogoIcon, XIcon } from '@/components/ui/icons'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { messages } from '@/messages/en'

import { inquiryWhatsappHref, type InquiryProduct } from './whatsapp-message'

export type InquiryFormProps = {
  /** Prefix for field ids, so two forms can never clash on one page. */
  id?: string
  /** WhatsApp number from Site Settings: digits only, with the country code. */
  whatsappNumber: string
  /** Path of the page hosting the form; "remove product" links back to it. */
  sourcePage: string
  /** Product from `/contact?product=`, added to the message. */
  product?: InquiryProduct | null
  defaultSubject?: string
  className?: string
}

type View =
  | { status: 'editing'; values?: InquiryInput }
  | { status: 'opened'; href: string; values: InquiryInput }

export function InquiryForm({ className, ...props }: InquiryFormProps) {
  // Bumping the key remounts the form with fresh state ("Start a new message").
  const [formKey, setFormKey] = useState(0)
  return (
    <Card variant="muted" className={cn('rounded-md p-6 md:p-10', className)}>
      <InquiryFormInner key={formKey} {...props} onReset={() => setFormKey((key) => key + 1)} />
    </Card>
  )
}

function InquiryFormInner({
  id = 'inquiry',
  whatsappNumber,
  sourcePage,
  product,
  defaultSubject,
  onReset,
}: Omit<InquiryFormProps, 'className'> & { onReset: () => void }) {
  const t = messages.form
  const [view, setView] = useState<View>({ status: 'editing' })
  const [errors, setErrors] = useState<InquiryFieldErrors>({})
  const statusRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (view.status === 'opened') statusRef.current?.focus()
  }, [view.status])

  if (view.status === 'opened') {
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
          {t.openedTitle}
        </h2>
        <p className="text-md text-fg-secondary">{t.openedBody}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button
            href={view.href}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            leadingIcon={WhatsappLogoIcon}
          >
            {t.openAgain}
            <span className="sr-only"> {messages.common.opensInNewTab}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView({ status: 'editing', values: view.values })}
          >
            {t.editMessage}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            {t.startNew}
          </Button>
        </div>
      </div>
    )
  }

  const values = view.values

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        const result = inquirySchema.safeParse(Object.fromEntries(new FormData(form)))
        if (!result.success) {
          const fieldErrors = inquiryFieldErrors(result.error)
          setErrors(fieldErrors)
          focusFirstError(form, fieldErrors)
          return
        }
        setErrors({})
        const href = inquiryWhatsappHref(whatsappNumber, result.data, product)
        // Opened from the submit gesture, so popup blockers allow it. The confirmation keeps a
        // link in case it did not open.
        window.open(href, '_blank', 'noopener,noreferrer')
        setView({ status: 'opened', href, values: result.data })
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
        <p className="text-md text-fg-secondary">{t.intro}</p>
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
          <Field id={`${id}-email`} label={t.email} error={errors.email}>
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

      <Button type="submit" fullWidth leadingIcon={WhatsappLogoIcon}>
        {t.submit}
        <span className="sr-only"> {messages.common.opensInNewTab}</span>
      </Button>
    </form>
  )
}

function focusFirstError(form: HTMLFormElement, errors: InquiryFieldErrors) {
  const first = (['name', 'email', 'subject', 'message'] as const).find((field) => errors[field])
  if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
}
