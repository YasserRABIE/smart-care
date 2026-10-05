import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import {
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  type Icon,
} from '@/components/ui/icons'
import { InquiryForm } from '@/features/contact/InquiryForm'
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact-links'
import { env } from '@/lib/env'
import type { HomePage, SiteSetting } from '@/payload-types'
import { messages } from '@/messages/en'

type GetInTouchProps = {
  sections: HomePage['sections']
  settings: SiteSetting
}

const linkClass = 'focus-ring rounded-xs underline-offset-4 hover:text-brand-600 hover:underline'

export function GetInTouch({ sections, settings }: GetInTouchProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-[27.5rem_1fr] lg:gap-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-display-md text-fg-primary md:text-display-lg">
            {sections.contactTitle}
          </h2>
          <p className="max-w-105 text-md text-fg-secondary md:text-lg">{sections.contactIntro}</p>
        </div>
        <ul className="flex flex-col gap-4 text-md text-fg-secondary">
          <ContactRow icon={MapPinIcon}>
            {settings.address.city}, {settings.address.country}
          </ContactRow>
          <ContactRow icon={EnvelopeSimpleIcon}>
            <a href={mailtoHref(settings.email)} className={linkClass}>
              {settings.email}
            </a>
          </ContactRow>
          <ContactRow icon={PhoneIcon}>
            <a href={telHref(settings.phone)} className={linkClass}>
              {settings.phone}
            </a>
          </ContactRow>
        </ul>
        <Button
          href={whatsappHref(settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          variant="link"
          trailingIcon={ArrowUpRightIcon}
          className="w-fit py-4"
        >
          {sections.whatsappLabel}
          <span className="sr-only"> {messages.common.opensInNewTab}</span>
        </Button>
      </div>
      <InquiryForm id="home-inquiry" sourcePage="/" turnstileSiteKey={env.TURNSTILE_SITE_KEY} />
    </div>
  )
}

function ContactRow({ icon: IconComponent, children }: { icon: Icon; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <IconComponent aria-hidden size={24} className="shrink-0 text-fg-tertiary" />
      <span>{children}</span>
    </li>
  )
}
