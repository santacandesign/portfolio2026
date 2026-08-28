import { useEffect } from 'react'
import { BannerRoot } from './BannerRoot'
import { BannerIcon } from './BannerIcon'
import { BannerContent } from './BannerContent'
import { BannerButton } from './BannerButton'
import { BannerClose } from './BannerClose'
import { useBannerStore, getBannerStore } from './store/bannerStore'

import {
  BannerRootProps,
  BannerVariant,
} from './types'

/**
 * Action configuration for the Banner's button
 */
export interface BannerActionProps {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  text?: string
  onClick?: React.MouseEventHandler
  variant?: BannerVariant
}

/**
 * Props for Banner component
 */
export interface BannerProps extends Omit<BannerRootProps, 'children'> {
  icon?: React.ComponentProps<typeof BannerIcon>['icon']
  iconSize?: React.ComponentProps<typeof BannerIcon>['iconSize']
  title?: string
  description?: string | React.ReactNode
  action?: BannerActionProps
  buttonPosition?: 'right' | 'bottom'
  children?: React.ReactNode
  storeId?: string
}

/**
 * Banner component that provides a simple API for creating notifications
 */
export const Banner = (props: BannerProps) => {
  const {
    icon,
    iconSize,
    title,
    description,
    action,
    variant = 'default',
    layout = 'compact',
    buttonPosition = 'right',
    onClose,
    children,
    storeId,
    ...rootProps
  } = props

  // Always call the hook (React hooks rule)
  const globalStore = useBannerStore()

  // Use either the specific store instance or fall back to the global store
  const {
    show,
    setBannerVariant,
    setButtonPosition,
    setTitlePresence,
    setDescriptionPresence,
  } = storeId ? getBannerStore(storeId).getState() : globalStore

  useEffect(() => {
    show()

    // Set other properties
    setBannerVariant(variant)
    setButtonPosition(buttonPosition)
    setTitlePresence(!!title)
    setDescriptionPresence(!!description)
  }, [
    show,
    setBannerVariant,
    setButtonPosition,
    setTitlePresence,
    setDescriptionPresence,
    variant,
    buttonPosition,
    title,
    description,
  ])

  const renderButton = () => {
    if (!action || !action.text) return null

    const { leftIcon, rightIcon, text, ...restProps } = action

    return (
      <BannerButton
        variant={variant}
        {...restProps}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        text={text}
      />
    )
  }

  return (
    <BannerRoot
      variant={variant}
      layout={layout}
      buttonPosition={buttonPosition}
      onClose={onClose}
      storeId={storeId}
      {...rootProps}
    >
      {icon && <BannerIcon icon={icon} iconSize={iconSize} variant={variant} />}
      {(title || description) && (
        <BannerContent
          title={title}
          description={description}
          variant={variant}
        />
      )}
      {children}
      {renderButton()}
      {onClose && (
        <BannerClose variant={variant} onClose={onClose} storeId={storeId} />
      )}
    </BannerRoot>
  )
}
