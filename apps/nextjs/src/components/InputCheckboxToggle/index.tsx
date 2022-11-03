import { Switch } from '@headlessui/react'

export const InputCheckboxToggle = (props: any) => {
  const { label, helpText, ...rest } = props
  const { checked } = rest
  return (
    <Switch.Group>
      <div className="flex flex-col">
        <div className="flex items-center">
          <Switch.Label className="order-2 pis-1ex flex flex-col font-bold text-sm">
            <span className="pie-2">{label}</span>
          </Switch.Label>
          <Switch
            {...rest}
            type="button"
            className="ui-checked:bg-interactive-11 ui-checked:focus-visible:ring-interactive-9 ui-checked:focus-visible:ring-opacity-25 ui-not-checked:focus-visible:ring-white ui-not-checked:bg-neutral-7 ui-not-checked:focus-visible:ring-opacity-30
  disabled:opacity-50 disabled:cursor-not-allowed
          relative inline-flex h-5 lg:h-6 w-10 order-1 lg:w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-4  border-2 border-transparent"
          >
            <span
              aria-hidden="true"
              className={`${
                checked ? 'translate-x-5 lg:translate-x-6' : 'translate-x-0'
              } pointer-events-none inline-block h-4 w-4 lg:h-5 lg:w-5  transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        {helpText && <span className="text-neutral-11 pt-1 text-2xs">{helpText}</span>}
      </div>
    </Switch.Group>
  )
}

export default InputCheckboxToggle
