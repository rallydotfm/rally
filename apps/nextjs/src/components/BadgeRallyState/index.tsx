import { badge } from './styles'
import type { SystemUiBadgeProps } from './styles'

interface BadgeRallyStateProps extends SystemUiBadgeProps {
  className?: string
}

export const BadgeRallyState = (props: BadgeRallyStateProps) => {
  const { state, scale, className } = props
  return (
    <mark
      className={badge({
        state: state,
        scale: scale,
        class: `${className ? className : ''}`,
      })}
    >
      {state}
    </mark>
  )
}

export default BadgeRallyState
