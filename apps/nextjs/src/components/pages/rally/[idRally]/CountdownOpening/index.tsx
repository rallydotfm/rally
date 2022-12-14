import { useCountdown } from './useCountdown'

interface CountdownOpeningProps {
  startsAt: Date
}
const CountdownOpening = (props: CountdownOpeningProps) => {
  const { startsAt } = props
  const { enabled, timeDifference } = useCountdown(startsAt)

  if (enabled)
    return (
      <p className="font-bold text-center opacity-75">
        <span className="text-2xs">Starts in</span> <br />
        <span className="text-3xl">{timeDifference}</span>
      </p>
    )
  return <p>Open !</p>
}

export default CountdownOpening
