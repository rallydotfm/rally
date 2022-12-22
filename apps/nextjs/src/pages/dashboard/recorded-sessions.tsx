import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutDashboard'
import { trpc } from '@utils/trpc'

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Rally</title>
        <meta
          name="description"
          content="Manage your recordings on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <p>This page is under construction.</p>
      <button
        onClick={async () => {
          const r = await downloadRecordingsMutation.mutateAsync()
        }}
      >
        Download recording
      </button>
      <button
        onClick={() => {
          let audio = new Audio(
            'https://rally-demo.gateway.storjshare.io/rec/0x82B16fBdB9e1AA666b007A9dF40d2dCeFBAEA791/0x84789b39592df4cbd5317ac0a2c345d44c6fae7150a77ac3fc8bc87505cd3f40/1671313962.ogg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=jvhrdmi4qaw266lvxxl7gh6nxuxq%2F20221219%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20221219T114428Z&X-Amz-Expires=259200&X-Amz-Signature=ae3be937082b3ea0cfa0741e1a30597c9184fe566ce33d57c2871130239f1980&X-Amz-SignedHeaders=host&x-id=GetObject',
          )
          audio.play()
        }}
      >
        Play recording
      </button>
    </>
  )
}
//@ts-ignore
Page.getLayout = getLayout

export default Page
