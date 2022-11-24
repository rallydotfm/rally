import FormInput from '@components/FormInput'
import Button from '@components/Button'
import { useJoinRoomAs } from './useJoinRoomAs'
import FormField from '@components/FormField'
import type { RoomState } from '@livekit/react-core'
import { RadioGroup } from '@headlessui/react'
import FormRadioGroup from '@components/FormRadioGroup'
import FormRadioOption from '@components/FormRadioOption'

interface FormJoinRoomAsProps {
  dataAudioChat: any
  stateVoiceChat: RoomState
  rallyJoined: any
  idRallyToJoin: string
}
export const FormJoinRoomAs = (props: FormJoinRoomAsProps) => {
  const { dataAudioChat, idRallyToJoin, rallyJoined, stateVoiceChat } = props
  const {
    mutationJoinRoom,
    queryLensProfile,
    storeForm: { form, errors, isValid, data, setFields, setData },
  }: any = useJoinRoomAs(dataAudioChat)
  return (
    <div className="animate-appear">
      <p className="font-bold text-xs mb-4 text-center">Setup your profile for this rally</p>
      <form className="flex flex-col" ref={form}>
        <fieldset className="space-y-3 mb-6">
          <FormRadioGroup
            className="text-xs"
            defaultValue={data()?.useLensProfile === true ? 'lens' : 'custom'}
            onChange={(value: string) => {
              setData('useLensProfile', value === 'lens' ? true : false)
              if (value === 'lens') {
                setFields('displayName', queryLensProfile?.data?.name)
                setFields('avatarUrl', queryLensProfile?.data?.picture?.original?.url)
              }
            }}
          >
            <RadioGroup.Label className="sr-only">How should we call you ?</RadioGroup.Label>
            <FormRadioOption disabled={queryLensProfile?.isLoading || !queryLensProfile?.data?.name} value="lens">
              Use my Lens profile
            </FormRadioOption>
            <FormRadioOption value="custom">Use a custom profile</FormRadioOption>
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
                disabled={data()?.useLensProfile === true}
                hasError={errors()?.displayName !== null ? true : false}
                name="displayName"
                scale="sm"
                placeholder="Your display name"
                id="displayName"
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
                disabled={data()?.useLensProfile === true}
                hasError={errors()?.avatarUrl !== null ? true : false}
                name="avatarUrl"
                scale="sm"
                placeholder="https://<some-url-to-a-valid-image-file>"
                id="avatarUrl"
                aria-describedby={`input-avatarUrl-description input-avatarUrl-helpblock`}
              />
            </FormField.InputField>
          </FormField>
        </fieldset>
        {data()?.avatarUrl !== '' && data()?.displayName !== '' && (
          <div className="mb-2 ">
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

        <Button
          type="submit"
          className="mx-auto animate-appear"
          disabled={
            !isValid() ||
            mutationJoinRoom.isLoading ||
            queryLensProfile?.isLoading ||
            (rallyJoined && rallyJoined?.id !== idRallyToJoin)
          }
          isLoading={mutationJoinRoom.isLoading}
        >
          {mutationJoinRoom.isLoading
            ? 'Checking your access...'
            : stateVoiceChat.isConnecting
            ? 'Joining ...'
            : '✨ Join now ✨'}
        </Button>
      </form>
    </div>
  )
}

export default FormJoinRoomAs
