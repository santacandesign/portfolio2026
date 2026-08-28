'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import IconComponent from '../../icons/IconComponent'
import { Label } from '../Label/Label'
import { InputHintText } from '../InputHintText/InputHintText'
import {
  commonInputClasses,
  inputSizeVariants,
  inputStateVariants,
} from '../common'

export type SelectDropdownType = 'check' | 'radio'
export type SelectDropdownSize = 'sm' | 'md' | 'lg'

export type SelectItemContentProps<
  Value = string,
  DropdownType = SelectDropdownType,
> = {
  iconProps?: DropdownType extends 'check'
    ? React.ComponentProps<typeof IconComponent>
    : never
  title: string
  subtitle?: string
  description?: string
  value: Value
}

export type SelectDropdownOptions<Value> =
  | SelectItemContentProps<Value>[]
  | Record<string, SelectItemContentProps<Value>[]>

export type SelectDropdownVariant = 'primary' | 'ghost'

export interface SelectDropdownProps<Value, DropdownType = SelectDropdownType>
  extends Omit<
    SelectPrimitive.SelectProps,
    'value' | 'onValueChange' | 'defaultValue'
  > {
  type: DropdownType
  variant?: SelectDropdownVariant
  size?: SelectDropdownSize
  state?: 'default' | 'success' | 'error'
  options: DropdownType extends 'check'
    ? SelectItemContentProps<Value>[]
    : Record<string, SelectItemContentProps<Value>[]>
  onChange: (value: Value) => void
  placeholder?: string
  scrollButtons?: boolean
  defaultValue?: Value
  value?: Value
  label?: string
  hintText?: string
  align?: 'start' | 'center' | 'end'
  block?: boolean
}

const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between whitespace-nowrap bg-white',
    'data-[placeholder]:text-muted-foreground disabled:data-[placeholder]:text-muted-foregroundStrong',
    commonInputClasses.textColor,
    commonInputClasses.disabled,
    'disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  ],
  {
    variants: {
      variant: {
        primary: commonInputClasses.border,
        ghost: `border !border-transparent rounded-lg outline-none focus:ring-2 focus:ring-offset-0 hover:!border-brand-secondaryBorder focus:!border-focus-border`,
      },
      size: inputSizeVariants,
      state: inputStateVariants,
      fieldGroup: {
        true: 'group/field-group',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      state: 'default',
    },
  }
)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants>
>(({ className, children, size, state, variant, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      '[.ui-field-group_.ui-single-select:first-child_&]:rounded-r-none',
      '[.ui-field-group_.ui-single-select:not(:last-child)_&]:border-r-0',
      '[.ui-field-group_.ui-single-select:last-child_&]:rounded-l-none',
      '[.ui-field-group_.ui-single-select:not(:last-child):not(:first-child)_&]:rounded-none',
      selectTriggerVariants({ size, state, variant }),
      className
    )}
    {...props}
  >
    <div className='truncate'>{children}</div>
    <SelectPrimitive.Icon asChild>
      <IconComponent
        name='CaretDown'
        className='ml-1 min-w-4 text-brand-secondaryForeground opacity-50'
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <IconComponent name='CaretUp' />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <IconComponent name='CaretDown' />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    showScrollButtons?: boolean
  }
>(
  (
    {
      className,
      children,
      position = 'popper',
      showScrollButtons = false,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-y-auto overflow-x-hidden rounded-md border bg-white shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        {showScrollButtons && <SelectScrollUpButton />}
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {showScrollButtons && <SelectScrollDownButton />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
)
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('text-xs-label px-2 py-1.5 text-brand-secondaryMuted', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItemContent = ({
  iconProps,
  title,
  description,
  subtitle,
  value,
}: SelectItemContentProps) => (
  <div className='w-full' data-value={String(value)}>
    <div className='flex items-center'>
      <SelectPrimitive.ItemText asChild>
        <div className='flex items-center truncate'>
          {iconProps && (
            <IconComponent {...iconProps} className='mr-2 min-w-4' />
          )}
          <span className='text-sm-medium truncate text-app-foreground'>
            {title}
          </span>
        </div>
      </SelectPrimitive.ItemText>
      {subtitle && (
        <span className='text-sm-normal ml-2 text-muted-foregroundStrong'>{subtitle}</span>
      )}
    </div>
    {description && (
      <div className={cn('text-sm-normal text-muted-foregroundStrong', iconProps && 'ml-6')}>
        {description}
      </div>
    )}
  </div>
)

const selectItemClass =
  'text-sm-normal relative flex w-full cursor-pointer select-none rounded-sm py-1.5 outline-none hover:bg-brand-secondaryHover focus:bg-app-background focus:text-brand-secondaryForeground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

const itemIndicatorCommonClass =
  'absolute flex h-3.5 w-3.5 items-center justify-center'

const SelectCheckItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    SelectItemContentProps
>(
  (
    { className, iconProps, title, subtitle, description, value, ...props },
    ref
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(selectItemClass, 'items-center pl-2 pr-8', className)}
      {...props}
    >
      <span className={cn(itemIndicatorCommonClass, 'right-0 ml-2 mr-2')}>
        <SelectPrimitive.ItemIndicator>
          <IconComponent name='Check' color='success' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectItemContent
        iconProps={iconProps}
        title={title}
        subtitle={subtitle}
        description={description}
        value={value}
      />
    </SelectPrimitive.Item>
  )
)
SelectCheckItem.displayName = SelectPrimitive.Item.displayName

const SelectRadioItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    SelectItemContentProps
>(({ className, title, subtitle, description, value, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(selectItemClass, 'items-start pl-8 pr-2', className)}
      {...props}
    >
      <span className={cn(itemIndicatorCommonClass, 'left-2 top-2')}>
        <IconComponent name='Circle' color='success' />
        <SelectPrimitive.ItemIndicator>
          <IconComponent name='RadioButton' color='success' weight='fill' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectItemContent
        title={title}
        subtitle={subtitle}
        description={description}
        value={value}
      />
    </SelectPrimitive.Item>
  )
})
SelectRadioItem.displayName = 'SelectRadioItem'

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('my-2 h-px w-full bg-disabled-border', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

function SingleSelect<Value>({
  type,
  variant = 'primary',
  size,
  options,
  onChange,
  placeholder = 'Select an option',
  scrollButtons = false,
  disabled = false,
  defaultValue,
  name,
  value,
  label,
  hintText,
  required,
  state = 'default',
  align,
  block,
}: SelectDropdownProps<Value>) {
  const generatedId = React.useId()
  const triggerId = `${generatedId}_trigger`
  const hintTextId = `${generatedId}_hint`
  const labelId = `${generatedId}_label`
  // Determine which item component to use based on type
  const ItemComponent = type === 'check' ? SelectCheckItem : SelectRadioItem

  const processedOptions = React.useMemo(() => {
    const processOptions = (options: SelectItemContentProps<Value>[]) => {
      return options?.map((option) => ({
        ...option,
        stringValue: String(option.value),
      }))
    }

    if (Array.isArray(options)) {
      return processOptions(options)
    } else {
      return Object.entries(options).flatMap(([, groupOptions]) =>
        processOptions(groupOptions)
      )
    }
  }, [options])

  // Handle selection change
  const handleSelectionChange = (newValue: string) => {
    const selectedOptionValue = processedOptions.find(
      (option) => option.stringValue === newValue
    )?.value
    if (selectedOptionValue !== undefined) {
      onChange(selectedOptionValue)
    }
  }

  // Render the dropdown content based on the options structure
  const renderOptions = () => {
    if (Array.isArray(options)) {
      // If options is an array, simply map through it
      return options.map((option) => {
        const itemValue = String(option.value)
        return (
          <ItemComponent
            key={itemValue}
            value={itemValue}
            title={option.title}
            subtitle={option.subtitle}
            description={option.description}
            iconProps={option.iconProps}
          />
        )
      })
    } else {
      // If options is an object, create groups with labels
      return Object.entries(options).map(
        ([groupName, groupOptions], groupIndex) => (
          <React.Fragment key={groupName}>
            {groupIndex > 0 && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{groupName}</SelectLabel>
              {groupOptions.map((option) => {
                const itemValue = String(option.value)
                return (
                  <ItemComponent
                    key={itemValue}
                    value={itemValue}
                    title={option.title}
                    subtitle={option.subtitle}
                    description={option.description}
                    iconProps={option.iconProps}
                  />
                )
              })}
            </SelectGroup>
          </React.Fragment>
        )
      )
    }
  }

  return (
    <div className={cn('ui-single-select flex w-fit flex-col gap-y-1', block && 'w-full')}>
      {label && <Label label={label} required={required} size={size || 'md'} id={labelId} htmlFor={triggerId} />}
      <Select
        onValueChange={handleSelectionChange}
        defaultValue={
          defaultValue !== undefined ? String(defaultValue) : undefined
        }
        name={name}
        disabled={disabled}
        value={value !== undefined ? String(value) : undefined}
      >
        <SelectTrigger
          id={triggerId}
          size={size || 'md'}
          disabled={disabled}
          state={state}
          variant={variant}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hintText ? hintTextId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent showScrollButtons={scrollButtons} align={align}>
          {renderOptions()}
        </SelectContent>
      </Select>
      {hintText && (
        <InputHintText
          size={size || 'md'}
          state={state}
          hintText={hintText}
          id={hintTextId}
        />
      )}
    </div>
  )
}

export { SingleSelect }
