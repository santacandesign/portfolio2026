import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React, { forwardRef } from 'react'
import { cva } from 'class-variance-authority'

export interface TooltipProps {
  heading: string
  description?: string
  children: React.ReactNode
  withArrow?: boolean
  open?: boolean
  defaultOpen?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined
  onOpenChange?: (open: boolean) => void
  triggerTestId?: string
  triggerClassName?: string
  delayDuration?: number
}

const tooltipContentClasses = cva(
  'z-40 max-w-[320px] select-none rounded-lg bg-muted-accent p-3 leading-3 text-white break-words overflow-hidden',
  {
    variants: {
      state: {
        'delayed-open:bottom': 'animate-slideUpAndFade',
        'delayed-open:left': 'animate-slideRightAndFade',
        'delayed-open:right': 'animate-slideLeftAndFade',
        'delayed-open:top': 'animate-slideDownAndFade',
      },
    },
  }
)

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      heading,
      description,
      onOpenChange,
      open,
      withArrow = true,
      side = 'bottom',
      children,
      delayDuration = 0,
      triggerTestId = '',
      triggerClassName = '',
      defaultOpen = false,
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root
          onOpenChange={onOpenChange}
          open={open}
          delayDuration={delayDuration}
          defaultOpen={defaultOpen}
        >
          <TooltipPrimitive.Trigger asChild>
            <div className={triggerClassName} data-testid={triggerTestId}>
              {children}
            </div>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className={tooltipContentClasses()}
              sideOffset={5}
              side={side}
              ref={ref}
            >
              <div className='text-xs-bold break-words'>{heading}</div>
              {description && (
                <div className='text-xs-medium mt-2 whitespace-pre-line break-words text-muted-border'>
                  {description}
                </div>
              )}
              {withArrow && (
                <TooltipPrimitive.Arrow
                  width={12}
                  height={6}
                  className='fill-muted-accent'
                />
              )}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }
)

Tooltip.displayName = 'Tooltip'
