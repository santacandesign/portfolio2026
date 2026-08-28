import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { forwardRef } from 'react'

import { RadioGroupContext } from './context'

/**
 * Props for the RadioGroup component
 * @interface RadioGroupRootProps
 * @extends {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>}
 */
interface RadioGroupRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    'className'
  > {
  /**
   * Size variant of the radio group
   * @default 'md'
   */
  size?: 'sm' | 'md'
}

/**
 * A form control component that allows users to select a single option from a list of options.
 * Built on top of Radix UI's RadioGroup primitive.
 *
 * @component
 * @example
 * ```tsx
 * <RadioGroupRoot value="option1" onValueChange={(value) => console.log(value)}>
 *   <RadioGroupItem value="option1" />
 *   <RadioGroupItem value="option2" />
 * </RadioGroupRoot>
 * ```
 */
export const RadioGroupRoot = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupRootProps
>(({ size, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive.Root {...props} ref={ref} />
    </RadioGroupContext.Provider>
  )
})

RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName
