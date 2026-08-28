interface SpinnerProps {
  /**
   * The `id` prop is mandatory to prevent SVG ID collisions
   * when multiple Spinner components are rendered on the same page.
   * Each Spinner needs a unique ID for its internal elements to ensure
   * that the gradients and clip paths do not interfere with each other.
   */
  id: string
}

export function Spinner({ id }: SpinnerProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 20 20'
      fill='none'
      className='animate-spin'
      id={id}
    >
      <g strokeWidth={1.875} clipPath={`url(#${id}-a)`}>
        <path stroke={`url(#${id}-b)`} d='M1 10a9 9 0 0 1 18 0' />
        <path stroke={`url(#${id}-c)`} d='M19 10.001a9 9 0 1 1-18 0' />
      </g>
      <defs>
        <linearGradient
          id={`${id}-b`}
          x1={1}
          x2={19}
          y1={1}
          y2={1}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopOpacity={0} stopColor='currentColor' />
          <stop offset={1} stopOpacity={0.5} stopColor='currentColor' />
        </linearGradient>
        <linearGradient
          id={`${id}-c`}
          x1={1}
          x2={19}
          y1={10}
          y2={10}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='currentColor' />
          <stop offset={1} stopOpacity={0.5} stopColor='currentColor' />
        </linearGradient>
        <clipPath id={`${id}-a`}>
          <path fill='currentColor' d='M0 0h20v20H0z' />
        </clipPath>
      </defs>
    </svg>
  )
}
