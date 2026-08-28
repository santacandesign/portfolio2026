import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  useId,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'

import IconComponent from '../../icons/IconComponent'
import useModal  from '../../hooks/useModal'
import { cn } from '../../utils/cn'
import { Button } from '../Button/Button'
import { InputHintText } from '../InputHintText/InputHintText'
import { Label } from '../Label/Label'
import {
  commonInputClasses,
  inputStateVariants,
  textAreaSizeVariants,
} from '../common'
import { Modal } from '../Modal'
const scrollbarClassses =
  '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-brand-secondaryMuted [&::-webkit-scrollbar-thumb]:rounded-full'

const textAreaVariants = cva(
  [
    commonInputClasses.placeholder,
    commonInputClasses.textColor,
    commonInputClasses.disabled,
  ],
  {
    variants: {
      variant: {
        primary: [commonInputClasses.border],
        ghost: `disabled:!bg-white disabled:!text-app-foreground disabled:!border-none disabled:cursor-not-allowed border px-3.5 !border-transparent hover:!border-brand-secondaryBorder focus:!border-success-border rounded-lg outline-none focus:ring-0 transition-[padding,border-color,box-shadow] duration-200`,
      },
      state: inputStateVariants,
      size: textAreaSizeVariants,
      noScrollBar: {
        true: '',
        false: scrollbarClassses,
      },
    },
    defaultVariants: {
      variant: 'primary',
      state: 'default',
      noScrollBar: false,
      size: 'md',
    },
  }
)

export interface TextAreaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      'className' | 'size' | 'style'
    >,
    VariantProps<typeof textAreaVariants> {
  hintText?: string
  label?: string
  expandableLabel?: string
  block?: boolean
  expandable?: boolean
  autoSize?: {
    minRows?: number
    maxRows?: number
  }
  noScrollBar?: boolean
  showCharacterCount?: boolean
}

const ExpandableTextArea = ({
  showModal,
  closeModal,
  ...props
}: Omit<TextAreaProps, 'expandable' | 'block' | 'rows' | 'onChange'> & {
  showModal: boolean
  closeModal: () => void
  onSave: (text: string) => void
}) => {
  const [text, setText] = useState<string | undefined>(props.value as string)

  return (
    <Modal.Root
      open={showModal}
      onOpenChange={(open) => {
        if (!open) closeModal()
      }}
      size='work_log'
    >
      <Modal.Header
        title={(props.label as string) || ''}
        onClose={closeModal}
      />
      <div className='flex w-full flex-col gap-y-6 p-6'>
        <TextArea
          {...props}
          autoSize={undefined}
          rows={12}
          label={undefined}
          block={true}
          onChange={(e) => setText(e.target.value)}
          expandable={false}
          value={text}
          variant={props.variant}
          showCharacterCount={props.showCharacterCount}
        />

        <div className='flex w-full items-center justify-end gap-3'>
          <div className='w-44'>
            <Button size='lg' variant='secondary' onClick={closeModal} block>
              Cancel
            </Button>
          </div>
          <div className='w-64'>
            <Button
              block
              size='lg'
              variant='primary'
              onClick={() => {
                props.onSave(text || '')
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal.Root>
  )
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      state,
      block,
      expandable,
      hintText,
      label,
      autoSize,
      expandableLabel: _expandableLabel,
      variant,
      size,
      noScrollBar = false,
      showCharacterCount = false,
      ...restProps
    } = props
    const generatedId = useId()
    const id = props.id || generatedId
    const expandableLabel = _expandableLabel || label
    const isGhost = variant === 'ghost'

    const { closeModal, openModal, showModal } = useModal()
    const localRef = useRef<HTMLTextAreaElement | null>(null)

    // Memoize the textAreaVariants result to avoid unnecessary re-renders
    const textAreaClasses = useMemo(() => {
      return textAreaVariants({
        state,
        variant: variant || 'primary',
        size,
        noScrollBar,
      })
    }, [state, variant, size, noScrollBar])

    // Derive character count directly from props.value to avoid sync issues
    const getCurrentValue = () => {
      if (props.value != null) return String(props.value)
      if (props.defaultValue != null) return String(props.defaultValue)
      return ''
    }

    const currentCharacterCount = getCurrentValue().length
    const maxLength = props.maxLength
    const isOverLimit = maxLength && currentCharacterCount > maxLength

    // Format number to compact notation (e.g. 1000 -> 1k)
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num)
    }

    const handleOnSave = (text: string) => {
      if (localRef.current) {
        localRef.current.value = text
        props.onChange?.({
          target: {
            value: text,
            name: props.name,
            id: props.id,
            type: 'textarea',
          },
          currentTarget: localRef.current!,
          bubbles: true,
          cancelable: true,
          type: 'change',
        } as React.ChangeEvent<HTMLTextAreaElement>)
      }
      closeModal()
    }

    const hintTextId = `${id}_hint`
    const labelId = `${id}_label`
    const characterCountId = `${id}_character_count`

    const calculateHeight = useCallback(
      (element: HTMLTextAreaElement) => {
        const computedStyle = getComputedStyle(element)
        const lineHeight = parseInt(computedStyle.lineHeight)
        const paddingTop = parseInt(computedStyle.paddingTop)
        const paddingBottom = parseInt(computedStyle.paddingBottom)
        const borderTop = parseInt(computedStyle.borderTopWidth)
        const borderBottom = parseInt(computedStyle.borderBottomWidth)

        // Reset height to auto to get proper scrollHeight
        element.style.height = 'auto'

        // scrollHeight includes content + padding but NOT borders
        const contentHeight = element.scrollHeight

        // Calculate min/max content heights (without borders for comparison)
        const minContentHeight =
          (autoSize?.minRows || props.rows || 3) * lineHeight +
          paddingTop +
          paddingBottom

        const maxContentHeight = autoSize?.maxRows
          ? autoSize.maxRows * lineHeight + paddingTop + paddingBottom
          : Infinity

        // Determine final content height
        const finalContentHeight = Math.min(
          Math.max(contentHeight, minContentHeight),
          maxContentHeight
        )

        // Add borders to get the total height (for box-sizing: border-box)
        const newHeight = finalContentHeight + borderTop + borderBottom

        element.style.height = `${newHeight}px`
        element.style.resize = autoSize ? 'none' : 'none' // Keep existing behavior
      },
      [autoSize, props.rows]
    )

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoSize) {
        calculateHeight(e.currentTarget)
      }
    }

    useEffect(() => {
      if (autoSize && localRef.current) {
        calculateHeight(localRef.current)
      }
    }, [autoSize, props.value, props.defaultValue, calculateHeight])

    // Build aria-describedby attribute
    const ariaDescribedBy =
      [hintText && hintTextId, showCharacterCount && characterCountId]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div className={cn(block && 'w-full')}>
        {expandable && showModal && (
          <ExpandableTextArea
            showModal={showModal}
            closeModal={closeModal}
            {...props}
            defaultValue={localRef.current?.value || props.defaultValue}
            onSave={handleOnSave}
            label={expandableLabel}
          />
        )}
        <div
          className={cn('group flex w-full flex-col gap-y-1', !block && 'max-w-fit')}
        >
          {label ? (
            <Label
              size={size === 'xl' || size === '2xl' ? 'lg' : size || 'md'}
              id={labelId}
              label={label}
              htmlFor={id}
              required={props.required}
              visibility={isGhost ? 'hidden' : 'visible'}
            />
          ) : null}
          <div className='relative w-full'>
            {/* eslint-disable-next-line react/forbid-elements */}
            <textarea
              className={cn(
                textAreaClasses,
                'w-full',
                noScrollBar && '!scrollbar-hide' // Unified scrollbar hiding behavior for all variants
              )}
              ref={(node) => {
                localRef.current = node
                if (typeof ref === 'function') {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
              }}
              onInput={handleInput}
              {...restProps}
              id={id}
              rows={props.rows ?? props.autoSize?.minRows}
              style={{ resize: 'none' }}
              aria-labelledby={label ? labelId : undefined}
              aria-describedby={ariaDescribedBy}
            />
            {expandable && !props.disabled && (
              <div className='absolute bottom-2.5 right-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100'>
                <Button
                  size='iconSm'
                  variant='ghost'
                  onClick={openModal}
                  aria-roledescription='Expand text area'
                >
                  <IconComponent
                    name='ArrowsOut'
                    color='app-mutedForeground'
                    size='xs'
                    weight='bold'
                  />
                </Button>
              </div>
            )}
          </div>
          {hintText && (
            <InputHintText
              size={size === 'xl' || size === '2xl' ? 'lg' : size || 'md'}
              state={state}
              hintText={hintText}
              id={hintTextId}
              ghost={isGhost}
            />
          )}
          {showCharacterCount && (
            <div
              id={characterCountId}
              className={`text-xs-medium flex justify-end text-unresolved-accent ${isOverLimit ? 'text-error' : ''}`}
              aria-live='polite'
              aria-atomic='true'
              role='status'
            >
              <span>
                {formatNumber(currentCharacterCount)}
                {maxLength && (
                  <span
                    className={
                      isOverLimit ? 'text-error' : 'text-app-mutedForeground'
                    }
                  >
                    /{formatNumber(maxLength)}
                  </span>
                )}
                {' characters'}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

export { TextArea }
