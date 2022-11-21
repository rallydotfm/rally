interface UserRoleProps {
  permissions: {
    canSubscribe: boolean
    canPublishData: boolean
    canPublish: boolean
  }
}
export const UserRole = (props: UserRoleProps) => {
  const {
    permissions: { canSubscribe, canPublishData, canPublish },
  } = props
  if (canSubscribe && canPublishData && canPublish) return <span>Host</span>
  if (canSubscribe && canPublish) return <span>Guest</span>
  if (canSubscribe) return <span>Listener</span>
  return null
}

export default UserRole
