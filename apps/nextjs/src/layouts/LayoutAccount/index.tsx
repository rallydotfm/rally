import { ROUTE_ACCOUNT, ROUTE_ACCOUNT_MEMBERSHIP, ROUTE_ACCOUNT_PERMISSIONS } from '@config/routes'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import DialogModalEditProfilePicture from './DialogModalEditProfilePicture'
import { useAccount } from 'wagmi'
import { getLayout as getBaseLayout } from '../LayoutBase'
import { useState } from 'react'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import Notice from '@components/Notice'
import NavMenu from '@components/NavMenu'
import { useSession } from 'next-auth/react'

interface LayoutProps {
  children: React.ReactNode
}

export const LayoutAccount = (props: LayoutProps) => {
  const { children } = props
  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)
  const session = useSession()
  const account = useAccount()
  const [isDialogEditProfilePictureOpen, setIsDialogEditProfilePictureOpen] = useState(false)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  return (
    <>
      <div className="flex text-center xs:text-start flex-col-reverse xs:flex-row items-center xs:space-i-7">
        <button
          onClick={() => setIsDialogEditProfilePictureOpen(true)}
          className="block relative shrink-0 w-28 h-28 overflow-hidden rounded-md"
        >
          <span className="block bg-neutral-5 absolute w-full h-full inset-0 animate-pulse" />
          {/* @ts-ignore */}
          {queryLensProfile?.data?.picture?.original?.url && (
            <img
              className="w-full h-full object-cover overflow-hidden absolute inset-0 z-10"
              //@ts-ignore
              src={queryLensProfile?.data?.picture?.original?.url.replace(
                'ipfs://',
                'https://lens.infura-ipfs.io/ipfs/',
              )}
              alt=""
            />
          )}
        </button>
        <div>
          <h1 className="font-bold text-xl">Account</h1>
          <span className="font-mono text-neutral-11 text-xs">{queryLensProfile?.data?.id}</span>
        </div>
      </div>
      <NavMenu
        routes={[
          {
            href: ROUTE_ACCOUNT,
            label: 'Profile',
          },
          {
            href: ROUTE_ACCOUNT_MEMBERSHIP,
            label: 'Membership',
          },
          {
            href: ROUTE_ACCOUNT_PERMISSIONS,
            label: 'Permissions',
          },
        ]}
      />

      {queryLensProfile?.data && (
        <div className="flex flex-col pt-8 animate-appear">
          {/** @ts-ignore */}
          {session?.data?.address && account?.address && isSignedIn ? (
            <>
              {children}
              <DialogModalEditProfilePicture
                profile={queryLensProfile?.data}
                isOpen={isDialogEditProfilePictureOpen}
                setIsOpen={setIsDialogEditProfilePictureOpen}
              />
            </>
          ) : (
            <>
              <Notice intent="primary-outline" className="mt-9 max-w-screen-xs mx-auto text-center">
                <h2 className="text-md font-bold">Sign-in with Lens</h2>
                <p className="!font-[500] text-neutral-12 mt-2">
                  Connect and verify your wallet then sign-in with Lens to access this page.
                </p>
              </Notice>
            </>
          )}
        </div>
      )}
    </>
  )
}

export const getLayout = (page: any) => {
  return getBaseLayout(<LayoutAccount>{page}</LayoutAccount>)
}
export default LayoutAccount
