import { Combobox, Popover } from '@headlessui/react'
import { DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import input from '@components/FormInput/styles'
import styles from '@components/FormSelect/styles.module.css'

interface LanguageSuggestions {
  onSelectValue: any
  inputValue: string
  setInputValue: any
  className?: string
}

export const LanguageSuggestions = (props: LanguageSuggestions) => {
  const { onSelectValue, inputValue, setInputValue, className } = props

  return (
    <div className="relative">
      <Popover>
        <Popover.Button
          className={input({ class: `text-start ui-open:border-b-0 ui-open:rounded-b-none ${className ?? ''}` })}
          title="Select language"
        >
          {/* @ts-ignore */}
          <span>{inputValue !== '' ? DICTIONARY_LOCALES_SIMPLIFIED[inputValue] : 'Select language'}</span>
        </Popover.Button>
        <Popover.Panel className="border border-neutral-7 border-solid absolute focus:ring-interactive-9 text-xs rounded-b-md w-full top-full z-10 max-h-[33vh] overflow-y-auto inline-start-0">
          <Combobox
            value={inputValue}
            onChange={(value) => {
              setInputValue(value)
              onSelectValue(value)
            }}
          >
            <div className="p-3 bg-neutral-5 border-b border-neutral-8">
              <span className="text-[0.75rem] font-medium text-neutral-12">Filter by language name</span>
              <Combobox.Input
                className={input({ class: 'w-full mt-1', scale: 'sm' })}
                onChange={(event) => setInputValue(event.target.value)}
                value={inputValue}
              />
            </div>

            <Combobox.Options className="pt-2 bg-neutral-5 divide-neutral-7 divide-y" static>
              <>
                {Object.keys(DICTIONARY_LOCALES_SIMPLIFIED)
                  ?.filter((language: any) => {
                    if (inputValue === '') return !language.includes('_')
                    //@ts-ignore
                    return DICTIONARY_LOCALES_SIMPLIFIED[language].toLowerCase().includes(inputValue.toLowerCase())
                  })
                  .map((language: string) => (
                    <Combobox.Option
                      className="relative ui-active:bg-neutral-12 ui-active:text-interactive-2 px-3 py-2 cursor-pointer flex items-center"
                      key={`language-locale-${language}`}
                      value={language}
                    >
                      {/* @ts-ignore */}
                      {DICTIONARY_LOCALES_SIMPLIFIED[language]}
                      <Popover.Button className="z-10 absolute top-0 left-0 w-full h-full block opacity-0">
                        Select this language and close
                      </Popover.Button>
                    </Combobox.Option>
                  ))}
              </>
            </Combobox.Options>
          </Combobox>
        </Popover.Panel>
      </Popover>
      <div
        className={`${styles.indicator} absolute inline-end-0 top-0 aspect-square rounded-ie-md h-full z-10 pointer-events-none bg-neutral-12 bg-opacity-5 border-is border-neutral-12 border-opacity-10`}
      />
    </div>
  )
}

export default LanguageSuggestions
