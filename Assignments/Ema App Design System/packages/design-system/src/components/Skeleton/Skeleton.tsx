import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils'

/**
 * Skeleton UI Component
 *
 * A versatile component for displaying loading states and placeholders while content is being loaded.
 * The Skeleton component helps improve perceived performance by showing a preview of the content's structure
 * before the actual data is available.
 *
 * Key Features:
 * - Multiple shapes: rectangle (default), square, rounded (circle)
 * - Predefined sizes: small, medium (default), large
 * - Customizable dimensions with width, height, and min/max properties
 * - Animation control with the `animate` prop (enabled by default)
 * - Support for rendering multiple items in rows or columns with the `count` prop
 * - Specialized variants for common UI elements: Text, Avatar, Button, Input, Paragraph
 *
 */
export type SkeletonShape = 'rounded' | 'square' | 'rectangle'
export type SkeletonSize = 'small' | 'medium' | 'large'

const DIMENSIONS = {
  rounded: {
    small: { width: '28px', height: '28px' },
    medium: { width: '36px', height: '36px' },
    large: { width: '44px', height: '44px' },
  },
  square: {
    small: { width: '28px', height: '28px' },
    medium: { width: '36px', height: '36px' },
    large: { width: '44px', height: '44px' },
  },
  rectangle: {
    small: { width: '120px', height: '28px' },
    medium: { width: '120px', height: '36px' },
    large: { width: '120px', height: '44px' },
  },
}

const BORDER_RADIUS = {
  rounded: '50%',
  square: {
    small: '6px',
    medium: '8px',
    large: '12px',
  },
  rectangle: {
    small: '6px',
    medium: '8px',
    large: '12px',
  },
}

const skeletonVariants = cva(
  ['relative overflow-hidden', 'bg-skeleton-gradient'],
  {
    variants: {
      shape: {
        rounded: '',
        square: '',
        rectangle: '',
      },
      size: {
        small: '',
        medium: '',
        large: '',
      },
      animate: {
        true: 'animate-pulse before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        false: '',
      },
    },
    defaultVariants: {
      shape: 'rectangle',
      size: 'medium',
      animate: true,
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof skeletonVariants>, 'shape' | 'size'> {
  /**
   * The shape of the skeleton.
   * - 'rectangle': Default rectangular shape (good for text blocks)
   * - 'square': Equal width and height
   * - 'rounded': Circular shape (good for avatars)
   * @default 'rectangle'
   * @example <Skeleton shape="rounded" />
   */
  shape?: SkeletonShape

  /**
   * The size of the skeleton.
   * - 'small': 28px height for rectangles, 28x28px for squares/rounded
   * - 'medium': 36px height for rectangles, 36x36px for squares/rounded
   * - 'large': 44px height for rectangles, 44x44px for squares/rounded
   * @default 'medium'
   * @example <Skeleton size="large" />
   */
  size?: SkeletonSize

  /**
   * Whether to apply animation effects (pulse and shimmer).
   * Set to false for static skeletons.
   * @default true
   * @example <Skeleton animate={false} />
   */
  animate?: boolean

  /**
   * The width of the skeleton.
   * Overrides the default width for the selected shape and size.
   * @example <Skeleton width="200px" />
   * @example <Skeleton width={200} />
   */
  width?: string | number

  /**
   * The height of the skeleton.
   * Overrides the default height for the selected shape and size.
   * @example <Skeleton height="50px" />
   * @example <Skeleton height={50} />
   */
  height?: string | number

  /**
   * The minimum width of the skeleton.
   * @example <Skeleton minWidth="100px" />
   */
  minWidth?: string | number

  /**
   * The maximum width of the skeleton.
   * @example <Skeleton maxWidth="300px" />
   */
  maxWidth?: string | number

  /**
   * The minimum height of the skeleton.
   * @example <Skeleton minHeight="50px" />
   */
  minHeight?: string | number

  /**
   * The maximum height of the skeleton.
   * @example <Skeleton maxHeight="100px" />
   */
  maxHeight?: string | number

  /**
   * Whether the skeleton is in loading state.
   * When false and children are provided, children will be shown instead.
   * @default true
   * @example <Skeleton loading={isLoading}>{content}</Skeleton>
   */
  loading?: boolean

  /**
   * The number of skeleton items to render.
   * Useful for creating lists or grids of skeletons.
   * @default 1
   * @example <Skeleton count={3} />
   */
  count?: number

  /**
   * The gap between multiple skeleton items when count > 1.
   * @default '0.5rem'
   * @example <Skeleton count={3} gap="1rem" />
   */
  gap?: string

  /**
   * Whether to render multiple skeleton items in a row (horizontal) or column (vertical).
   * Only applies when count > 1.
   * @default 'column'
   * @example <Skeleton count={3} direction="row" />
   */
  direction?: 'row' | 'column'

  /**
   * Test ID for testing purposes.
   * @example <Skeleton data-testid="loading-skeleton" />
   */
  'data-testid'?: string
}

/**
 * Get the dimensions for a skeleton based on shape and size
 */
const getSkeletonDimensions = (
  shape: SkeletonShape,
  size: SkeletonSize
): { width: string; height: string } => {
  return DIMENSIONS[shape][size]
}

/**
 * Get the border radius for a skeleton based on shape and size
 */
const getBorderRadius = (shape: SkeletonShape, size: SkeletonSize): string => {
  if (shape === 'rounded') {
    return BORDER_RADIUS.rounded
  }
  return BORDER_RADIUS[shape][size]
}

/**
 * Convert a value to a CSS dimension string
 */
const toCssDimension = (
  value: string | number | undefined
): string | undefined => {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Base Skeleton component for displaying loading states
 */
const SkeletonRoot = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      shape = 'rectangle',
      size = 'medium',
      width,
      height,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      animate = true,
      loading = true,
      count = 1,
      gap = '0.5rem',
      direction = 'column',
      'data-testid': dataTestId,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Get default dimensions and border radius
    const defaultDimensions = getSkeletonDimensions(shape, size)
    const borderRadius = getBorderRadius(shape, size)

    // Use provided width/height or fall back to defaults
    const finalWidth = toCssDimension(width) || defaultDimensions.width
    const finalHeight = toCssDimension(height) || defaultDimensions.height
    const finalMinWidth = toCssDimension(minWidth)
    const finalMaxWidth = toCssDimension(maxWidth)
    const finalMinHeight = toCssDimension(minHeight)
    const finalMaxHeight = toCssDimension(maxHeight)

    // Style object for the skeleton
    const skeletonStyle: React.CSSProperties = {
      width: finalWidth,
      height: finalHeight,
      minWidth: finalMinWidth,
      maxWidth: finalMaxWidth,
      minHeight: finalMinHeight,
      maxHeight: finalMaxHeight,
      borderRadius,
      ...style,
    }

    // Generate skeleton classes
    const skeletonClasses = cn(
      skeletonVariants({
        shape,
        size,
        animate,
      }),
      className
    )

    // If not loading, render children
    if (!loading && children) {
      return (
        <div ref={ref} data-testid={dataTestId} {...props}>
          {children}
        </div>
      )
    }

    // For multiple skeletons, create a container
    if (count > 1) {
      return (
        <div
          ref={ref}
          data-testid={dataTestId}
          style={{
            display: 'flex',
            flexDirection: direction === 'row' ? 'row' : 'column',
            gap,
          }}
          {...props}
        >
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={skeletonClasses}
              style={skeletonStyle}
              data-testid={dataTestId ? `${dataTestId}-${index}` : undefined}
            />
          ))}
        </div>
      )
    }

    // For a single skeleton
    return (
      <div
        ref={ref}
        className={skeletonClasses}
        style={skeletonStyle}
        data-testid={dataTestId}
        {...props}
      />
    )
  }
)

SkeletonRoot.displayName = 'Skeleton'

// Types for our specialized skeleton components
export interface SkeletonTextProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * The number of lines of text to render.
   * Creates multiple skeleton lines stacked vertically.
   * @default 1
   * @example <SkeletonText lines={3} />
   */
  lines?: number

  /**
   * The percentage width for the last line (1-100).
   * Makes the last line shorter to create a more realistic text appearance.
   * @default 80
   * @example <SkeletonText lines={3} lastLineWidth={60} /> // Last line at 60% width
   */
  lastLineWidth?: number
}

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * The shape of the avatar skeleton.
   * 'rounded' creates a circular avatar, 'square' creates a square avatar with rounded corners.
   * @default 'rounded'
   * @example <SkeletonAvatar shape="square" />
   */
  shape?: 'rounded' | 'square'
}

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * The shape of the button skeleton.
   * 'rectangle' creates a standard button shape, 'rounded' creates a pill-shaped button.
   * @default 'rectangle'
   * @example <SkeletonButton shape="rounded" />
   */
  shape?: 'rectangle' | 'rounded'
}

export interface SkeletonInputProps extends Omit<SkeletonProps, 'shape'> {
  /**
   * Whether to make the input skeleton full width of its container.
   * Useful for responsive layouts where inputs need to fill available space.
   * @default false
   * @example <SkeletonInput block />
   */
  block?: boolean
}

/**
 * Specialized Text skeleton component for rendering text placeholders.
 * Creates single or multiple lines of loading text with customizable width for the last line.
 *
 * @example
 * <SkeletonText /> // Single line
 * <SkeletonText lines={3} lastLineWidth={50} /> // Three lines, last line at 50% width
 */
const Text = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 1, lastLineWidth = 80, className, ...props }, ref) => {
    if (lines === 1) {
      return (
        <SkeletonRoot
          ref={ref}
          shape='rectangle'
          className={className}
          {...props}
        />
      )
    }

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <SkeletonRoot
            key={index}
            shape='rectangle'
            width={index === lines - 1 ? `${lastLineWidth}%` : '100%'}
            {...props}
          />
        ))}
      </div>
    )
  }
)

Text.displayName = 'SkeletonText'

/**
 * Specialized Avatar skeleton component for rendering avatar placeholders.
 * Creates a circular or square placeholder for user avatars.
 *
 * @example
 * <SkeletonAvatar /> // Circular avatar (default)
 * <SkeletonAvatar shape="square" size="large" /> // Square avatar, large size
 */
const Avatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ shape = 'rounded', ...props }, ref) => {
    return <SkeletonRoot ref={ref} shape={shape} {...props} />
  }
)

Avatar.displayName = 'SkeletonAvatar'

/**
 * Specialized Button skeleton component for rendering button placeholders.
 * Creates a rectangular or rounded placeholder with customizable dimensions.
 *
 * @example
 * <SkeletonButton /> // Default button placeholder
 * <SkeletonButton shape="rounded" /> // Rounded button placeholder
 */
const Button = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ shape = 'rectangle', size = 'medium', ...props }, ref) => {
    return <SkeletonRoot ref={ref} shape={shape} size={size} {...props} />
  }
)

Button.displayName = 'SkeletonButton'

/**
 * Specialized Input skeleton component for rendering input field placeholders.
 * Creates a rectangular placeholder with optional full-width setting.
 *
 * @example
 * <SkeletonInput /> // Default input placeholder
 * <SkeletonInput block /> // Full-width input placeholder
 */
const Input = React.forwardRef<HTMLDivElement, SkeletonInputProps>(
  ({ block = false, ...props }, ref) => {
    return (
      <SkeletonRoot
        ref={ref}
        shape='rectangle'
        width={block ? '100%' : undefined}
        {...props}
      />
    )
  }
)

Input.displayName = 'SkeletonInput'

/**
 * Specialized Paragraph skeleton component for rendering paragraph placeholders.
 * Creates multiple lines of text with the last line shorter by default.
 *
 * @example
 * <SkeletonParagraph /> // Default 3 lines paragraph
 * <SkeletonParagraph lines={5} lastLineWidth={40} /> // 5 lines, last line at 40% width
 */
const Paragraph = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, lastLineWidth = 65, ...props }, ref) => {
    return (
      <Text ref={ref} lines={lines} lastLineWidth={lastLineWidth} {...props} />
    )
  }
)

Paragraph.displayName = 'SkeletonParagraph'

/**
 * Skeleton UI component for displaying loading states.
 *
 * @example
 * // Basic usage
 * <Skeleton /> // Default rectangle with animation
 * <Skeleton animate={false} /> // Static skeleton without animation
 * <Skeleton width="200px" height="100px" /> // Custom dimensions
 */
export const Skeleton = SkeletonRoot

/**
 * Specialized components for different UI elements
 */
export const SkeletonText = Text
export const SkeletonAvatar = Avatar
export const SkeletonButton = Button
export const SkeletonInput = Input
export const SkeletonParagraph = Paragraph

export { skeletonVariants }
