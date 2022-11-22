import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import usePinMessageToRoom from './usePinMessageToRoom'

export const FormPin = () => {
  const rally = useStoreCurrentLiveRally((state: any) => state.rally)
  const {
    storeForm: { errors, form, isValid },
    mutationPinMessageToRoom,
  } = usePinMessageToRoom(rally?.id)

  return (
    <>
      <form ref={form}>
        <fieldset className="space-y-5 mb-6">
          <FormField>
            <FormField.InputField>
              <FormField.Label
                className="text-xs !pb-1"
                hasError={errors()?.pinnedMediaUrl !== null ? true : false}
                htmlFor={`pinnedMediaUrl`}
              >
                Media URL
              </FormField.Label>

              <FormInput
                type="url"
                required
                hasError={errors()?.pinnedMediaUrl !== null ? true : false}
                placeholder="https://..."
                name="pinnedMediaUrl"
                id="pinnedMediaUrl"
                aria-describedby={`input-pinnedMediaUrl-description input-pinnedMediaUrl-helpblock`}
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={errors()?.pinnedMediaUrl !== null ? true : false}
              id={`input-pinnedMediaUrl-helpblock`}
            >
              The link to your media must be a valid url.
            </FormField.HelpBlock>
          </FormField>
          <FormField>
            <FormField.InputField>
              <FormField.Label
                className="text-xs !pb-1"
                hasError={errors()?.pinnedMediaMessage ? true : false}
                htmlFor={`pinnedMediaMessage`}
              >
                Text
              </FormField.Label>

              <FormTextarea
                hasError={errors().pinnedMediaMessage ? true : false}
                placeholder="A valid Ethereum address"
                name="pinnedMediaMessage"
                rows={3}
                id="pinnedMediaMessage"
                aria-describedby="input-pinnedMediaMessage-description input-pinnedMediaMessage-helpblock"
              />
            </FormField.InputField>
          </FormField>
        </fieldset>
        <Button
          isLoading={mutationPinMessageToRoom?.isLoading}
          disabled={mutationPinMessageToRoom?.isLoading || !isValid}
          type="submit"
        >
          {mutationPinMessageToRoom.isLoading ? 'Pinning...' : mutationPinMessageToRoom?.isError ? 'Try again' : 'Pin'}
        </Button>
      </form>
    </>
  )
}

export default FormPin
