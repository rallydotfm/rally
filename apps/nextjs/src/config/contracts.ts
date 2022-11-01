import { audioChatABI } from '@rally/abi'

export const CONTRACT_LENS_HUB_PROXY = process.env.NEXT_PUBLIC_CONTRACT_LENS_HUB_PROXY
export const CONTRACT_LENS_PERIPHERY = process.env.NEXT_PUBLIC_CONTRACT_LENS_PERIPHERY
export const CONTRACT_AUDIO_CHATS = process.env.NEXT_PUBLIC_CONTRACT_AUDIOCHAT

export const contractConfigAudioChat = {
  address: CONTRACT_AUDIO_CHATS,
  abi: audioChatABI,
}
