import Button from '@components/Button'
import CardRally from './CardRally'
import { isPast } from 'date-fns'

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
                  isPast(audioChat.datetime_start_at) ? 'opacity-50' : ''
                } w-full h-full min-w-max-content 2xs:max-w-72 animate-appear snap-center`}
                key={`${audioChat.cid}`}
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
