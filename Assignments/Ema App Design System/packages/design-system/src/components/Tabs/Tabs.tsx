import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef } from 'react'
import { TabsContext } from './context'
import { TabsSize, TabsVariant } from './type'

interface TabsRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    'className'
  > {
  size?: TabsSize
  variant?: TabsVariant
  fullWidth?: boolean
}

export const TabsRoot = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  TabsRootProps
>(
  (
    { size = 'md', variant = 'underline', fullWidth = false, ...props },
    ref
  ) => {
    return (
      <TabsContext.Provider value={{ size, variant, fullWidth }}>
        <TabsPrimitive.Root
          {...props}
          ref={ref}
          className='flex h-full flex-col'
        />
      </TabsContext.Provider>
    )
  }
)

TabsRoot.displayName = TabsPrimitive.Root.displayName
