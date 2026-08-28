import * as TabsPrimitive from '@radix-ui/react-tabs'
import classNames from 'classnames'
import { forwardRef } from 'react'
import { useTabsContext } from './context'

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

const PILL_GAP_MAP = {
  sm: 'gap-x-1.5',
  md: 'gap-x-2',
  lg: 'gap-x-3',
} as const

export const TabsList = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => {
  const {
    variant = 'underline',
    fullWidth = false,
    size = 'md',
  } = useTabsContext()

  const widthClass = fullWidth ? 'w-full' : 'w-fit'

  let baseClasses: string
  if (variant === 'button') {
    baseClasses = `inline-flex ${widthClass} shrink-0 gap-x-1 rounded-md border border-disabled-border bg-brand-secondaryHover p-0.5`
  } else if (variant === 'pill') {
    baseClasses = `flex ${widthClass} shrink-0 ${PILL_GAP_MAP[size]}`
  } else {
    baseClasses = `flex ${widthClass} shrink-0 gap-x-2 pt-2 border-b border-brand-secondaryBorder`
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={classNames(baseClasses, className)}
      {...props}
    />
  )
})

TabsList.displayName = TabsPrimitive.List.displayName
