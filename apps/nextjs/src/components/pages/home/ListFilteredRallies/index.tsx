import Button from '@components/Button'
import CardRally from './CardRally'
import { isPast } from 'date-fns'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

interface ListFilteredRalliesProps {
  list: Array<any>
  skip: number
  isLoading: boolean
  isError: boolean
  perPage: number
  setSkip: (skip: number) => void
}
export const ListFilteredRallies = (props: ListFilteredRalliesProps) => {
  const { list } = props

  return (
    <>
      <ul className="animate-appear snap-x pb-4 gap-4 flex overflow-x-auto">
        {list.map((audioChat: any, i: number) => {
          return (
            <>
              <li
                className={`${
                  [
                    DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
                    DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label,
                  ].includes(audioChat.state)
                    ? 'opacity-50'
                    : ''
                } w-full h-[inherit] min-w-max-content 2xs:max-w-72 animate-appear snap-center`}
                key={`filtered-rallies-home${audioChat.cid}`}
              >
                <CardRally data={audioChat} />
              </li>
            </>
          )
        })}
      </ul>
    </>
  )
}

export default ListFilteredRallies
