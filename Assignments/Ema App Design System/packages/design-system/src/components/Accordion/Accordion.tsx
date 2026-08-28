import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '../../utils/cn'

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(
      props.asChild
        ? ''
        : 'text-left hover:underline [&[data-state=open]_svg]:rotate-180',
      className
    )}
    {...props}
  />
))

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
      {...props}
    />
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export const Accordion = {
  Root: AccordionPrimitive.Root,
  Item: AccordionPrimitive.Item,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}
