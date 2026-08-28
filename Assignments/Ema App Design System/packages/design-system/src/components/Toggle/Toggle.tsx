import IconComponent, {
  IconNameType,
} from '../../icons/IconComponent'
import { toggleVariants, ToggleVariantProps } from './variants'
import * as TogglePrimitive from '@radix-ui/react-toggle'

export function Toggle({
  label,
  iconName,
  onChange,
  pressed,
  size = 'md',
  variant = 'default',
  iconOnly = false,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  Omit<ToggleVariantProps, 'active' | 'disabled'> & {
    label?: string
    iconName?: IconNameType
    pressed?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'minimal'
    iconOnly?: boolean
  }) {
  return (
    <TogglePrimitive.Root
      className={toggleVariants({
        size,
        variant,
        iconOnly,
        pressed,
      })}
      pressed={pressed}
      onClick={onChange}
      {...props}
    >
      {iconName && <IconComponent name={iconName} weight='bold' />}
      {label && <div aria-label={label}>{label}</div>}
    </TogglePrimitive.Root>
  )
}
