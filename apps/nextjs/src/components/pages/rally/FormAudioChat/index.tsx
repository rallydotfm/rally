import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import InputTags from '@components/InputTags'
import InputCheckboxToggle from '@components/InputCheckboxToggle'
import FormRadioGroup from '@components/FormRadioGroup'
import { RadioGroup } from '@headlessui/react'
import FormRadioOption from '@components/FormRadioOption'
import { CameraIcon, InformationCircleIcon, PlusIcon } from '@heroicons/react/20/solid'
import EthereumAddress from '@components/EthereumAddress'
import OptionGuild from '@components/pages/rally/FormAudioChat/OptionGuild'
import { useAccount, useNetwork } from 'wagmi'

interface FormAudioChatProps {
  state: any
  apiInputRallyTags: any
  storeForm: any
  labelButtonSubmit: string
  labelButtonSubmitting: string
}
export const FormAudioChat = (props: FormAudioChatProps) => {
  const {
    state,
    apiInputRallyTags,
    labelButtonSubmit,
    labelButtonSubmitting,
    storeForm: { form, setData, resetField, addField, data, setFields, errors, isValid },
  } = props
  const { chain } = useNetwork()
  const account = useAccount()
  return (
    <>
      <form ref={form}>
        <div className="space-y-10 mb-12 text-neutral-12">
          <fieldset className="space-y-5">
            <legend className="mb-4 uppercase text-sm font-bold">General information</legend>

            <FormField className="!mt-0">
              <FormField.InputField>
                <FormField.Label hasError={errors()?.rally_name ? true : false} htmlFor="rally_name">
                  Name
                </FormField.Label>
                <FormField.Description id="input-rally_name-description">The name of your rally.</FormField.Description>
                <FormInput
                  disabled={!account?.address || chain?.unsupported === true}
                  hasError={errors()?.rally_name ? true : false}
                  placeholder="Eg: RallyDAO meeting #5"
                  name="rally_name"
                  id="rally_name"
                  required
                  aria-describedby="input-rally_name-description input-rally_name-helpblock"
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.rally_name?.length ? true : false}
                id="input-rally_name-helpblock"
              >
                Please type a name.
              </FormField.HelpBlock>
            </FormField>
            <FormField>
              <FormField.InputField>
                <FormField.Label hasError={errors()?.rally_start_at ? true : false} htmlFor="rally_start_at">
                  Date and time
                </FormField.Label>
                <FormField.Description id="input-rally_start_at-description">
                  The date and time at which of your rally will take place.
                </FormField.Description>
                <FormInput
                  disabled={!account?.address || chain?.unsupported === true}
                  hasError={errors()?.rally_start_at ? true : false}
                  name="rally_start_at"
                  id="rally_start_at"
                  type="datetime-local"
                  min={new Date().toISOString().substring(0, 16)}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                  required
                  aria-describedby="input-rally_start_at-description input-start-at-timezone-helpblock input-rally_start_at-helpblock"
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.rally_start_at ? true : false}
                id="input-start-at-timezone-helpblock"
                className="not-sr-only pt-2 text-neutral-11 text-2xs"
              >
                Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
              </FormField.HelpBlock>
              <FormField.HelpBlock
                hasError={errors()?.rally_start_at ? true : false}
                id="input-rally_start_at-helpblock"
              >
                Please pick a valid date.
              </FormField.HelpBlock>
            </FormField>
            <FormField>
              <FormField.InputField>
                <FormField.Label hasError={errors()?.rally_description ? true : false} htmlFor="rally_description">
                  Description
                </FormField.Label>
                <FormField.Description id="input-rally_description-description">
                  A few words on what will be the topic discussed in your rally.
                </FormField.Description>
                <FormTextarea
                  disabled={!account?.address || chain?.unsupported === true}
                  rows={7}
                  hasError={errors()?.rally_description ? true : false}
                  placeholder="Eg: Community discussion about the future of Rally. Members only !"
                  name="rally_description"
                  id="rally_description"
                  aria-describedby="input-rally_description-description input-rally_description-helpblock"
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.rally_description ? true : false}
                id="input-rally_description-helpblock"
              >
                Please type a description.
              </FormField.HelpBlock>
            </FormField>
            <FormField>
              <FormField.InputField>
                <div className="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
                  <div>
                    <FormField.Label hasError={errors()?.rally_image_file ? true : false} htmlFor="rally_image_file">
                      Your rally image
                    </FormField.Label>
                    <FormField.Description id="input-rally_image_file-description">
                      Click on the picture to upload an image from your files.
                    </FormField.Description>
                    <FormField.HelpBlock
                      hasError={false}
                      className="not-sr-only text-neutral-11 text-2xs"
                      id="input-rally_image_file-helpblock"
                    >
                      Your image should have a 2:1 ratio and not be larger than 1MB.
                    </FormField.HelpBlock>
                  </div>
                  <div className="mt-3 relative lg:mt-0">
                    <div className="w-full lg:w-96 aspect-twitter-card rounded-md overflow-hidden relative bg-neutral-1">
                      <input
                        disabled={!account?.address || chain?.unsupported === true}
                        onChange={(e) => {
                          //@ts-ignore
                          const src = URL.createObjectURL(e.target.files[0])
                          setData('rally_image_src', src)
                        }}
                        className="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                        type="file"
                        accept="image/*"
                        name="rally_image_file"
                        id="rally_image_file"
                        required
                        aria-describedby="input-rally_image_file-description input-rally_image_file-helpblock"
                      />
                      <div className="absolute w-full h-full rounded-md inset-0 z-20 bg-neutral-3 bg-opacity-20 flex items-center justify-center">
                        <CameraIcon className="w-10 text-white" />
                      </div>

                      {data()?.rally_image_src && (
                        <img
                          alt=""
                          loading="lazy"
                          width="112"
                          height="112"
                          className="absolute w-full h-full object-cover block z-10 inset-0"
                          src={
                            !data()?.rally_image_file
                              ? `https://ipfs.io/ipfs/${data()?.rally_image_src}`
                              : data()?.rally_image_src
                          }
                        />
                      )}
                    </div>

                    {data()?.rally_image_src && (
                      <Button
                        disabled={!account?.address || chain?.unsupported === true}
                        type="button"
                        className="mt-2 w-full"
                        intent="negative-ghost"
                        scale="xs"
                        onClick={() => {
                          setData('rally_image_src')
                          setData('rally_image_file')
                        }}
                      >
                        Delete image
                      </Button>
                    )}
                  </div>
                </div>
              </FormField.InputField>
            </FormField>

            <FormField>
              <FormField.InputField>
                <FormField.Label hasError={errors()?.rally_max_attendees ? true : false} htmlFor="rally_max_attendees">
                  Maximum number of participants
                </FormField.Label>
                <FormField.Description id="input-rally_max_attendees-description">
                  The maximum amount of people that can attend your rally (you, co-hosts, guests and listeners).
                </FormField.Description>
                <FormInput
                  hasError={errors()?.rally_max_attendees ? true : false}
                  name="rally_max_attendees"
                  id="rally_max_attendees"
                  disabled={!account?.address || chain?.unsupported === true}
                  type="number"
                  min={2}
                  step="1"
                  aria-describedby="input-rally_max_attendees-description input-rally_max_attendees-helpblock"
                />
              </FormField.InputField>

              <FormField.HelpBlock
                hasError={errors()?.rally_max_attendees ? true : false}
                id="input-rally_max_attendees-helpblock"
              >
                The maximum amount of participants must be a positive number.
              </FormField.HelpBlock>
            </FormField>
            <FormField>
              <FormField.InputField>
                <FormField.Label hasError={errors()?.rally_tags ? true : false} htmlFor="rally_tags">
                  Tags
                </FormField.Label>
                <FormField.Description id="input-rally_tags-description">Add some tags</FormField.Description>
                <InputTags
                  disabled={!account?.address || chain?.unsupported === true}
                  className="w-full"
                  api={apiInputRallyTags}
                />
              </FormField.InputField>
              <FormField.HelpBlock hasError={errors()?.rally_tags ? true : false} id="input-rally_tags-helpblock">
                Please add at least 1 tag.
              </FormField.HelpBlock>
            </FormField>
            <FormField>
              <InputCheckboxToggle
                label="This rally will be recorded"
                checked={data().rally_is_recorded}
                disabled={!account?.address || chain?.unsupported === true}
                onChange={(value: any) => {
                  setFields('rally_is_recorded', value)
                }}
              />
            </FormField>
          </fieldset>
          <fieldset className="space-y-5">
            <legend className="uppercase text-sm font-bold">Co-hosts</legend>
            <p className="!mt-1 text-neutral-12 text-xs">
              Co-hosts are your moderators: they can control who joins the conversation as a speaker and invite
              listeners to speak. You can add <span className="font-bold">up to 5 co-hosts</span> to your rally.
            </p>
            <FormField className="!mt-3">
              <InputCheckboxToggle
                disabled={!account?.address || chain?.unsupported === true}
                label="This rally will have co-hosts"
                checked={data().rally_has_cohosts}
                onChange={(value: boolean) => {
                  setData('rally_has_cohosts', value)
                  if (value === true) {
                    addField('rally_cohosts', {
                      eth_address: '',
                    })
                  } else {
                    setData('rally_cohosts', [])
                  }
                }}
              />
            </FormField>
            {data().rally_has_cohosts === true && (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 animate-appear">
                {data().rally_cohosts.map((cohost: { key: string }, index: number) => {
                  return (
                    <div
                      className="animate-appear space-y-3 p-3 border rounded-md  bg-neutral-1 border-neutral-4"
                      key={`cohost-${cohost.key}`}
                    >
                      <div className="space-y-4">
                        <FormField>
                          <FormField.InputField>
                            <FormField.Label
                              className="text-xs !pb-1"
                              hasError={errors()?.[`rally_cohosts.${index}.eth_address`] ? true : false}
                              htmlFor={`rally_cohosts.${index}.eth_address`}
                            >
                              Ethereum address
                            </FormField.Label>
                            <FormField.Description id={`input-rally_cohosts.${index}.eth_address-description`}>
                              We will use this Ethereum address to grant moderator privileges to your co-host. <br />
                            </FormField.Description>
                            <FormInput
                              scale="sm"
                              required
                              disabled={!account?.address || chain?.unsupported === true}
                              hasError={errors()?.[`rally_cohosts.${index}.eth_address`] ? true : false}
                              placeholder="A valid Ethereum address"
                              name={`rally_cohosts.${index}.eth_address`}
                              id={`rally_cohosts.${index}.eth_address`}
                              aria-describedby={`input-rally_cohosts.${index}.eth_address-description input-rally_cohosts.${index}.eth_address-helpblock`}
                            />
                          </FormField.InputField>
                          <FormField.HelpBlock
                            hasError={errors()?.[`rally_cohosts.${index}.eth_address`] ? true : false}
                            id={`input-rally_cohosts.${index}.eth_address-helpblock`}
                          >
                            The address of your co-host must be a valid Ethereum address.
                          </FormField.HelpBlock>
                        </FormField>
                      </div>
                      {!errors()?.rally_cohosts[index]?.eth_address?.length &&
                        data()?.rally_cohosts[index]?.eth_address && (
                          <div className="mt-4 pt-3 text-xs animate-appear">
                            <EthereumAddress
                              shortenOnFallback={true}
                              displayLensProfile={true}
                              address={data()?.rally_cohosts[index]?.eth_address}
                            />
                          </div>
                        )}
                      <Button
                        intent="negative-ghost"
                        className="!mt-6 w-full"
                        scale="sm"
                        onClick={() => {
                          const updated = data()?.rally_cohosts.filter(
                            (rallyCohost: any) => rallyCohost.key !== cohost.key,
                          )
                          setData('rally_cohosts', updated)
                        }}
                      >
                        Remove co-host
                      </Button>
                    </div>
                  )
                })}
                {data()?.rally_cohosts?.length < 5 && (
                  <button
                    className="min-h-[12rem] text-white text-opacity-75 w-full h-full flex flex-col items-center justify-center p-3 border-dashed border rounded-md bg-neutral-1 bg-opacity-50 hover:bg-opacity-75 focus:bg-opacity-90 hover:focus:bg-opacity-95 border-neutral-4"
                    onClick={() => {
                      addField('rally_cohosts', {
                        name: '',
                        eth_address: '',
                      })
                    }}
                    type="button"
                  >
                    <PlusIcon className="w-8 mb-3" />
                    <span className="text-xs">Add another co-host</span>
                  </button>
                )}
              </div>
            )}
          </fieldset>
          <fieldset className="space-y-5">
            <legend className="uppercase text-sm font-bold">Guests whitelist</legend>
            <p className="!mt-1 text-neutral-12 text-xs">
              Don't worry, you'll be able to add/remove guests during your rally as well.
            </p>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 animate-appear">
              {data().rally_guests.map((guest: { key: string }, index: number) => {
                return (
                  <div
                    className="animate-appear space-y-3 p-3 border rounded-md  bg-neutral-1 border-neutral-4"
                    key={`guest-${guest.key}`}
                  >
                    <div className="space-y-4">
                      <FormField>
                        <FormField.InputField>
                          <FormField.Label
                            className="text-xs !pb-1"
                            hasError={errors()?.[`rally_guests.${index}.eth_address`] ? true : false}
                            htmlFor={`rally_guests.${index}.eth_address`}
                          >
                            Ethereum address
                          </FormField.Label>
                          <FormField.Description id={`input-rally_guests.${index}.eth_address-description`}>
                            We will use this Ethereum address to grant speaker privileges to your guest <br />
                          </FormField.Description>
                          <FormInput
                            scale="sm"
                            required
                            disabled={!account?.address || chain?.unsupported === true}
                            hasError={errors()?.[`rally_guests.${index}.eth_address`] ? true : false}
                            placeholder="A valid Ethereum address"
                            name={`rally_guests.${index}.eth_address`}
                            id={`rally_guests.${index}.eth_address`}
                            aria-describedby={`input-rally_guests.${index}.eth_address-description input-rally_guests.${index}.eth_address-helpblock`}
                          />
                        </FormField.InputField>
                        <FormField.HelpBlock
                          hasError={errors()?.[`rally_guests.${index}.eth_address`] ? true : false}
                          id={`input-rally_guests.${index}.eth_address-helpblock`}
                        >
                          The address of your co-host must be a valid Ethereum address.
                        </FormField.HelpBlock>
                      </FormField>
                    </div>
                    {!errors()?.rally_guests[index]?.eth_address?.length && data()?.rally_guests[index]?.eth_address && (
                      <div className="mt-4 pt-3 text-xs animate-appear">
                        <EthereumAddress
                          shortenOnFallback={true}
                          displayLensProfile={true}
                          address={data()?.rally_guests[index]?.eth_address}
                        />
                      </div>
                    )}
                    <Button
                      intent="negative-ghost"
                      className="!mt-6 w-full"
                      scale="sm"
                      onClick={() => {
                        const updated = data()?.rally_guests.filter((rallyCohost: any) => rallyCohost.key !== guest.key)
                        setData('rally_guests', updated)
                      }}
                    >
                      Remove guest
                    </Button>
                  </div>
                )
              })}
              {data()?.rally_guests?.length < 5 && (
                <button
                  className="min-h-[12rem] text-white text-opacity-75 w-full h-full flex flex-col items-center justify-center p-3 border-dashed border rounded-md bg-neutral-1 bg-opacity-50 hover:bg-opacity-75 focus:bg-opacity-90 hover:focus:bg-opacity-95 border-neutral-4"
                  onClick={() => {
                    addField('rally_guests', {
                      eth_address: '',
                    })
                  }}
                  type="button"
                >
                  <PlusIcon className="w-8 mb-3" />
                  <span className="text-xs">Add another guest</span>
                </button>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 uppercase text-sm font-bold">Privacy</legend>
            <div className="space-y-5">
              <FormRadioGroup
                className="!mt-0"
                disabled={!account?.address || chain?.unsupported === true}
                defaultValue={data()?.rally_is_gated === true ? true : false}
                onChange={(value: boolean) => {
                  setData('rally_is_gated', value)
                  if (value === true) {
                    addField('rally_access_control_guilds', {
                      guild_id: '',
                      roles: [],
                    })
                    addField('rally_access_control_blacklist', '')
                    addField('rally_access_control_whitelist', '')
                  } else {
                    resetField('rally_access_control_guilds')
                    resetField('rally_access_control_blacklist')
                    resetField('rally_access_control_whitelist')
                  }
                }}
              >
                <RadioGroup.Label className="sr-only">Can anyone join this rally ?</RadioGroup.Label>
                <FormRadioOption value={false}>Free access (anybody can join)</FormRadioOption>
                <FormRadioOption value={true}>
                  Gated access (only wallets meeting specific requirements will be allowed to join)
                </FormRadioOption>
              </FormRadioGroup>
              {data().rally_is_gated === true && (
                <>
                  <div className="grid grid-cols-1 gap-3 animate-appear">
                    {data().rally_access_control_guilds.map((guild: { key: string }, index: number) => {
                      return (
                        <div
                          className="animate-appear space-y-3 p-3 border rounded-md  bg-neutral-1 border-neutral-4"
                          key={`guild-${guild.key}`}
                        >
                          <FormField>
                            <FormField.InputField>
                              <FormField.Label
                                className="text-xs"
                                hasError={errors()?.[`rally_access_control_guilds.${index}.guild_id`] ? true : false}
                                htmlFor={`rally_access_control_guilds.${index}.guild_id`}
                              >
                                Guild ID
                              </FormField.Label>
                              <FormField.Description
                                className="sr-only"
                                id={`input-rally_access_control_guilds.${index}.guild_id-description`}
                              >
                                The ID of the Guild
                              </FormField.Description>
                              <FormInput
                                scale="sm"
                                disabled={!account?.address || chain?.unsupported === true}
                                hasError={errors()?.[`rally_access_control_guilds.${index}.guild_id`] ? true : false}
                                placeholder="Eg: our-guild, layer3, lens-protocol..."
                                name={`rally_access_control_guilds.${index}.guild_id`}
                                id={`rally_access_control_guilds.${index}.guild_id`}
                                aria-describedby={`input-rally_access_control_guilds.${index}.guild_id-description input-rally_access_control_guilds.${index}.guild_id-helpblock`}
                              />
                            </FormField.InputField>
                            <FormField.HelpBlock
                              hasError={errors()?.[`rally_access_control_guilds.${index}.guild_id`] ? true : false}
                              id={`input-rally_access_control_guilds.${index}.guild_id-helpblock`}
                            >
                              The name that will be displayed for this co-host.
                            </FormField.HelpBlock>
                          </FormField>
                          {data()?.rally_access_control_guilds[index]?.guild_id !== '' && (
                            <div className="mt-4 pt-3 animate-appear">
                              <OptionGuild
                                index={index}
                                data={data}
                                disabled={!account?.address || chain?.unsupported === true}
                                setData={setData}
                                id={data()?.rally_access_control_guilds[index]?.guild_id?.trim()}
                              />
                            </div>
                          )}
                          <Button
                            intent="negative-ghost"
                            className="!mt-6 w-full"
                            scale="sm"
                            disabled={!account?.address || chain?.unsupported === true}
                            onClick={() => {
                              const updated = data()?.rally_access_control_guilds.filter(
                                (rallyGuild: any) => rallyGuild.key !== guild.key,
                              )
                              setData('rally_access_control_guilds', updated)
                            }}
                          >
                            Remove guild
                          </Button>
                        </div>
                      )
                    })}
                    <button
                      disabled={!account?.address || chain?.unsupported === true}
                      className="min-h-[12rem] text-white text-opacity-75 w-full h-full flex flex-col items-center justify-center p-3 border-dashed border rounded-md bg-neutral-1 bg-opacity-50 hover:bg-opacity-75 focus:bg-opacity-90 hover:focus:bg-opacity-95 border-neutral-4"
                      onClick={() => {
                        addField('rally_access_control_guilds', {
                          id: '',
                          roles: [],
                        })
                      }}
                      type="button"
                    >
                      <PlusIcon className="w-8 mb-3" />
                      <span className="text-xs">Add another Guild</span>
                    </button>
                  </div>
                </>
              )}
              <FormField>
                <InputCheckboxToggle
                  disabled={!account?.address || chain?.unsupported === true}
                  label="Index this rally"
                  checked={data().rally_is_indexed}
                  onChange={(value: boolean) => setData('rally_is_indexed', value)}
                />
                <div className="inline-flex text-2xs text-neutral-12 space-i-1ex mt-1.5">
                  <InformationCircleIcon className="w-4" />
                  <p>Indexed rallies will be visible by everyone in the upcoming and home pages.</p>
                </div>
              </FormField>
            </div>
          </fieldset>
        </div>
        <Button
          isLoading={
            [state.transaction, state.contract, state.uploadImage, state.uploadData].filter((slice) => slice.isLoading)
              ?.length > 0
          }
          disabled={
            !account?.address ||
            chain?.unsupported === true ||
            !isValid() ||
            [state.transaction, state.contract, state.uploadImage, state.uploadData].filter((slice) => slice.isLoading)
              ?.length > 0
          }
        >
          {[state.transaction, state.contract, state.uploadImage, state.uploadData].filter((slice) => slice.isLoading)
            ?.length > 0
            ? labelButtonSubmitting
            : [state.transaction, state.contract, state.uploadImage, state.uploadData].filter((slice) => slice.isError)
                ?.length > 0
            ? 'Try again'
            : labelButtonSubmit}
        </Button>
      </form>
    </>
  )
}

export default FormAudioChat
