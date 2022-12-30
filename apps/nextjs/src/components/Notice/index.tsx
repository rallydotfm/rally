import notice from './styles'
import type { SystemUiNoticeProps } from './styles'
interface NoticeProps extends SystemUiNoticeProps {
  children: React.ReactNode
  className?: string
}
export const Notice = (props: NoticeProps) => {
  const { children, className, ...rest } = props
  return (
    <div
      role="alert"
      className={notice({
        ...rest,
        class: `animate-appear ${className ? className : ''}`,
      })}
    >
      {children}
    </div>
  )
}

export default Notice
