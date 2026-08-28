import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const checkboxVariants = cva(
  [
    'cursor-pointer rounded appearance-none relative',
    'border border-disabled-border',
    'hover:border-brand-secondaryMuted disabled:hover:border-disabled-border',
    'checked:!bg-brand-primary checked:border-transparent',
    'indeterminate:!bg-white indeterminate:border-2 indeterminate:border-brand-primary indeterminate:hover:border-2 indeterminate:hover:border-brand-primary',
    '[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:shadow-none',
    'disabled:cursor-not-allowed',
    'disabled:bg-disabled-bg disabled:border-disabled-border',
    'disabled:checked:!bg-disabled-border disabled:checked:border-transparent',
    'disabled:indeterminate:!bg-white disabled:indeterminate:border-2 disabled:indeterminate:border-disabled-border',
    'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2',
    'indeterminate:after:block indeterminate:after:w-[10px] indeterminate:after:h-[2px] indeterminate:after:bg-brand-primary',
    'disabled:indeterminate:after:bg-disabled-border',
  ],
  {
    variants: {
      size: {
        md: 'h-5 w-5', // 20px
        sm: 'h-4 w-4', // 16px
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface CheckboxProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'className' | 'size'
    >,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, size, onChange, disabled, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(forwardedRef, () => internalRef.current!, [])

    // useLayoutEffect ensures the indeterminate DOM property is set synchronously
    // before the browser paints, preventing a visual flash of stale state.
    React.useLayoutEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate])

    return (
      // eslint-disable-next-line react/forbid-elements
      <input
        ref={internalRef}
        type='checkbox'
        disabled={disabled}
        onChange={onChange}
        {...props}
        className={cn(checkboxVariants({ size }))}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'
