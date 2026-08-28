import { forwardRef } from 'react'

import { cn } from '../../utils'

export interface InfoStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Optional leading icon */
  icon?: React.ReactNode
  /** Primary label */
  title: string
  /** Dot-separated metadata items */
  items?: string[]
  /** Trailing action slot */
  action?: React.ReactNode
  /** Additional container classes */
  className?: string
}

const InfoStrip = forwardRef<HTMLDivElement, InfoStripProps>(
  ({ icon, title, items, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-beige-400 bg-beige-50 px-4 py-3',
          className
        )}
        {...props}
      >
        {icon && <span className='shrink-0'>{icon}</span>}

        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <span className='text-base-bold text-beige-960'>{title}</span>

          {items && items.length > 0 && (
            <span className='flex items-center gap-2'>
              {items.map((item, index) => (
                <span key={index} className='flex items-center gap-2'>
                  {index > 0 && (
                    <span className='size-1 shrink-0 rounded-full bg-beige-800' />
                  )}
                  <span className='text-sm-medium text-beige-930'>{item}</span>
                </span>
              ))}
            </span>
          )}
        </div>

        {action && <span className='shrink-0'>{action}</span>}
      </div>
    )
  }
)
InfoStrip.displayName = 'InfoStrip'

export { InfoStrip }
