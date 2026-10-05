/** `tel:` link from a display number like "+20 123 456 789". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export const mailtoHref = (email: string) => `mailto:${email}`

/** WhatsApp click-to-chat link. `number` is digits only, with the country code. */
export const whatsappHref = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
