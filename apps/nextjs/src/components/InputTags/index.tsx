import input from '@components/FormInput/styles'
import type { SystemUiInputProps } from '@components/FormInput/styles'

interface InputTagsProps extends SystemUiInputProps {
  api: any
  className?: string
  placeholder?: string
  disabled: boolean
}

export const InputTags = (props: InputTagsProps) => {
  const { api, disabled, className, intent, scale, appearance, placeholder } = props
  return (
    <div {...api?.rootProps}>
      <input
        className={input({
          intent: intent ?? 'default',
          scale: scale ?? 'default',
          appearance: appearance ?? 'square',
          class: `${className ?? ''}`,
        })}
        placeholder={placeholder ?? 'Type a tag and press "Enter"'}
        {...api.inputProps}
        disabled={disabled}
      />
      <div className="mt-2 flex gap-2 flex-wrap">
        {api.value.map((value: string, index: number) => (
          <span key={`tag-${index}`}>
            <div
              className="text-xs font-medium inline-flex rounded-md bg-interactive-10 py-0.5 pis-2 pie-3"
              {...api.getTagProps({ index, value })}
            >
              <span className="pie-1ex">{value} </span>
              <button {...api.getTagDeleteButtonProps({ index, value })}>&#x2715;</button>
            </div>
            <input {...api.getTagInputProps({ index, value })} />
          </span>
        ))}
      </div>
    </div>
  )
}

export default InputTags
