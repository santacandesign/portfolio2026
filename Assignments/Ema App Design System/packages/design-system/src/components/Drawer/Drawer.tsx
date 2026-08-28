'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { DrawerContext, DrawerSize, useDrawerContext } from './context'

interface DrawerRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    'className'
  > {
  size?: DrawerSize
}

const DrawerRoot = ({ size = 'md', children, ...props }: DrawerRootProps) => {
  return (
    <DrawerContext.Provider value={{ size }}>
      <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'

const DrawerTrigger = DialogPrimitive.Trigger

const DrawerPortal = DialogPrimitive.Portal

const DrawerClose = DialogPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-[28] bg-black/40', className)}
    {...props}
  />
))
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName

const drawerContentVariants = cva(
  'fixed z-[28] flex h-full flex-col bg-white border border-brand-secondaryBorder shadow-xl overflow-hidden inset-y-0 right-0 border-l-0 rounded-l-xl rounded-r-none',
  {
    variants: {
      size: {
        sm: 'w-[90vw] sm:w-[25vw] min-w-80 max-w-96 sm:min-w-80 sm:max-w-2xl',
        md: 'w-[90vw] sm:w-[35vw] min-w-80 max-w-2xl sm:min-w-96 sm:max-w-3xl',
        lg: 'w-[95vw] sm:w-[45vw] min-w-96 max-w-4xl sm:min-w-96 sm:max-w-4xl',
        xl: 'w-[95vw] sm:w-[60vw] min-w-96 max-w-6xl sm:min-w-[30vw] sm:max-w-6xl',
        full: 'w-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  overlay?: boolean
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ size: propSize, className, children, overlay = true, ...props }, ref) => {
  const context = useDrawerContext()
  const size = propSize || context.size || 'md'

  return (
    <DrawerPortal>
      {overlay && <DrawerOverlay />}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(drawerContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = 'DrawerContent'

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('header-5-bold text-app-foreground', className)}
    {...props}
  />
))
DrawerTitle.displayName = DialogPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm-normal text-muted-accent break-words', className)}
    {...props}
  />
))
DrawerDescription.displayName = DialogPrimitive.Description.displayName

export type { DrawerRootProps, DrawerContentProps }

export {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
}
