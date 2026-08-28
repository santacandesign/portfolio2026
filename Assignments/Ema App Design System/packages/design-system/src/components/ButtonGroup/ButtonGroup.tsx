'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../../utils/cva'
import { cn } from '../../utils/cn'

const buttonGroupVariants = cva(
  'inline-flex [&>*:not(:first-child):not(:last-child)]:rounded-none',
  {
    variants: {
      orientation: {
        horizontal:
          'flex-row [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:-ml-px',
        vertical:
          'flex-col [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:-mt-px',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof buttonGroupVariants>

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role='group'
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
)
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup, buttonGroupVariants }
export type { ButtonGroupProps }
