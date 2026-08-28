import React from 'react'
import { buttonVariants } from '../Button'
import { VariantProps } from 'class-variance-authority'
import { Icons } from '../../icons/Icons'

/**
 * All possible Phosphor icon names
 */
export type IconNameType = keyof typeof Icons

/**
 * All button variant types from the Button component
 */
export type ButtonVariantType = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>

/**
 * The variant of the toast, which determines its appearance and icon
 */
export type ToastVariant = 'info' | 'success' | 'warning' | 'error' | 'flair'

/**
 * Action configuration for toast actions
 */
export type ToastAction = {
  label: string
  onClick: () => void
  variant?: ButtonVariantType
  icon?: IconNameType | React.ReactNode
  iconPosition?: 'left' | 'right'
}

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  /** Duration in milliseconds (default: 5000ms / 5s) */
  duration?: number
  actions?: ToastAction[]
  onDismiss?: () => void
  id?: string
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
  icon?: IconNameType | React.ReactNode
  preserveOnRouteChange?: boolean
  isClosable?: boolean // Allow manual close via X button (true by default)
  isPersistent?: boolean // Makes the toast stay indefinitely, but still closable if isClosable is true
  pauseOnHover?: boolean // Pause duration countdown on hover (true by default)
  render?: (props: {
    // Custom render function
    id: string
    onDismiss: () => void
  }) => React.ReactNode
  container?: HTMLElement | null // Container element to render the toast within
  open?: boolean // Required by the internal store
}

/**
 * Internal toast object used by the store
 */
export type Toast = {
  id: number
  element: React.ReactNode
  open: boolean
  toastOptions?: Partial<ToastOptions>
}

/**
 * Toast store state and methods
 */
export type ToastStore = {
  toasts: Toast[]
  addToast: (
    element: React.ReactNode,
    options?: Partial<ToastOptions>
  ) => number
  removeToast: (id: number) => void
  updateToastOpenState: (id: number, open: boolean) => void
  clearAllToasts: () => void
  clearAllToastsForContainer: (container: HTMLElement | null) => void
}
