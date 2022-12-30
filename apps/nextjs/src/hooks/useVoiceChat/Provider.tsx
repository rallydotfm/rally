import { useRoom } from '@livekit/react-core'
import { ContextLiveVoiceChat } from './'
const roomOptions = {
  adaptiveStream: true,
  dynacast: true,
}
export const ProviderLiveVoiceChat = ({ children }: any) => {
  const stateRoom = useRoom(roomOptions)
  //@ts-ignore
  return <ContextLiveVoiceChat.Provider value={stateRoom}>{children}</ContextLiveVoiceChat.Provider>
}

export default ProviderLiveVoiceChat
