import { InformationCircleIcon } from '@heroicons/react/20/solid'
import FormConfigureJoinRoomAs from './Form'
export const JoinRoomAs = () => {
  return (
    <section className="animate-appear">
      <h2 className="font-bold">Join room as</h2>
      <p className="text-xs text-neutral-11">
        Configure your display name and avatar here to avoid configuring it everytime you join a rally.
      </p>
      <div className="flex items-center gap-1 mt-2 mb-6">
        <InformationCircleIcon className="w-5  text-neutral-12" />
        <p className="font-semibold text-xs">Your selection will only be saved locally.</p>
      </div>
      <div className="animate-appear pt-3">
        <FormConfigureJoinRoomAs />
      </div>
    </section>
  )
}

export default JoinRoomAs
