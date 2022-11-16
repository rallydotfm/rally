import { useRoom } from '@livekit/react-core'
import { ContextLiveVoiceChat } from './'
const roomOptions = {
  adaptiveStream: true,
  dynacast: true,
}
export const ProviderLiveVoiceChat = ({ children }) => {
  const stateRoom = useRoom(roomOptions)
  return <ContextLiveVoiceChat.Provider value={stateRoom}>{children}</ContextLiveVoiceChat.Provider>
}

export default ProviderLiveVoiceChat
