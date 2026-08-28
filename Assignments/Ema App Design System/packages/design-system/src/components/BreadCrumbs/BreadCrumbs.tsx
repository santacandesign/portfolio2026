import { Fragment } from 'react'
import { cn } from '../../utils'
import { BREADCRUMBS_VARIANTS, type BreadCrumbsVariants } from './variants'

export type BreadCrumbItem = {
  label: string
  id: string
}

export interface BreadCrumbsProps extends BreadCrumbsVariants {
  breadCrumbs: Array<BreadCrumbItem>
  onBreadCrumbsClick?: (id: string) => void
}

export const BreadCrumbs = ({
  breadCrumbs,
  onBreadCrumbsClick,
  size = 'xs',
}: BreadCrumbsProps) => {
  const textClass = BREADCRUMBS_VARIANTS({ size })
  const isFirst = (index: number) => index === 0
  const isLast = (index: number) => index === breadCrumbs.length - 1
  const isMiddle = (index: number) => !isFirst(index) && !isLast(index)

  return (
    <div className='flex items-center gap-x-2 overflow-hidden'>
      {breadCrumbs.map((crumb, index) => (
        <Fragment key={crumb.id}>
          {index !== 0 && (
            <span className={cn(textClass, 'font-medium shrink-0')}>/</span>
          )}
          <span
            className={cn(
              textClass,
              'font-medium truncate transition-[flex-shrink] duration-200 ease-in-out',
              (isFirst(index) || isLast(index)) && 'shrink-0',
              isMiddle(index) && 'min-w-[1.5ch] hover:shrink-0',
              !!onBreadCrumbsClick && 'cursor-pointer hover:text-app-foreground',
              isLast(index) && '!text-app-foreground'
            )}
            onClick={() => onBreadCrumbsClick?.(crumb.id)}
          >
            {crumb.label}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

BreadCrumbs.displayName = 'BreadCrumbs'
