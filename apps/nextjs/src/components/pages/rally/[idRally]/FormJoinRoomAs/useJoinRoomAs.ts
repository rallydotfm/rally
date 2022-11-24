import { useConnectToVoiceChat } from '@hooks/useVoiceChat'
import { useForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import { boolean, object, string } from 'zod'
import { useAccount } from 'wagmi'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'

export const schema = object({
  useLensProfile: boolean(),
  displayName: string().trim().min(1),
  avatarUrl: string().url().optional(),
})
export function useJoinRoomAs(dataAudioChat: any) {
  const { mutationJoinRoom } = useConnectToVoiceChat(dataAudioChat)

  const account = useAccount()
  const queryLensProfile = useWalletAddressDefaultLensProfile(
    account?.address as `0x${string}`,
    account?.address ? true : false,
  )

  const storeForm = useForm({
    extend: validator({ schema }),
    initialValues: {
      useLensProfile: false,
      displayName: shortenEthereumAddress(account?.address as `0x${string}`),
      avatarUrl: `https://avatars.dicebear.com/api/identicon/${account?.address}.svg`,
    },
    onSubmit: async (values) => {
      await mutationJoinRoom.mutateAsync({
        id_rally: dataAudioChat?.id as `0x${string}`,
        cid_rally: dataAudioChat?.cid as string,
        display_name: values?.displayName,
        avatar_url: values?.avatarUrl,
      })
    },
  })

  return {
    mutationJoinRoom,
    storeForm,
    queryLensProfile,
  }
}

export default useJoinRoomAs
