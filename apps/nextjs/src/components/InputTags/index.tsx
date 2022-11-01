import input from '@components/FormInput/styles'
import type { SystemUiInputProps } from '@components/FormInput/styles'

interface InputTagsProps extends SystemUiInputProps {
  api: any
  className?: string
  placeholder?: string
}

export const InputTags = (props: InputTagsProps) => {
  const { api, className, intent, scale, appearance, placeholder } = props
  return (
    <div {...api.rootProps}>
      {api.value.map((value: string, index: number) => (
        <span key={index}>
          <div {...api.getTagProps({ index, value })}>
            <span>{value} </span>
            <button {...api.getTagDeleteButtonProps({ index, value })}>&#x2715;</button>
          </div>
          <input {...api.getTagInputProps({ index, value })} />
        </span>
      ))}
      <input
        className={input({
          intent: intent ?? 'default',
          scale: scale ?? 'default',
          appearance: appearance ?? 'square',
          class: `${className ?? ''}`,
        })}
        placeholder={placeholder ?? 'Type a tag and press "Enter"'}
        {...api.inputProps}
      />
    </div>
  )
}

export default InputTags
