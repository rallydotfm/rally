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
import FormPin from "./FormPin"

export const schema = object({
    pinnedMediaUrl: string().url(),
    pinnedMediaMessage: string().optional(),
  })

export const DialogModalListPinnedItems = () => {

    const  storeForm = useForm({
        validate: (values) => {
            const errors = {}
            console.log("values", values)
            return errors;
          },
          extend: validator({ schema }),
          onSubmit: (values
          ) => {
            console.log("my sch ", values)
          }
        
        
        
    });
    const rally = useStoreCurrentLiveRally((state: any) => state.rally)
    const [isDialogVisible, setDialogVisibility] = useState(false)
    const stateVoiceChat: any = useStoreLiveVoiceChat()
    const mutation = trpc.room.pin_message_in_chat.useMutation();

    const handlePinMessageToChat = async () => {
        const name = 'John Doe';
        //mutation.mutate({ name });
      };

    return (
        <>
    <Button
        scale="sm"
        type="button"
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto relative aspect-square w-fit-content"
        intent="neutral-outline"
      >
      </Button>
        <DialogModal
        title="List of participants that would like to join the stage"
        isOpen={isDialogVisible}
        setIsOpen={setDialogVisibility}>
        <FormPin {...storeForm}/>

      </DialogModal>
        
        
    </>
    )

}

export default DialogModalListPinnedItems