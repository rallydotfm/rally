import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useDisconnect, useNetwork } from 'wagmi'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { ROUTE_PROFILE, ROUTE_ACCOUNT, ROUTE_PREFERENCES_BROWSING } from '@config/routes'
import { useChainModal } from '@rainbow-me/rainbowkit'
import Profile from './Profile'
import { ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/20/solid'
import Button from '@components/Button'
import { useSession } from 'next-auth/react'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { useEnsIdentity } from '@hooks/useEnsIdentity'

interface MenuCurrentUserProps {
  address: string
}
export const MenuCurrentUser = (props: MenuCurrentUserProps) => {
  const { address } = props
  const { openChainModal } = useChainModal()
  const { disconnect } = useDisconnect()
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(address, {
    enabled: address ? true : false,
  })
  const { chain } = useNetwork()

  const queryEnsIdentity = useEnsIdentity(address as `0x${string}`, {
    enabled:
      (queryUserProfileLens?.isSuccess && queryUserProfileLens?.data === null) || queryUserProfileLens?.isError
        ? true
        : false,
  })

  const { status } = useSession()
  const setIsSignedIn = useStoreHasSignedInWithLens((state) => state.setIsSignedIn)

  return (
    <div className="flex items-center md:flex-col md:justify-center">
      {address && openChainModal && (chain?.unsupported || chain?.id === 1) && (
        <Button intent="negative-ghost" scale="xs" onClick={openChainModal} type="button">
          <ExclamationTriangleIcon className="w-5" />
          <span className="sr-only">Switch chain</span>
        </Button>
      )}

      <Menu as="div" className="w-full text-2xs static md:relative">
        <Menu.Button
          aria-label="Menu user profile"
          className={
            'rounded-3xl hover:bg-neutral-1 focus:bg-neutral-2 open:bg-neutral-2 flex md:flex-col lg:flex-row items-center py-2 px-2 justify-between'
          }
        >
          <span className="w-12 lg:w-10 h-12 lg:h-10 relative">
            <span className="w-full h-full absolute bg-neutral-5 rounded-full inset-0 animate-pulse" />
            <img
              className="w-full rounded-full bg-neutral-5 text-primary-11 h-full absolute inset-0 z-10 object-cover"
              src={
                /* @ts-ignore */
                queryUserProfileLens?.data?.picture?.original?.url
                  ? //@ts-ignore
                    queryUserProfileLens?.data?.picture?.original?.url.replace(
                      'ipfs://',
                      'https://lens.infura-ipfs.io/ipfs/',
                    )
                  : queryEnsIdentity?.data?.avatar && queryEnsIdentity?.data?.avatar !== null
                  ? queryEnsIdentity?.data?.avatar
                  : `https://avatars.dicebear.com/api/identicon/${address}.svg`
              }
              alt=""
            />
            {status !== 'authenticated' && (
              <span className="rounded-full bg-negative-1 p-0.5 aspect-square absolute z-20 bottom-0 translate-y-1/2 translate-x-1/4 inline-end-0">
                <ShieldExclamationIcon className="w-4 text-negative-11" />
              </span>
            )}
          </span>
          <span className="sr-only">
            Current user:
            {queryUserProfileLens?.isLoading ? (
              <>loading...</>
            ) : (
              queryUserProfileLens?.data?.name ?? shortenEthereumAddress(address)
            )}
          </span>
          <EllipsisHorizontalIcon className="hidden md:block md:mt-1 lg:mt-0 lg:mis-2 md:w-6" />
        </Menu.Button>
        <Menu.Items
          className={`
        border border-neutral-7 border-solid
        bg-neutral-5
        overflow-hidden flex flex-col
        absolute top-10/12
        md:top-0
        inline-start-1/2 -translate-x-1/2 md:-translate-x-1/4 lg:-translate-x-1/2 md:inline-start-full 
        w-72 2xs:w-56 max-w-screen
        md:mb-4
        divide-y divide-neutral-7 
        md:-translate-y-full 3xl:inline-start-1/2
        3xl:-translate-x-1/2
        rounded-md`}
        >
          <Menu.Item as="div" className="px-3 py-2">
            <Profile queryEns={queryEnsIdentity} queryLens={queryUserProfileLens} address={address} />
          </Menu.Item>
          {queryUserProfileLens?.data?.id && (
            <Menu.Item
              className="hover:bg-interactive-10 ui-active:bg-interactive-10 px-3 py-2"
              as={Link}
              href={ROUTE_PROFILE.replace('[handleLensProfile]', queryUserProfileLens?.data?.handle)}
            >
              My profile
            </Menu.Item>
          )}
          {queryUserProfileLens?.data?.handle && (
            <Menu.Item
              className="hover:bg-interactive-10 ui-active:bg-interactive-10 px-3 py-2"
              as={Link}
              href={ROUTE_ACCOUNT}
            >
              Account
            </Menu.Item>
          )}
          <Menu.Item
            className="hover:bg-interactive-10 ui-active:bg-interactive-10 px-3 py-2"
            as={Link}
            href={ROUTE_PREFERENCES_BROWSING}
          >
            Preferences
          </Menu.Item>

          <Menu.Item
            as="button"
            className="text-start ui-active:bg-interactive-10 px-3 py-2"
            onClick={async () => {
              setIsSignedIn(false)
              await disconnect()
            }}
          >
            Sign out
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}

export default MenuCurrentUser
