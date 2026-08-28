import { PropsWithChildren } from 'react'

export function FieldGroup({ children }: PropsWithChildren<unknown>) {
  return <div className='ui-field-group flex items-end'>{children}</div>
}
