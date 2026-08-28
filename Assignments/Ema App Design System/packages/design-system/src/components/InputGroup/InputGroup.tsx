'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../../utils/cva'
import { cn } from '../../utils/cn'

const inputGroupVariants = cva(
  'flex items-stretch [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:focus]:z-10',
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

type InputGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupVariants>

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      role='group'
      className={cn(inputGroupVariants({ size }), className)}
      {...props}
    />
  )
)
InputGroup.displayName = 'InputGroup'

const inputGroupAddonVariants = cva(
  'inline-flex items-center border border-beige-500 bg-beige-100 px-3 text-sm-normal text-gray-900',
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-xs-normal',
        md: 'h-9 px-3 text-sm-normal',
        lg: 'h-11 px-3.5 text-base-normal',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

type InputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof inputGroupAddonVariants>

const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  ({ className, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(inputGroupAddonVariants({ size }), className)}
      {...props}
    />
  )
)
InputGroupAddon.displayName = 'InputGroupAddon'

export {
  InputGroup,
  InputGroupAddon,
  inputGroupVariants,
  inputGroupAddonVariants,
}
export type { InputGroupProps, InputGroupAddonProps }
