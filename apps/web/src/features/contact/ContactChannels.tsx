import type { ReactNode } from 'react'

import { SectionHeading } from '@/components/layout/SectionHeading'
import { Card } from '@/components/ui/Card'
import { EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, type Icon } from '@/components/ui/icons'
import { IconCircle } from '@/components/ui/IconCircle'
import { mapQuery, mapsSearchHref, telHref } from '@/lib/contact-links'
import type { ContactPage, SiteSetting } from '@/payload-types'
import { messages } from '@/messages/en'

type ContactChannelsProps = {
  channels: ContactPage['channels']
  settings: SiteSetting
}

const linkClass =
  'focus-ring w-fit rounded-xs text-sm text-fg-secondary underline-offset-4 hover:text-brand-600 hover:underline'

export function ContactChannels({ channels, settings }: ContactChannelsProps) {
  return (
    <div className="flex flex-col gap-12">
      <SectionHeading align="center" eyebrow={channels.eyebrow} title={channels.title} />
      <ul className="grid gap-6 md:grid-cols-3">
        <Channel icon={PhoneIcon} title={channels.phoneTitle}>
          <a href={telHref(settings.phone)} className={linkClass}>
            {settings.phone}
          </a>
          <p className="text-sm text-fg-tertiary">{settings.workingHours}</p>
        </Channel>
        <Channel icon={EnvelopeSimpleIcon} title={channels.emailTitle}>
          <p className="text-sm text-fg-secondary">{settings.email}</p>
          {channels.emailNote && <p className="text-sm text-fg-tertiary">{channels.emailNote}</p>}
        </Channel>
        <Channel icon={MapPinIcon} title={channels.addressTitle}>
          <address className="flex flex-col not-italic">
            <a
              href={mapsSearchHref(mapQuery(settings))}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {settings.address.street}
              <span className="sr-only"> {messages.common.opensInNewTab}</span>
            </a>
            <span className="text-sm text-fg-tertiary">{settings.address.country}</span>
          </address>
        </Channel>
      </ul>
    </div>
  )
}

function Channel({ icon, title, children }: { icon: Icon; title: string; children: ReactNode }) {
  return (
    <Card as="li" variant="plain" className="flex min-h-55 flex-col gap-6 p-8">
      <IconCircle icon={icon} />
      <div className="flex flex-col gap-1">
        <h3 className="text-md font-semibold text-fg-primary">{title}</h3>
        {children}
      </div>
    </Card>
  )
}
