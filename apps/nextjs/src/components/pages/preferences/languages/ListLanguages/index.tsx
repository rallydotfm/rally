import { Listbox } from '@headlessui/react'
import { useStorePersistedPreferences } from '@hooks/usePersistedPreferences'
import { useAccount } from 'wagmi'
import { DICTIONARY_LOCALES, DICTIONARY_LOCALES_SIMPLIFIED } from '@helpers/mappingLocales'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import button from '@components/Button/styles'

export const ListLanguages = () => {
  const account = useAccount()
  const saveLanguagesSelectionToLocalStorage = useStorePersistedPreferences(
    (state: any) => state.saveLanguagesSelection,
  )
  const storedPreferences = useStorePersistedPreferences((state: any) => state.preferences)

  return (
    <>
      {storedPreferences?.[account?.address as `0x${string}`]?.languagess?.map(
        //@ts-ignore
        (language: string) => DICTIONARY_LOCALES[language],
      )?.length > 0 && (
        <div className="animate-appear text-xs">
          <p className="font-medium">Current selection:</p>
          <ul className="mb-6 mt-1 flex flex-wrap gap-3">
            {storedPreferences?.[account?.address as `0x${string}`]?.languages?.map((language: string) => (
              <li
                className="font-semibold text-2xs px-1ex py-1 bg-neutral-1 text-white rounded-md"
                key={`preferences-list-languagesselected-list-${language}`}
              >
                {/* @ts-ignore */}
                {DICTIONARY_LOCALES[language]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Listbox
        value={storedPreferences?.[account?.address as `0x${string}`]?.languages ?? []}
        onChange={(selection) => {
          saveLanguagesSelectionToLocalStorage(account?.address, selection)
        }}
        multiple
      >
        <Listbox.Button className="font-bold">Select your preferred languages</Listbox.Button>
        <Listbox.Options static={true} className="mt-4 flex flex-col gap-4">
          {Object.keys(DICTIONARY_LOCALES_SIMPLIFIED).map((language) => (
            <Listbox.Option
              className={button({
                class: `${
                  storedPreferences?.[account?.address as `0x${string}`]?.languages?.includes(language)
                    ? '!pis-1ex'
                    : ''
                } !justify-start !rounded-md !tracking-none`,
                intent: storedPreferences?.[account?.address as `0x${string}`]?.languages?.includes(language)
                  ? 'neutral-on-dark-layer'
                  : 'neutral-outline',
              })}
              key={`preferences-list-languagesselection-language-${language}`}
              value={language}
            >
              {storedPreferences?.[account?.address as `0x${string}`]?.languages?.includes(language) && (
                <CheckCircleIcon className="text-interactive-9 w-6 mie-1ex" />
              )}
              {/* @ts-ignore */}
              {DICTIONARY_LOCALES_SIMPLIFIED[language]}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </>
  )
}

export default ListLanguages
