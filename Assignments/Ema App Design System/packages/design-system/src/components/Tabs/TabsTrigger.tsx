import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { useTabsContext } from './context'
import IconComponent, {
  IconNameType,
} from '../../icons/IconComponent'

const tabsTriggerVariants = cva(
  [
    'cursor-pointer select-none',
    'flex items-center justify-center gap-2', // alignments and spacing - reduced gap from 2.5 to 2
    'bg-transparent outline-none', // background
    'text-muted-foreground hover:text-app-foreground', // text colors using semantic tokens
    'data-[state=active]:text-app-foreground', // active text color
    'transition-colors duration-200', // smooth transitions
  ],
  {
    variants: {
      variant: {
        underline: [
          'whitespace-nowrap border-b-2 border-transparent rounded-t-md',
          'hover:bg-brand-secondaryHover',
          'data-[state=active]:border-success data-[state=active]:bg-transparent',
          'data-[state=active]:font-medium',
        ],
        button: [
          'rounded-md border border-transparent',
          'hover:bg-brand-secondaryActive',
          'data-[state=active]:bg-white data-[state=active]:border-disabled-border data-[state=active]:shadow-sm',
          'data-[state=active]:font-medium', // medium weight for active state
        ],
        pill: [
          'shrink-0 whitespace-nowrap rounded-full border border-brand-secondaryBorder !bg-brand-secondary !text-brand-secondaryForeground',
          'hover:border-brand-secondaryMuted hover:!bg-brand-secondaryAccent hover:!text-brand-secondaryForeground',
          'data-[state=active]:border-transparent data-[state=active]:!bg-brand-primary data-[state=active]:!text-brand-primaryForeground',
          'disabled:border-transparent disabled:!bg-brand-secondaryActive disabled:text-muted',
        ],
      },
      size: {
        sm: 'text-xs-medium',
        md: 'text-sm-medium',
        lg: 'text-base-medium',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    compoundVariants: [
      // Underline variant spacing based on Figma tokens
      { variant: 'underline', size: 'lg', className: 'px-3 py-2.5' }, // Spacing/12 and Spacing/10
      { variant: 'underline', size: 'md', className: 'px-3 py-2' }, // Spacing/12 and Spacing/8
      { variant: 'underline', size: 'sm', className: 'px-3 py-1.5' }, // Spacing/12 and Spacing/6
      // Button variant spacing
      { variant: 'button', size: 'lg', className: 'px-3.5 py-2.5' }, // Spacing/14 and Spacing/10
      { variant: 'button', size: 'md', className: 'px-2.5 py-1.5' }, // Spacing/10 and Spacing/6
      { variant: 'button', size: 'sm', className: 'px-1.5 py-1' }, // Spacing/6 and Spacing/4
      // Pill variant spacing + gap + font per Figma
      {
        variant: 'pill',
        size: 'lg',
        className: 'gap-2 px-3.5 py-2 text-base-bold',
      }, // gap-8, px-14, py-8
      {
        variant: 'pill',
        size: 'md',
        className: 'gap-1.5 px-2.5 py-1.5 text-sm-bold',
      }, // gap-6, px-10, py-6
      {
        variant: 'pill',
        size: 'sm',
        className: 'gap-1 px-1.5 py-1 text-xs-bold',
      }, // gap-4, px-6, py-4
    ],
    defaultVariants: {
      size: 'md',
      variant: 'underline',
      fullWidth: false,
    },
  }
)

interface TabsTriggerProps
  extends Omit<TabsPrimitive.TabsTriggerProps, 'className'>,
    Omit<
      VariantProps<typeof tabsTriggerVariants>,
      'size' | 'variant' | 'fullWidth'
    > {
  icon?: IconNameType
}

export const TabsTrigger = forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ children, ...props }, ref) => {
  const {
    size = 'md',
    variant = 'underline',
    fullWidth = false,
  } = useTabsContext()

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={tabsTriggerVariants({ size, variant, fullWidth })}
      {...props}
    >
      {props.icon && <IconComponent name={props.icon} size={size} />}
      {children}
    </TabsPrimitive.Trigger>
  )
})

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
