import { useIntervalEffect } from '@react-hookz/web'
import { differenceInHours, intervalToDuration, isBefore, isFuture, isPast } from 'date-fns'
import { useState } from 'react'

function getIntervals(endDatetime: Date) {
  const interval = intervalToDuration({
    start: isBefore(new Date(), endDatetime) ? new Date() : endDatetime,
    end: endDatetime,
  })

  return `${differenceInHours(endDatetime, new Date())}:${interval.minutes}:${interval.seconds}`
}

export function useCountdown(startsAt: Date) {
  const [timeDifference, setTimeDifference] = useState(getIntervals(startsAt))
  const [enabled, setEnabled] = useState(isFuture(startsAt) ? true : false)
  useIntervalEffect(
    () => {
      if (isPast(startsAt)) setEnabled(false)
      else {
        setTimeDifference(getIntervals(startsAt))
      }
    },
    enabled ? 1000 : undefined,
  )

  return {
    enabled: enabled ? true : false,
    timeDifference,
  }
}

export default useCountdown
