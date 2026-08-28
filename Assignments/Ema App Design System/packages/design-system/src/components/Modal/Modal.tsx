import useModal from '../../hooks/useModal'
import * as ModalPrimitive from '@radix-ui/react-dialog'
import { forwardRef } from 'react'
import { ModalContext } from './context'
import { ModalContent } from './ModalContent'
import { ModalElevation, ModalSize } from './type'

// Event handlers that Radix exposes on Dialog.Content (focus + dismiss
// customization). Surfaced from Modal.Root via `contentProps` so the routing
// is explicit at the type level — these are NOT Dialog.Root-level events.
export type DialogContentEventHandlers = Pick<
  React.ComponentPropsWithoutRef<typeof ModalPrimitive.Content>,
  | 'onOpenAutoFocus'
  | 'onCloseAutoFocus'
  | 'onEscapeKeyDown'
  | 'onPointerDownOutside'
  | 'onInteractOutside'
  | 'onFocusOutside'
>

export interface ModalRootProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ModalPrimitive.Root>,
    'className'
  > {
  size?: ModalSize
  elevation?: ModalElevation
  title?: string
  description?: string
  /**
   * Event handlers forwarded to the inner Dialog.Content. Use for outside-click
   * coexistence (`onInteractOutside`), ESC handling, or focus customization.
   */
  contentProps?: DialogContentEventHandlers
}

export const ModalRoot = forwardRef<
  React.ElementRef<typeof ModalPrimitive.Root>,
  ModalRootProps
>(
  ({
    size,
    elevation,
    children,
    title,
    description,
    contentProps,
    ...rootProps
  }) => {
    const modalProps = useModal()
    return (
      <ModalContext.Provider
        value={{
          size: size || 'md',
          elevation: elevation || 'l4',
          title,
          description,
          ...modalProps,
        }}
      >
        <ModalPrimitive.Root {...rootProps}>
          <ModalContent {...contentProps}>{children}</ModalContent>
        </ModalPrimitive.Root>
      </ModalContext.Provider>
    )
  }
)

ModalRoot.displayName = ModalPrimitive.Root.displayName
