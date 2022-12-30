import Button from '@components/Button'
import DialogModal from '@components/DialogModal'
import { useState } from 'react'
import {
  MicrophoneIcon as SolidMicrophoneIcon,
  HandRaisedIcon as SolidHandRaisedIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SignalSlashIcon,
} from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon, HandRaisedIcon, MicrophoneIcon, HeartIcon } from '@heroicons/react/24/outline'

export const DialogModalStageGuide = () => {
  const [isDialogVisible, setDialogVisibility] = useState(false)

  return (
    <>
      <Button
        scale="sm"
        type="button"
        title="Click here to open the Rally stage guide"
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto self-center relative aspect-square w-10 items-center justify-center !p-0"
        intent="neutral-ghost"
      >
        <QuestionMarkCircleIcon className="w-7" />
      </Button>
      <DialogModal title="Rally stage guide" isOpen={isDialogVisible} setIsOpen={setDialogVisibility}>
        <section>
          <h2 className="mb-4 text-sm font-bold">Particiant controls</h2>
          <ul className="text-xs flex flex-col space-y-6 font-medium">
            <li className="inline-flex gap-4 items-center">
              <SolidMicrophoneIcon className="w-7 shrink-0" />
              <p className="text-neutral-12">Your microphone is enabled</p>
            </li>
            <li className="inline-flex gap-4 items-center">
              <div className="relative">
                <MicrophoneIcon className="w-7 shrink-0" />

                <XMarkIcon className="absolute shadow w-[1.2rem] bottom-0 inline-end-0 translate-y-1/4 translate-x-1/2 text-negative-9" />
              </div>
              <p className="text-neutral-12">Your microphone is muted or disabled</p>
            </li>
            <li className="inline-flex gap-5 items-center">
              <HandRaisedIcon className="w-6 shrink-0" />
              <p className="text-neutral-12">Raise hand (request to speak)</p>
            </li>

            <li className="inline-flex gap-5 items-center">
              <HeartIcon className="w-6 shrink-0" />
              <p className="text-neutral-12">Silently react to the conversation with an emoji</p>
            </li>
            <li className="inline-flex gap-7 items-center">
              <ArrowRightOnRectangleIcon className="shrink-0 w-5 text-negative-11" />
              <p className="text-neutral-12">Leave the room quietly</p>
            </li>
            <li className="text-neutral-11 italic text-2xs">
              You can also click on a participant to locally mute/unmute them
            </li>
          </ul>
        </section>
        <section className="mt-5 pt-5 border-t border-neutral-4">
          <h2 className="mb-4 text-sm font-bold">Host controls</h2>
          <ul className="text-xs flex flex-col space-y-6 font-medium">
            <li className="inline-flex gap-4 items-center">
              <div className="border border-neutral-7 shrink-0 aspect-square rounded-full flex items-center justify-center w-12">
                <SolidHandRaisedIcon className="w-5" />
              </div>
              <p className="text-neutral-12">View and manage participants who have their hand raised</p>
            </li>
            <li className="text-neutral-11 italic text-2xs">
              You can also click on a participant to invite them, send them back to the audience or kick them out of the
              rally
            </li>
          </ul>
        </section>
        <section className="mt-5 pt-5 border-t border-neutral-4">
          <h2 className="mb-4 text-sm font-bold">Creator controls</h2>
          <ul className="text-xs flex flex-col space-y-6 font-medium">
            <li className="inline-flex gap-7 items-center">
              <SignalSlashIcon className="shrink-0 w-5 text-negative-11" />
              <p className="text-neutral-12">End the rally and close the room</p>
            </li>
            <li className="text-neutral-11 italic text-2xs">
              Once a rally is ended, every participant will be kicked out of the room and no one will be able to access
              the room anymore
            </li>
          </ul>
        </section>
      </DialogModal>
    </>
  )
}

export default DialogModalStageGuide
