import Button from '@components/Button'
import CardRally from '@components/pages/search/rallies/ListFilteredRallies/CardRally'
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
  const { list, isError, isLoading, setSkip, skip, perPage } = props

  return (
    <>
      <ul className="animate-appear space-y-8 flex flex-col">
        {list.map((audioChat: any, i: number) => {
          return (
            <li
              className={`${isPast(audioChat.datetime_start_at) ? 'opacity-50' : ''} pt-6 animate-appear`}
              key={`${audioChat.cid}`}
            >
              <CardRally data={audioChat} />
            </li>
          )
        })}
      </ul>
      {list?.length > 0 && (
        <div className="animate-appear flex flex-col items-center xs:flex-row mx-auto pt-20 gap-3">
          <Button
            onClick={() => {
              setSkip(skip - perPage)
            }}
            scale="xs"
            className="w-fit-content"
            intent="neutral-ghost"
            isLoading={isLoading}
            disabled={isLoading || isError || skip === 0}
          >
            Show previous page
          </Button>
          <Button
            onClick={() => {
              setSkip(skip + perPage)
            }}
            scale="xs"
            className="w-fit-content"
            intent="neutral-ghost"
            isLoading={isLoading}
            disabled={isLoading || isError || list?.length === 0 || list?.length < perPage}
          >
            Show next page
          </Button>
        </div>
      )}
    </>
  )
}

export default ListFilteredRallies
