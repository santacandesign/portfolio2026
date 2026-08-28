import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

import { cn } from '../../utils/cn'

const textLinkVariants = cva(
  [
    'relative inline-flex items-center cursor-pointer',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      disabled: {
        true: 'pointer-events-none',
        false: '',
      },
      color: {
        brand: '',
        blue: '',
      },
      size: {
        sm: 'text-xs-bold gap-x-1 [&_svg]:size-3.5',
        md: 'text-sm-bold gap-x-1.5 [&_svg]:size-4',
        lg: 'text-base-bold gap-x-2 [&_svg]:size-4',
        inline: 'text-sm gap-x-1 [&_svg]:size-4',
      },
    },
    compoundVariants: [
      {
        disabled: true,
        className: 'text-brand-secondaryMuted',
      },
      {
        disabled: false,
        color: 'brand',
        className: 'text-brand-primary hover:underline',
      },
      {
        disabled: false,
        color: 'blue',
        className: 'text-info hover:text-info-accent',
      },
    ],
    defaultVariants: {
      size: 'md',
      disabled: false,
      color: 'brand',
    },
  }
)

type AnchorLikeProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'className'
> & { href: string }

type ButtonLikeProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
>

export type TextLinkProps = (AnchorLikeProps | ButtonLikeProps) &
  VariantProps<typeof textLinkVariants> & {
    disabled?: boolean
  }

const TextLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  TextLinkProps
>(({ size, color, disabled = false, children, ...props }, ref) => {
  const className = cn(textLinkVariants({ size, color, disabled }))

  if ('href' in props && typeof props.href === 'string') {
    const { onClick, href, ...rest } = props as AnchorLikeProps
    return (
      <a
        className={className}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          onClick?.(e)
        }}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const { type, ...rest } = props as ButtonLikeProps
  return (
    // eslint-disable-next-line react/forbid-elements
    <button
      className={className}
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type || 'button'}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})
TextLink.displayName = 'TextLink'

export { TextLink, textLinkVariants }

