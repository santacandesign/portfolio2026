import { cva, type VariantProps } from 'class-variance-authority'
import classNames from 'classnames'
import { forwardRef } from 'react'

import { cn } from '../../utils/cn'
import IconComponent from '../../icons/IconComponent'

const switchVariants = cva(
  [
    'peer rounded-full',
    'after:absolute after:left-[2px] after:top-0.5',
    'after:rounded-full after:bg-white',
    "after:transition-all after:content-['']",
    'peer-checked:after:translate-x-full peer-checked:after:left-[6px]',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-brand-secondaryMuted hover:bg-unresolved-accent peer-checked:bg-brand-primary peer-checked:hover:bg-brand-primaryAccent',
        orange:
          'bg-warning hover:bg-warning-accent peer-checked:bg-brand-primary peer-checked:hover:bg-brand-primaryAccent',
      },
      disabled: {
        true: 'cursor-not-allowed !bg-disabled-border !hover:bg-disabled-border after:bg-muted',
        false: 'cursor-pointer',
      },
      checked: {
        true: 'peer-checked:after:translate-x-full',
        false: 'peer-checked:after:translate-x-0',
      },
      size: {
        lg: '!h-5 !w-10 after:h-4 after:w-4',
        md: '!h-4 !w-8 after:h-3 after:w-3',
      },
    },
    compoundVariants: [
      {
        checked: true,
        disabled: true,
        className: '!bg-brand-primary peer-checked:after:bg-white',
      },
      {
        checked: false,
        disabled: true,
        variant: 'orange',
        className:
          '!bg-warning-bg after:bg-warning-bgSubtle peer-checked:after:bg-warning-bgSubtle',
      },
    ],
    defaultVariants: {
      variant: 'default',
      checked: false,
      disabled: false,
      size: 'md',
    },
  }
)

export interface SwitchProps extends VariantProps<typeof switchVariants> {
  checked: boolean
  onChange: (value: boolean) => void
  variant?: 'default' | 'orange'
  size?: 'lg' | 'md'
  disabled?: boolean
  id?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked = false,
    disabled = false,
    onChange,
    variant = 'default',
    id,
    size = 'md',
  },
  ref
) {
  return (
    <div
      className={classNames(
        'flex min-w-fit items-center justify-center overflow-hidden',
        disabled && 'opacity-75'
      )}
    >
      <div className='flex'>
        <label className={'relative inline-flex cursor-pointer items-center'}>
          {disabled && (
            <IconComponent
              name='LockKey'
              color={
                checked
                  ? 'brand-primary'
                  : variant === 'orange'
                    ? 'warning-bgSubtle'
                    : 'muted'
              }
              weight='fill'
              size='xs'
              className={classNames(
                'absolute',
                'cursor-not-allowed',
                checked ? 'left-1' : 'right-1'
              )}
            />
          )}
          {/* eslint-disable-next-line react/forbid-elements */}
          <input
            type='checkbox'
            className={`peer sr-only ${disabled ? 'cursor-not-allowed' : ''}`}
            checked={checked}
            readOnly
            disabled={disabled}
            id={id}
            ref={ref}
          />
          <div
            onClick={() => {
              if (disabled) return
              onChange(!checked)
            }}
            data-testid='toggle-switch'
            className={cn(switchVariants({ checked, variant, disabled, size }))}
          />
        </label>
      </div>
    </div>
  )
})
