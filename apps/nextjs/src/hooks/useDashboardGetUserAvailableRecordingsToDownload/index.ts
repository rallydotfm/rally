import { trpc } from '@utils/trpc'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'

export function useDashboardGetUserAvailableRecordingsToDownload() {
  const { data: session } = useSession()
  const account = useAccount()
  //@ts-ignore
  const queryUserAvailableRecordingsToDownload = trpc.recordings.user_available_raw_recordings.useQuery(undefined, {
    //@ts-ignore
    enabled: account?.address && account?.address === session?.address ? true : false,
  })
  return queryUserAvailableRecordingsToDownload
}

export default useDashboardGetUserAvailableRecordingsToDownload
