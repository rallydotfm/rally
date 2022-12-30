import FormInput from '@components/FormInput'
import Button from '@components/Button'
import FormField from '@components/FormField'
import { RadioGroup } from '@headlessui/react'
import FormRadioGroup from '@components/FormRadioGroup'
import FormRadioOption from '@components/FormRadioOption'
import useConfigureJoinRoomAs from './useConfigureJoinRoomAs'
import { useAccount } from 'wagmi'
import { useEnsIdentity } from '@hooks/useEnsIdentity'
import { IconSpinner } from '@components/Icons'

export const FormConfigureJoinRoomAs = () => {
  const {
    queryLensProfile,
    storeForm: { form, errors, isValid, data, setFields, setData },
  }: any = useConfigureJoinRoomAs()
  const account = useAccount()
  const queryEnsIdentity = useEnsIdentity(account?.address as `0x${string}`, {})
  return (
    <div>
      <form className="flex flex-col" ref={form}>
        <div className="flex justify-between w-fit-content items-center flex-wrap gap-32">
          <fieldset className="space-y-4 mb-6">
            <FormRadioGroup
              className="text-xs space-y-3"
              defaultValue={data()?.useLensProfile === true ? 'lens' : 'custom'}
              onChange={(value: string) => {
                setData('useLensProfile', value === 'lens' ? true : false)
                if (value === 'lens') {
                  setFields('displayName', queryLensProfile?.data?.name)
                  setFields(
                    'avatarUrl',
                    queryLensProfile?.data?.picture?.original?.url?.replace(
                      'ipfs://',
                      'https://lens.infura-ipfs.io/ipfs/',
                    ),
                  )
                }
                if (value === 'ens') {
                  setFields('displayName', queryEnsIdentity?.data?.name)
                  if (queryEnsIdentity?.data?.avatar && queryEnsIdentity?.data?.avatar !== null)
                    setFields(
                      'avatarUrl',
                      queryEnsIdentity?.data?.avatar?.replace('ipfs://', 'https://infura-ipfs.io/ipfs/'),
                    )
                }
              }}
            >
              <RadioGroup.Label className="sr-only">How should we call you ?</RadioGroup.Label>
              <FormRadioOption value="custom">Use a custom profile</FormRadioOption>
              <FormRadioOption
                disabled={
                  queryEnsIdentity?.isLoading || !queryEnsIdentity?.data?.name || queryEnsIdentity?.data?.name === null
                }
                value="ens"
              >
                Use my ENS identity {queryEnsIdentity?.data && `(${queryEnsIdentity?.data?.name})`}{' '}
                {queryEnsIdentity?.isLoading && <IconSpinner className="mx-2 animate-spin text-sm" />}
              </FormRadioOption>

              <FormRadioOption disabled={queryLensProfile?.isLoading || !queryLensProfile?.data?.name} value="lens">
                Use my Lens profile
              </FormRadioOption>
            </FormRadioGroup>

            <FormField>
              <FormField.InputField>
                <FormField.Label
                  className="text-xs !pb-1"
                  hasError={errors()?.displayName !== null ? true : false}
                  htmlFor="displayName"
                >
                  Your display name
                </FormField.Label>

                <FormInput
                  type="text"
                  required
                  hasError={errors()?.displayName !== null ? true : false}
                  name="displayName"
                  scale="sm"
                  placeholder="Your display name"
                  id="displayName"
                  className="w-full"
                  aria-describedby={`input-displayName-description input-displayName-helpblock`}
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.displayName !== null ? true : false}
                id={`input-displayName-helpblock`}
              >
                A display name is required.
              </FormField.HelpBlock>
            </FormField>

            <FormField>
              <FormField.InputField>
                <FormField.Label
                  className="text-xs !pb-1"
                  hasError={errors()?.avatarUrl !== null ? true : false}
                  htmlFor="avatarUrl"
                >
                  The URL to your avatar image
                </FormField.Label>

                <FormInput
                  type="url"
                  hasError={errors()?.avatarUrl !== null ? true : false}
                  name="avatarUrl"
                  scale="sm"
                  className="w-full"
                  placeholder="https://<some-url-to-a-valid-image-file>"
                  id="avatarUrl"
                  aria-describedby={`input-avatarUrl-description input-avatarUrl-helpblock`}
                />
              </FormField.InputField>
            </FormField>
          </fieldset>
          {data()?.avatarUrl !== '' && data()?.displayName !== '' && (
            <div className="mb-6 ">
              <p className="text-center text-neutral-11 text-[0.75rem] pb-2">Your profile</p>
              <div className="animate-appear items-center justify-center flex flex-col">
                <div className="w-20 h-20 rounded-full relative overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-neutral-2" />
                  <img src={data()?.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-10" />
                </div>
                <span className="font-bold block pt-1 text-2xs overflow-hidden text-ellipsis max-w-[15ex]">
                  {data()?.displayName}
                </span>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-fit-content animate-appear"
          disabled={!isValid() || queryLensProfile?.isLoading}
        >
          Update
        </Button>
      </form>
    </div>
  )
}

export default FormConfigureJoinRoomAs
