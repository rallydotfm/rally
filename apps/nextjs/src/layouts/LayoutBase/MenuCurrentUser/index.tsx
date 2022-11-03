import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useDisconnect, useEnsName } from 'wagmi'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { getDefaultProfile } from '@services/lens/profile/getDefaultProfile'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import { ROUTE_PROFILE, ROUTE_ACCOUNT_PREFERENCES } from '@config/routes'
import Profile from './Profile'

interface MenuCurrentUserProps {
  address: string
}
export const MenuCurrentUser = (props: MenuCurrentUserProps) => {
  const { address } = props
  const { disconnect } = useDisconnect()
  const queryUserProfileLens = useQuery(['lens-profile', address], async () => {
    try {
      const result = await getDefaultProfile({
        ethereumAddress: address,
      })
      //@ts-ignore
      if (result?.error) throw new Error(result?.error)
      return result?.data?.defaultProfile
    } catch (e) {
      console.error(e)
    }
  })

  const queryEns = useEnsName({
    chainId: 1,
    address: address as `0x${string}`,
  })

  return (
    <Menu as="div" className="w-full text-xs relative">
      <Menu.Button
        aria-label="Menu user profile"
        className={
          'rounded-3xl hover:bg-neutral-1 focus:bg-neutral-2 open:bg-neutral-2 flex md:flex-col lg:flex-row items-center py-2 px-2 justify-between'
        }
      >
        <span className="w-12 lg:w-10 h-12 lg:h-10 relative rounded-full overflow-hidden">
          <span className="w-full h-full absolute bg-neutral-5 inset-0 animate-pulse" />
          <img
            className="w-full bg-neutral-5 text-primary-11 h-full absolute inset-0 z-10 object-cover"
            src={
              /* @ts-ignore */
              queryUserProfileLens?.data?.picture?.original?.url?.replace(
                'ipfs://',
                'https://lens.infura-ipfs.io/ipfs/',
              ) ?? `https://avatars.dicebear.com/api/identicon/${address}.svg`
            }
            alt=""
          />
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
      <Menu.Items className="border border-neutral-6 border-solid overflow-hidden flex flex-col absolute top-full w-screen max-w-screen-xs -inline-start-5 mt-2 md:max-w-72 md:mb-4 md:mt-0 md:top-0 md:-translate-y-full md:left-0 divide-y 3xl:left-1/2 3xl:-translate-x-1/2 divide-neutral-4 rounded-md bg-neutral-3 shadow-lg">
        <Menu.Item as="div" className="px-3 py-1.5">
          <Profile queryEns={queryEns} queryLens={queryUserProfileLens} address={address} />
        </Menu.Item>
        {queryUserProfileLens?.data?.id && (
          <Menu.Item as={Link} href={ROUTE_PROFILE.replace('[idLensProfile]', queryUserProfileLens?.data?.id)}>
            <a className="ui-active:bg-interactive-10 px-3 py-1.5">My profile</a>
          </Menu.Item>
        )}
        <Menu.Item as={Link} href={ROUTE_ACCOUNT_PREFERENCES}>
          <a className="ui-active:bg-interactive-10 px-3 py-1.5">Preferences</a>
        </Menu.Item>
        <Menu.Item
          as="button"
          className="text-start ui-active:bg-interactive-10 px-3 py-1.5"
          onClick={() => disconnect()}
        >
          Sign out
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default MenuCurrentUser
