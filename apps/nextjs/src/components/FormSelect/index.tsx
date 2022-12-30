import type { SelectProps } from 'react-html-props'
import { input } from '@components/FormInput/styles'
import type { SystemUiInputProps } from '@components/FormInput/styles'
import styles from './styles.module.css'

interface FormSelectProps extends SelectProps, SystemUiInputProps {
  hasError: boolean
  classNameInput?: string
}

export const FormSelect = (props: FormSelectProps) => {
  const { className, classNameInput, hasError, scale, appearance, children, ...rest } = props
  return (
    <div className={`${className ?? ''} relative`}>
      <select
        className={`w-full ${input({
          appearance: appearance ?? 'square',
          scale: scale ?? 'default',
          //@ts-ignore
          variant: hasError === true ? 'error' : 'default',
          class: `pie-10 ${classNameInput ?? ''}`,
        })} [&>option]:bg-neutral-5 &[>option]:p-2 `}
        {...rest}
      >
        {children}
      </select>
      <div
        className={`${styles.indicator} absolute inline-end-0 top-0 aspect-square rounded-ie-md h-full z-10 pointer-events-none bg-neutral-12 bg-opacity-5 border-is border-neutral-12 border-opacity-10`}
      />
    </div>
  )
}

export default FormSelect
