import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import type { Icon } from './icons'

export const buttonVariants = cva(
  'focus-ring inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700',
        pill: 'border border-line bg-white text-fg-primary hover:bg-surface-muted',
        ghost: 'text-white hover:bg-white/10',
        outline: 'border border-line bg-white text-fg-secondary hover:bg-surface-muted',
        link: 'group text-brand-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 gap-2 px-3.5 text-sm',
        md: 'h-13 gap-2 px-8 text-md',
        lg: 'h-14 gap-2.5 px-6 text-md',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  leadingIcon?: Icon
  trailingIcon?: Icon
  className?: string
  children: ReactNode
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonOwnProps> & { href?: undefined }

type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonOwnProps | 'href'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const EXTERNAL_HREF = /^(https?:|mailto:|tel:)/

/** Renders a `<button>`, or a link when `href` is given (`<a>` for external/mailto/tel). */
export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    fullWidth,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    className,
    children,
    ...rest
  } = props
  const iconSize = size === 'sm' ? 16 : 24
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className)
  const content = (
    <>
      {LeadingIcon && <LeadingIcon aria-hidden size={iconSize} className="shrink-0" />}
      {children}
      {TrailingIcon && (
        <TrailingIcon
          aria-hidden
          size={iconSize}
          className="shrink-0 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      )}
    </>
  )

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest as Omit<ButtonAsLink, keyof ButtonOwnProps>
    if (EXTERNAL_HREF.test(href)) {
      const { prefetch: _prefetch, replace: _replace, scroll: _scroll, ...anchorProps } = linkProps
      return (
        <a href={href} className={classes} {...(anchorProps as ComponentPropsWithoutRef<'a'>)}>
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = rest as Omit<ButtonAsButton, keyof ButtonOwnProps>
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
