import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '../../utils'

const hintTextVariants = cva([''], {
  variants: {
    size: {
      lg: 'text-xs-normal',
      md: 'text-[0.6875rem] leading-3',
      sm: 'text-[0.6875rem] leading-3',
    },
    state: {
      default: 'text-muted-accent',
      success: 'text-success-accent',
      error: 'text-error-accentDark',
    },
    ghost: {
      true: 'opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
    ghost: false,
  },
})

export const InputHintText = ({
  size,
  state,
  hintText,
  id,
  ghost = false,
}: {
  id: string
  hintText: React.ReactNode
  ghost?: boolean
} & VariantProps<typeof hintTextVariants>) => {
  return (
    <div className={cn(hintTextVariants({ size, state, ghost }))} id={id}>
      {hintText}
    </div>
  )
}
