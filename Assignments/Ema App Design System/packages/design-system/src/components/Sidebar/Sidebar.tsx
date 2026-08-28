'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'
import { SidebarContext, useSidebarContext } from './context'
import { SidebarCollapsible, SidebarSide, SidebarVariant } from './type'

interface SidebarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_ICON = '4rem'

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarRootProps>(
  (
    {
      side = 'left',
      variant = 'default',
      collapsible = 'offcanvas',
      open = true,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (collapsible === 'none') {
      return (
        <SidebarContext.Provider
          value={{ side, variant, collapsible, open: true, onOpenChange }}
        >
          <aside
            ref={ref}
            className={cn(
              'flex h-full flex-col border-r border-beige-300 bg-white',
              side === 'right' && 'border-l border-r-0',
              className
            )}
            style={{ width: SIDEBAR_WIDTH }}
            data-side={side}
            data-variant={variant}
            data-state='expanded'
            {...props}
          >
            {children}
          </aside>
        </SidebarContext.Provider>
      )
    }

    const aside = (
      <aside
        ref={ref}
        className={cn(
          'flex h-full flex-col transition-[width] duration-200 ease-in-out',
          variant === 'default' && 'border-r border-beige-300 bg-white',
          variant === 'app' && 'rounded-2xl bg-gray-960',
          variant === 'inset' && 'bg-beige-100',
          side === 'right' && variant === 'default' && 'border-l border-r-0',
          !open && collapsible === 'offcanvas' && 'w-0 overflow-hidden border-0',
          variant !== 'app' && className
        )}
        style={{
          width: open
            ? SIDEBAR_WIDTH
            : collapsible === 'icon'
              ? SIDEBAR_WIDTH_ICON
              : undefined,
        }}
        data-side={side}
        data-variant={variant}
        data-collapsible={collapsible}
        data-state={open ? 'expanded' : 'collapsed'}
        {...props}
      >
        {children}
      </aside>
    )

    return (
      <SidebarContext.Provider
        value={{ side, variant, collapsible, open, onOpenChange }}
      >
        {variant === 'app' ? (
          <div className={cn('h-full py-2 pl-2', className)}>
            {aside}
          </div>
        ) : (
          aside
        )}
      </SidebarContext.Provider>
    )
  }
)
SidebarRoot.displayName = 'SidebarRoot'

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, collapsible, variant } = useSidebarContext()
  const isIconMode = !open && collapsible === 'icon'

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 px-4 py-3',
        variant === 'app' && 'text-white',
        isIconMode && 'justify-center px-0 [&>span]:hidden',
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, collapsible } = useSidebarContext()
  const isIconMode = !open && collapsible === 'icon'

  return (
    <div
      ref={ref}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto py-2',
        isIconMode ? 'flex flex-col items-center px-1' : 'px-3',
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, collapsible, variant } = useSidebarContext()
  const isIconMode = !open && collapsible === 'icon'

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-0.5 border-t py-2',
        variant === 'app' ? 'border-gray-930' : 'border-beige-300',
        isIconMode ? 'items-center px-1 [&>span]:hidden' : 'px-3',
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = 'SidebarFooter'

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1 py-2', className)}
    {...props}
  />
))
SidebarGroup.displayName = 'SidebarGroup'

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { open, collapsible, variant } = useSidebarContext()
  const isIconMode = !open && collapsible === 'icon'

  if (isIconMode) return null

  return (
    <div
      ref={ref}
      className={cn(
        'px-2 py-1 text-xs-label',
        variant === 'app' ? 'text-gray-700' : 'text-beige-800',
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
))
SidebarGroupContent.displayName = 'SidebarGroupContent'

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
))
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
SidebarMenuItem.displayName = 'SidebarMenuItem'

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, active = false, children, ...props }, ref) => {
  const { open, collapsible, variant } = useSidebarContext()
  const isIconMode = !open && collapsible === 'icon'
  const isApp = variant === 'app'
  const shouldFillIcons = active && isApp

  const renderedChildren = shouldFillIcons
    ? React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== 'string'
          ? React.cloneElement(child as React.ReactElement<{ weight?: string }>, { weight: 'fill' })
          : child
      )
    : children

  return (
    <button
      ref={ref}
      data-active={active || undefined}
      className={cn(
        'flex w-full items-center rounded-lg',
        'transition-colors duration-200',
        'disabled:pointer-events-none',
        isApp
          ? [
              'gap-3 px-3 py-2.5 text-base-normal text-white [&_svg]:size-5',
              !active && 'hover:bg-gray-930',
              'focus-visible:outline-none focus-visible:bg-gray-930',
              'disabled:text-gray-930',
              active && 'bg-white text-brand-primary font-medium',
            ]
          : [
              'gap-2 px-2 py-1.5 text-sm-normal text-gray-800',
              !active && 'hover:bg-beige-100 hover:text-app-foreground',
              'focus-visible:outline-none focus-visible:bg-beige-100 focus-visible:text-app-foreground',
              'disabled:text-beige-800',
              active && 'bg-beige-100 text-app-foreground font-medium',
            ],
        isIconMode && 'aspect-square size-10 justify-center p-0 overflow-hidden [&>span]:hidden',
        className
      )}
      {...props}
    >
      {renderedChildren}
    </button>
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'

interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange, open, variant } = useSidebarContext()
    const isApp = variant === 'app'

    return (
      <button
        ref={ref}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        className={cn(
          'inline-flex size-10 flex-shrink-0 items-center justify-center rounded-lg',
          'transition-colors duration-200',
          isApp
            ? [
                'text-white',
                'hover:bg-gray-930',
                'focus-visible:outline-none focus-visible:bg-gray-930',
              ]
            : [
                'text-gray-800',
                'hover:bg-beige-100 hover:text-app-foreground',
                'focus-visible:outline-none focus-visible:bg-beige-100 focus-visible:text-app-foreground',
              ],
          className
        )}
        onClick={(e) => {
          onClick?.(e)
          onOpenChange?.(!open)
        }}
        {...props}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 3v18' />
        </svg>
      </button>
    )
  }
)
SidebarTrigger.displayName = 'SidebarTrigger'

export {
  SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}
export type { SidebarRootProps, SidebarMenuButtonProps, SidebarTriggerProps }
