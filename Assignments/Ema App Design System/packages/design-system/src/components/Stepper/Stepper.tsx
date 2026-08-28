'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../../utils/cva'
import { cn } from '../../utils/cn'
import { StepperContext, useStepperContext } from './context'
import { StepperSize } from './type'

const stepperRootVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

interface StepperRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperRootVariants> {
  activeStep?: number
  onStepChange?: (step: number) => void
  size?: StepperSize
}

const StepperRoot = React.forwardRef<HTMLDivElement, StepperRootProps>(
  (
    {
      orientation = 'horizontal',
      size = 'md',
      activeStep = 0,
      onStepChange,
      className,
      ...props
    },
    ref
  ) => (
    <StepperContext.Provider
      value={{ orientation: orientation ?? undefined, size, activeStep, onStepChange }}
    >
      <div
        ref={ref}
        role='list'
        data-orientation={orientation}
        className={cn(stepperRootVariants({ orientation }), className)}
        {...props}
      />
    </StepperContext.Provider>
  )
)
StepperRoot.displayName = 'StepperRoot'

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  completed?: boolean
  disabled?: boolean
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ step, completed = false, disabled = false, className, ...props }, ref) => {
    const { activeStep, orientation } = useStepperContext()
    const isActive = step === activeStep
    const isPast = step < (activeStep ?? 0)
    const isCompleted = completed || isPast

    return (
      <div
        ref={ref}
        role='listitem'
        data-step={step}
        data-active={isActive || undefined}
        data-completed={isCompleted || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'items-center' : 'flex-col',
          className
        )}
        {...props}
      />
    )
  }
)
StepperItem.displayName = 'StepperItem'

const stepIndicatorSizeMap = {
  sm: 'h-6 w-6 text-xs-bold',
  md: 'h-8 w-8 text-sm-bold',
  lg: 'h-10 w-10 text-base-bold',
} as const

interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  step: number
  icon?: React.ReactNode
  label?: string
  description?: string
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ step, icon, label, description, className, disabled, ...props }, ref) => {
    const { activeStep, onStepChange, size = 'md', orientation } = useStepperContext()
    const isActive = step === activeStep
    const isPast = step < (activeStep ?? 0)

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        aria-current={isActive ? 'step' : undefined}
        className={cn(
          'flex items-center gap-2 outline-none transition-colors',
          orientation === 'vertical' && 'flex-row',
          'disabled:cursor-not-allowed disabled:text-beige-800',
          className
        )}
        onClick={() => {
          if (!disabled) onStepChange?.(step)
        }}
        {...props}
      >
        <span
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full transition-colors',
            stepIndicatorSizeMap[size],
            isActive && 'bg-brand-primary text-white',
            isPast && 'bg-green-200 text-green-800',
            !isActive && !isPast && 'bg-beige-200 text-beige-800'
          )}
        >
          {icon ??
            (isPast ? (
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
            ) : (
              step + 1
            ))}
        </span>
        {(label || description) && (
          <div className='flex flex-col items-start text-left'>
            {label && (
              <span
                className={cn(
                  'text-sm-medium',
                  isActive ? 'text-app-foreground' : 'text-gray-900'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span className='text-xs-normal text-gray-800'>
                {description}
              </span>
            )}
          </div>
        )}
      </button>
    )
  }
)
StepperTrigger.displayName = 'StepperTrigger'

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ step, className, ...props }, ref) => {
    const { activeStep } = useStepperContext()

    if (step !== activeStep) return null

    return (
      <div
        ref={ref}
        role='tabpanel'
        data-step={step}
        className={cn('mt-4', className)}
        {...props}
      />
    )
  }
)
StepperContent.displayName = 'StepperContent'

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useStepperContext()

  return (
    <div
      ref={ref}
      role='separator'
      className={cn(
        'bg-beige-300',
        orientation === 'horizontal' ? 'mx-2 h-px flex-1' : 'ml-4 mt-1 mb-1 w-px self-stretch min-h-[16px]',
        className
      )}
      {...props}
    />
  )
})
StepperSeparator.displayName = 'StepperSeparator'

export {
  StepperRoot,
  StepperItem,
  StepperTrigger,
  StepperContent,
  StepperSeparator,
  stepperRootVariants,
}
export type {
  StepperRootProps,
  StepperItemProps,
  StepperTriggerProps,
  StepperContentProps,
}
