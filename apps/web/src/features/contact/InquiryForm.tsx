'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { messages } from '@/messages/en'

type InquiryFormProps = {
  /** Prefix for field ids, so two forms can never clash on one page. */
  id?: string
  defaultSubject?: string
  className?: string
}

/**
 * The inquiry form UI. Phase 5 wires up the server action, validation messages, spam
 * protection, and the product prefill; until then submitting does nothing.
 */
export function InquiryForm({ id = 'inquiry', defaultSubject, className }: InquiryFormProps) {
  const t = messages.form

  return (
    <Card variant="muted" className={cn('rounded-md p-6 md:p-10', className)}>
      <form
        noValidate
        onSubmit={(event) => event.preventDefault()}
        aria-labelledby={`${id}-title`}
        className="flex flex-col gap-6"
      >
        <h2
          id={`${id}-title`}
          className="font-display text-display-xs text-fg-primary md:text-display-sm"
        >
          {t.title}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field id={`${id}-name`} label={t.name} required>
              {(field) => (
                <Input {...field} name="name" autoComplete="name" placeholder={t.namePlaceholder} />
              )}
            </Field>
            <Field id={`${id}-email`} label={t.email} required>
              {(field) => (
                <Input
                  {...field}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                />
              )}
            </Field>
          </div>
          <Field id={`${id}-subject`} label={t.subject} required>
            {(field) => (
              <Input
                {...field}
                name="subject"
                defaultValue={defaultSubject}
                placeholder={t.subjectPlaceholder}
              />
            )}
          </Field>
          <Field id={`${id}-message`} label={t.message} required>
            {(field) => (
              <Textarea {...field} name="message" rows={3} placeholder={t.messagePlaceholder} />
            )}
          </Field>
        </div>
        <Button type="submit" fullWidth trailingIcon={ArrowUpRightIcon}>
          {t.submit}
        </Button>
      </form>
    </Card>
  )
}
