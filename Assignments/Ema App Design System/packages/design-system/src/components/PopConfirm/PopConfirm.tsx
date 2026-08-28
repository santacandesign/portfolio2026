import * as PopoverPrimitive from '@radix-ui/react-popover'
import React, { forwardRef, Fragment } from 'react'
import { Button } from '../Button'
import { cva } from 'class-variance-authority'

export interface PopConfirmProps {
  heading: string
  description?: string
  children: React.ReactNode
  withArrow?: boolean
  onCancel: () => void
  onConfirm: (e?: React.MouseEvent<HTMLButtonElement>) => void
  confirmText?: string
  cancelText?: string
  open?: boolean
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  onOpenChange?: (open: boolean) => void
  triggerTestId?: string
  triggerClassName?: string
  confirmButtonLoading?: boolean
  portalContainer?: PopoverPrimitive.PopoverPortalProps['container']
  portalProps?: Omit<PopoverPrimitive.PopoverPortalProps, 'container'> & {
    enabled?: boolean
  }
}

const popoverContentClasses = cva(
  'z-40 max-w-[320px] select-none rounded-lg bg-muted-accent p-3 leading-3 text-white',
  {
    variants: {
      state: {
        bottom: 'animate-slideUpAndFade',
        left: 'animate-slideRightAndFade',
        right: 'animate-slideLeftAndFade',
        top: 'animate-slideDownAndFade',
      },
    },
  }
)

export const PopConfirm = forwardRef<HTMLDivElement, PopConfirmProps>(
  (
    {
      heading,
      description,
      onOpenChange,
      open,
      onConfirm,
      onCancel,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      withArrow = false,
      side = 'bottom',
      children,
      triggerTestId = '',
      triggerClassName = '',
      confirmButtonLoading = false,
      portalContainer,
      portalProps = {},
    },
    ref
  ) => {
    const PortalComponent = portalProps.enabled
      ? PopoverPrimitive.Portal
      : Fragment

    if (portalProps.enabled) {
      Object.assign(PortalComponent, { container: portalContainer })
    }

    return (
      <PopoverPrimitive.Root onOpenChange={onOpenChange} open={open}>
        <PopoverPrimitive.Trigger asChild>
          <div className={triggerClassName} data-testid={triggerTestId}>
            {children}
          </div>
        </PopoverPrimitive.Trigger>
        <PortalComponent>
          <PopoverPrimitive.Content
            className={popoverContentClasses()}
            sideOffset={4}
            side={side}
            ref={ref}
            collisionPadding={8}
          >
            <div className='text-xs-bold'>{heading}</div>
            {description && (
              <div className='text-xs-medium mt-2 text-muted-border'>
                {description}
              </div>
            )}

            <div className='mt-2 flex gap-2'>
              <Button variant='secondary' onClick={onCancel} size='sm' block>
                {cancelText}
              </Button>
              <Button
                variant='primary'
                color='destructive'
                onClick={onConfirm}
                size='sm'
                block
                loading={confirmButtonLoading}
                data-testid='confirm-button'
              >
                {confirmText}
              </Button>
            </div>
            {withArrow && (
              <PopoverPrimitive.Arrow
                width={12}
                height={6}
                className='fill-muted-accent'
              />
            )}
          </PopoverPrimitive.Content>
        </PortalComponent>
      </PopoverPrimitive.Root>
    )
  }
)

PopConfirm.displayName = 'PopConfirm'
