import { RadioGroup } from '@headlessui/react'
export const FormRadioOption = (props: any) => {
  const { children, className, classNameWrapper, classNameCheckbox, ...rest } = props
  return (
    <RadioGroup.Option className={`${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} {...rest}>
      {({ checked }) => (
        <div className={`flex items-baseline ${classNameWrapper ?? ''}`}>
          <span
            className={`${classNameCheckbox ?? ''} ${
              checked
                ? 'bg-interactive-10 ring-2 ring-interactive-9 border-black border-4'
                : props.disabled
                ? 'border-0 border-transparent'
                : 'border-2 border-neutral-5'
            } translate-y-0.5 inline-flex mie-2 w-4 h-4 rounded-full border-solid`}
          />
          <span
            className={`flex-wrap items-center pie-3 flex w-full  text-white ${
              checked ? ' font-bold' : 'text-opacity-75'
            } ${className ?? ''}`}
          >
            {children}
          </span>
        </div>
      )}
    </RadioGroup.Option>
  )
}

export default FormRadioOption
