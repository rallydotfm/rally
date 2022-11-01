import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { eachDayOfInterval, endOfWeek, format, formatRelative, getDay, startOfWeek } from 'date-fns'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { CalendarIcon } from '@heroicons/react/20/solid'

export default function CalendarWeek(props) {
  const [weekDay] = useState(
    eachDayOfInterval({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    }).map((day) => ({
      date: day,
      day: format(new Date(day), 'dd'),
    })),
  )
  const { events } = props

  return (
    <div className="w-full animate-appear">
      <Tab.Group defaultIndex={getDay(new Date())}>
        <Tab.List className="w-screen xs:w-full grid gap-3 grid-cols-7 -mx-6 px-2 xs:mx-0 xs:px-0">
          {weekDay.map((tab) => (
            <Tab
              key={`${tab.day}`}
              className="col-span-1 bg-white py-1 px-0.5 xs:px-2 ui-not-selected:bg-opacity-5 ui-selected:bg-opacity-95 flex flex-col rounded-md ui-selected:font-medium ui-not-selected:text-white ui-selected:text-black"
            >
              <span className="text-2xs">
                <span className="sr-only">{format(new Date(tab.date), 'iiii')}</span>
                <span className="xs:hidden">{format(new Date(tab.date), 'EEEEEE')}</span>
                <span className="hidden xs:block">{format(new Date(tab.date), 'iiiiii')}</span>
              </span>
              <span className="text-sm">{tab.day}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {weekDay.map((tab) => (
            <Tab.Panel key={`panel-${tab.day}`}>
              <ul className="space-y-4 divide-y divide-neutral-4">
                {events
                  .filter((event) => {
                    return getDay(event.data.datetime_start_at) === getDay(tab.date)
                  })
                  .map((audioChat, i) => (
                    <li className="animate-appear" key={`panel-${audioChat.cid}`}>
                      <span className="font-bold block mb-2">{format(audioChat.data.datetime_start_at, 'HH:mm')}</span>
                      <article className="flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-6">
                        <div className="relative w-full overflow-hidden xs:w-20 sm:w-32 aspect-twitter-card rounded-t-md xs:rounded-b-md">
                          <div className="bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
                          <img
                            alt=""
                            loading="lazy"
                            width="128px"
                            height="86px"
                            src={`https://ipfs.io/ipfs/${audioChat.data.image}`}
                            className="relative z-10 block w-full h-full object-cover "
                          />
                        </div>

                        <div className="px-4 flex-grow flex flex-col xs:px-0">
                          <h1 className="font-bold">{audioChat.data.name}</h1>
                          <p className="text-neutral-12 uppercase font-bold tracking-wide text-2xs mt-2">
                            {audioChat.data.is_private ? 'Gated access' : 'Free access'}
                          </p>
                          <p className="text-neutral-11 text-2xs mt-2">{audioChat.data.cohosts_list.length} cohosts</p>
                        </div>
                      </article>
                    </li>
                  ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
