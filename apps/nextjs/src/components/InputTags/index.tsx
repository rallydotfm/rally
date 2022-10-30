import input from '@components/FormInput/styles'

export const InputTags = (props) => {
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
        placeholder={placeholder ?? 'Add tags'}
        {...api.inputProps}
      />
    </div>
  )
}

export default InputTags
