import {
  BuildingBlockGrid,
  BuildingBlockColor,
  BuildingBlockSize,
} from '../decor/BuildingBlockGrid'
import IconComponent, {
  IconNameType,
} from '../../icons/IconComponent'
import { Button } from '../Button'
import { Tooltip } from '../Tooltip'

interface EmptyScreenPlaceholderProps {
  title: string
  description?: string
  icon?: IconNameType
  color?: BuildingBlockColor
  size?: BuildingBlockSize
  cta?: {
    text: string
    onClick?: () => void
    icon?: IconNameType
    disabled?: boolean
    tooltip?: string
  }
}

const SIZE_TO_TEXT_CLASSES: Record<
  BuildingBlockSize,
  { title: string; description: string }
> = {
  sm: {
    title: 'text-xs-bold',
    description: 'text-xs-normal',
  },
  md: {
    title: 'text-sm-bold',
    description: 'text-sm-normal',
  },
  lg: {
    title: 'text-base-bold',
    description: 'text-base-normal',
  },
  xl: {
    title: 'header-5-bold',
    description: 'header-5-normal',
  },
}

const EmptyScreenPlaceholder = ({
  title,
  description,
  icon = 'Empty',
  color = 'beige',
  size = 'md',
  cta,
}: EmptyScreenPlaceholderProps) => {
  const textClasses = SIZE_TO_TEXT_CLASSES[size]

  const ctaButton = cta && (
    <Button
      disabled={cta.disabled}
      variant='secondary'
      size={size === 'xl' ? 'lg' : size}
      onClick={cta.onClick || undefined}
    >
      {cta.icon && <IconComponent name={cta.icon} className='mr-1' />}
      {cta.text}
    </Button>
  )

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center'>
      <BuildingBlockGrid icon={icon} color={color} size={size} inline={false} />
      <div className='flex max-w-[75%] flex-col items-center justify-center gap-1'>
        <div className={`${textClasses.title} text-app-foreground`}>
          {title}
        </div>
        <div className={`${textClasses.description} text-muted-foregroundStrong`}>
          {description}
        </div>
      </div>
      {cta &&
        (cta.tooltip ? (
          <Tooltip heading={cta.tooltip}>{ctaButton}</Tooltip>
        ) : (
          ctaButton
        ))}
    </div>
  )
}

export { EmptyScreenPlaceholder }
