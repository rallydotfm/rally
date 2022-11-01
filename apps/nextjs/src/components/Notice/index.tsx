import notice from './styles'

export const Notice = (props) => {
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
