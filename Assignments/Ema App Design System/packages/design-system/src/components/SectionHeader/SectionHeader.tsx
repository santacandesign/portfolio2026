import { Label } from '../Label/Label'
import { InputHintText } from '../InputHintText/InputHintText'

export type SectionHeaderSize = 'sm' | 'md' | 'lg'

export interface SectionHeaderProps {
  /** Title text */
  label: string
  /** Optional supporting text displayed below the title */
  description?: string
  /** Whether to show the required asterisk */
  required?: boolean
  /** Connects the label to an input by id (htmlFor) */
  htmlFor?: string
  /** Visual size of the header */
  size?: SectionHeaderSize
  /** Optional right-aligned action (e.g., a Button) */
  action?: React.ReactNode
}

const mapSizeToLabel: Record<
  SectionHeaderSize,
  React.ComponentProps<typeof Label>['size']
> = {
  sm: 'md',
  md: 'lg',
  lg: 'lg',
}

const mapSizeToHint: Record<
  SectionHeaderSize,
  React.ComponentProps<typeof InputHintText>['size']
> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

const safeIdFromLabel = (text: string) =>
  text
    .toLowerCase()
    .trim()
    // Replace any sequence of non-alphanumeric/underscore characters with a single hyphen
    .replace(/[^a-z0-9_]+/g, '-')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '') || 'section-header'

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  description,
  required,
  htmlFor,
  size = 'md',
  action,
}) => {
  const descriptionId = `${htmlFor || safeIdFromLabel(label)}-description`
  return (
    <div className='flex items-start justify-between gap-x-4'>
      <div className='flex min-w-0 flex-col gap-y-1'>
        <Label
          label={label}
          size={mapSizeToLabel[size]}
          required={required}
          htmlFor={htmlFor}
        />
        {description ? (
          <InputHintText
            id={descriptionId}
            size={mapSizeToHint[size]}
            state='default'
            hintText={description}
          />
        ) : null}
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  )
}

SectionHeader.displayName = 'SectionHeader'
