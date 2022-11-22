import Button from "@components/Button"
import DialogModal from "@components/DialogModal"
import { useStoreCurrentLiveRally, useStoreLiveVoiceChat } from "@hooks/useVoiceChat"
import { useState } from "react"
import { useForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import { object, string } from 'zod'
import FormField from "@components/FormField"
import FormInput from "@components/FormInput"
import FormTextarea from "@components/FormTextarea"
import { trpc } from "@utils/trpc"

export const schema = object({
    pinnedMediaUrl: string().url(),
    pinnedMediaMessage: string().optional(),
  })

export const FormPin = (props) => {

    const { form, errors } = props
    return (
        <>

        <form ref={form}>
            <FormField>
                          <FormField.InputField>
                            <FormField.Label
                              className="text-xs !pb-1"
                              hasError={errors()?.pinnedMediaUrl !== null ? true : false}
                              htmlFor={`pinnedMediaUrl`}
                            >
                            Url of your media
                            </FormField.Label>
                            
                            <FormInput
                              scale="sm"
                              type={"url"}
                              required
                              hasError={errors()?.pinnedMediaUrl!== null ? true : false}
                              placeholder="A valid Ethereum address"
                              name={`pinnedMediaUrl`}
                              id={`pinnedMediaUrl`}
                              aria-describedby={`input-pinnedMediaUrl-description input-pinnedMediaUrl-helpblock`}
                            />
                          </FormField.InputField>
                          <FormField.HelpBlock
                            hasError={errors()?.pinnedMediaUrl !== null ? true : false}
                            id={`input-pinnedMediaUrl-helpblock`}
                          >
                            This is not a valid url
                          </FormField.HelpBlock>
                        </FormField>
                        <FormField>
                          <FormField.InputField>
                            <FormField.Label
                              className="text-xs !pb-1"
                              hasError={errors()?.pinnedMediaMessage ? true : false}
                              htmlFor={`pinnedMediaMessage`}
                            >
                              Text (optional)
                            </FormField.Label>
                            
                            <FormTextarea
                              hasError={errors().pinnedMediaMessage? true : false}
                              placeholder="A valid Ethereum address"
                              name={`pinnedMediaMessage`}
                              id={`pinnedMediaMessage`}
                              aria-describedby={`input-pinnedMediaMessage-description input-pinnedMediaMessage-helpblock`}
                            />
                          </FormField.InputField>
                        </FormField>
                        <Button
        type="submit"
        intent="neutral-outline">Pin to the Room</Button>
        </form>        
        
    </>
    )

}

export default FormPin