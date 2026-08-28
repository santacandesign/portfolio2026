import { cva, VariantProps } from 'class-variance-authority'
import { useState } from 'react'
import { cn } from '../../utils'
import { AvatarIndicator } from './AvatarIndicator'
import { AvatarSize } from './constants'

const avatarVariants = cva(
  'flex items-center select-none justify-center rounded-full border-disabled-border text-muted-foregroundStrong overflow-hidden bg-disabled-bg',
  {
    variants: {
      size: {
        xs: 'size-5 border-[0.5px] text-xs-bold',
        sm: 'size-7 border-[0.5px] text-sm-bold',
        // Temporary size for drawer header
        drawer_header: 'size-8 border-[0.75px] text-sm-bold',
        md: 'size-9 border-[0.75px] text-base-bold',
        lg: 'size-11 border-[0.75px] header-5-bold',
        xl: 'size-13 border-[0.75px] header-4-bold',
        '2xl': 'size-15 border-[0.75px] header-3-bold',
      },
    },
    defaultVariants: {
      size: 'md' as AvatarSize,
    },
  }
)
interface AvatarProps extends VariantProps<typeof avatarVariants> {
  size?: AvatarSize
  isOnline?: boolean
  // used only for image
  alt?: string
  imageSrc?: string
  /**
   * By default tries to load image if doesn't exists
   * then shows fallbacktext
   * use getInitialForAvatar() to generate initials from full name or text
   * @example
   * getInitialForAvatar('John Doe') => 'JD'
   * getInitialForAvatar('John Middle Doe') => 'JD'
   * getInitialForAvatar('John') => 'J'
   */
  fallbackText: string
}

export const Avatar = ({
  size,
  isOnline,
  imageSrc,
  fallbackText,
  alt,
}: AvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => setImageLoaded(true)
  const handleError = () => setError(true)

  return (
    <div className='relative h-fit w-fit'>
      {isOnline != undefined ? (
        <div className='absolute bottom-0 right-0 z-10'>
          <div className='rounded-full bg-white p-0.5'>
            <AvatarIndicator
              state={isOnline ? 'online' : 'offline'}
              size={size}
            />
          </div>
        </div>
      ) : null}
      <div className={avatarVariants({ size })}>
        {!imageLoaded || error ? (
          <span title={fallbackText} className='uppercase'>
            {fallbackText}
          </span>
        ) : null}
        {!error && (
          <img
            role='img'
            src={imageSrc}
            alt={alt ?? ''}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full object-cover',
              !imageLoaded && 'hidden'
            )}
          />
        )}
      </div>
    </div>
  )
}
