import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useGetLensProfileByHandle from '@hooks/useGetLensProfileByHandle'
import Profile from '@components/pages/profile/[handleLensProfile]/Profile'

const Page: NextPage = (props) => {
  const {
    query: { handleLensProfile },
  } = useRouter()
  const queryLensProfile = useGetLensProfileByHandle(handleLensProfile as string, {
    enabled: handleLensProfile ? true : false,
  })

  return (
    <>
      <Head>
        <title>
          {' '}
          {queryLensProfile?.data?.handle
            ? `${queryLensProfile?.data?.name} (${handleLensProfile}) `
            : handleLensProfile ?? 'Profile '}
          - Rally
        </title>
        <meta
          name="description"
          content="Discover upcoming audio rooms on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      {queryLensProfile?.data ? (
        <>
          <Profile data={queryLensProfile?.data} />
        </>
      ) : queryLensProfile?.isLoading ? (
        <>loading</>
      ) : (
        queryLensProfile?.isError && <>error</>
      )}
    </>
  )
}

export default Page
