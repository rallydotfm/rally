import { getLayout as getBaseLayout } from '../LayoutBase'
import { useAccount } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useGetLensProfileByHandle from '@hooks/useGetLensProfileByHandle'
import { useRouter } from 'next/router'
import Profile from './Profile'

export const LayoutProfile = (props: any) => {
  const { children } = props
  const {
    query: { handleLensProfile },
  } = useRouter()
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state: any) => state.isSignedIn)

  const queryLensProfile = useGetLensProfileByHandle(handleLensProfile as string, {
    enabled: handleLensProfile || isSignedIn || account?.address ? true : false,
  })
  return (
    <>
      {queryLensProfile?.data ? (
        <>
          {/* @ts-ignore */}
          <Profile data={queryLensProfile?.data}>{children}</Profile>
        </>
      ) : queryLensProfile?.isLoading ? (
        <>
          <div className=" w-full h-[30vh] bg-neutral-5 animate-pulse block" />
          <div className="relative z-10 bg-neutral-5 block -mt-12 rounded-full ring-8 ring-black overflow-hidden w-32 h-32 xs:w-40 xs:h-40" />
        </>
      ) : (
        queryLensProfile?.isError && (
          <div className="flex flex-col text-center">
            <p className="text-xs text-neutral-11">
              Something went wrong and we couldn't fetch the profile associated to {queryLensProfile?.data?.handle}.
            </p>
          </div>
        )
      )}
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutProfile>{page}</LayoutProfile>)
}

export default LayoutProfile
