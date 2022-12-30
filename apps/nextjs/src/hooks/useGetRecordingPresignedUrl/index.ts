import { trpc } from '@utils/trpc'

export function useGetRecordingPresignedUrl(opts: any) {
  const mutationRecordingPresignedUrl = trpc.recordings.recording_presigned_url.useMutation(opts)
  return mutationRecordingPresignedUrl
}

export default useGetRecordingPresignedUrl
