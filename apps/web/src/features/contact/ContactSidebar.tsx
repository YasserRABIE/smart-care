import { Eyebrow } from '@/components/ui/Eyebrow'
import { CheckIcon } from '@/components/ui/icons'
import type { ContactPage } from '@/payload-types'

export function ContactSidebar({ intro }: { intro: ContactPage['intro'] }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Eyebrow>{intro.eyebrow}</Eyebrow>
        <h2 className="font-display text-display-sm text-fg-primary md:text-display-md">
          {intro.title}
        </h2>
        <p className="text-md text-fg-secondary">{intro.body}</p>
      </div>
      {intro.expectations && intro.expectations.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl bg-brand-50 p-6">
          <h3 className="text-sm font-semibold text-brand-600 uppercase">{intro.expectTitle}</h3>
          <ul className="flex flex-col gap-4">
            {intro.expectations.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm text-fg-secondary">
                <CheckIcon aria-hidden size={18} className="shrink-0 text-brand-600" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
