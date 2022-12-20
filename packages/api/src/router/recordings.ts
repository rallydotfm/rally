import { public_procedure, router } from '../trpc'
import { getToken } from 'next-auth/jwt'
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { number, object, string } from 'zod'

const secret = process.env.NEXTAUTH_SECRET
const REGION = 'eu-central-1'
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  region: REGION,
})

export const recordingsRouter = router({
  recording_presigned_url: public_procedure
    .input(
      object({
        id_rally: string(),
        filename: string(),
        size: number().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, id_rally } = input
      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })
        const user_ethereum_address = sub
        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        console.log(`${process.env.S3_RECORDINGS_BASE_KEY as string}/${user_ethereum_address}/${id_rally}/${filename}`)
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          ResponseContentDisposition: 'attachment; filename="recording.ogg"',
          Key: `${process.env.S3_RECORDINGS_BASE_KEY as string}/${user_ethereum_address}/${id_rally}/${filename}`,
        }
        const command = new GetObjectCommand(params)
        const signed_url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // 1h,
        })

        return signed_url
      } catch (e) {
        console.error(e)
      }
    }),
  user_available_raw_recordings: public_procedure.query(async ({ ctx }) => {
    try {
      // get current user wallet address from the session
      //@ts-ignore
      const { sub } = await getToken({ req: ctx.req, secret })

      // if not connected, throw an error
      if (!sub) throw Error('Not connected')

      const user_ethereum_address = sub
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Delimiter: `${process.env.RECORDINGS_BASE_PATH}/${user_ethereum_address}`,
      }
      const command = new ListObjectsV2Command(params)
      const raw_list = await s3Client.send(command)
      const list_rallies = {}

      raw_list?.Contents?.map((stored_file: any) => {
        const splitted = stored_file?.['Key']?.split('/')
        const id_rally = splitted?.[splitted?.length - 2]
        const key = splitted?.[splitted?.length - 1]
        //@ts-ignore
        if (!key?.includes('json')) list_rallies[id_rally] = [...(list_rallies[id_rally] ?? []), key]
      })

      return list_rallies
    } catch (e) {
      console.error(e)
    }
  }),
  rally_available_recordings: public_procedure
    .input(
      object({
        id_rally: string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id_rally } = input
      try {
        // get current user wallet address from the session
        //@ts-ignore
        const { sub } = await getToken({ req: ctx.req, secret })

        // if not connected, throw an error
        if (!sub) throw Error('Not connected')

        const user_ethereum_address = sub
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Delimiter: `${process.env.RECORDINGS_BASE_PATH}/${user_ethereum_address}/${id_rally}`,
        }
        const command = new ListObjectsV2Command(params)
        const raw_list = await s3Client.send(command)
        const list = raw_list?.Contents?.map((stored_file: any) => {
          const splitted = stored_file?.['Key']?.split('/')
          const key = splitted?.[splitted?.length - 1]
          return {
            name: key,
            size: stored_file?.Size,
          }
        })?.filter((obj) => !obj?.name?.includes('.json'))
        return list
      } catch (e) {
        console.error(e)
      }
    }),
})
