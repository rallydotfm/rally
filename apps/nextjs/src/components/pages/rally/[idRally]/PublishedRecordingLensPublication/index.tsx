import { Disclosure, Transition } from '@headlessui/react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid'
import ButtonCollectPublication from '@components/ButtonCollectPublication'
import ButtonMirrorPublication from '@components/ButtonMirrorPublication'
import { IconSpinner } from '@components/Icons'
import LensPublicationContent from '@components/LensPublicationContent'
import { ROUTE_PROFILE } from '@config/routes'
import { Square2StackIcon } from '@heroicons/react/24/outline'
import { ArrowsRightLeftIcon, Square2StackIcon as SolidSquare2StackIcon } from '@heroicons/react/20/solid'
import { useGetLinkedLensPublicationById } from '@hooks/useGetLinkedLensPublicationById'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import getPublicationsRequest from '@services/lens/publications/getPublications'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatRelative } from 'date-fns'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import PublishedRecordingAbout from '../PublishedRecordingAbout'
import PostComment from './PostComment'

interface PublishedRecordingLensPublicationProps {
  idLensPublication: string
  idRally: string
  initialContent: string
}
export const PublishedRecordingLensPublication = (props: PublishedRecordingLensPublicationProps) => {
  const { idLensPublication, idRally } = props
  const queryClient = useQueryClient()
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const queryLinkedLensPublication = useGetLinkedLensPublicationById({
    idRally,
    idLensPublication,
    idProfile: queryLensProfile?.data?.id,
    options: {
      enabled: idLensPublication && idLensPublication !== '' ? true : false,
    },
  })
  const queryCommentFeed = useQuery(
    ['publication-comment-feed', idLensPublication, queryLensProfile?.data?.id ?? null],
    async () => {
      const result = await getPublicationsRequest(
        {
          commentsOf: idLensPublication,
          limit: 50,
        },
        queryLensProfile?.data?.id,
      )
      return result
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  )

  if (queryLinkedLensPublication?.isLoading)
    return (
      <div className="mx-auto pt-8 px-6 animate-appear flex items-center space-i-1ex">
        <IconSpinner className="animate-spin text-md " />
        <p className="font-medium animate-pulse">Loading linked publication...</p>
      </div>
    )

  return (
    <>
      <section className="mt-8 w-full">
        <article className="animate-appear text-center">
          <header className="py-3 border-b px-3 md:px-6 -mx-3 md:-mx-6 border-neutral-4 text-neutral-10 text-2xs">
            Published on Lens&nbsp;·&nbsp;
            {formatRelative(new Date(queryLinkedLensPublication?.data?.publication?.createdAt), new Date())}
          </header>
          <PublishedRecordingAbout publication={queryLinkedLensPublication?.data?.publication} />
          <ul className="pt-4 max-w-screen-2xs mx-auto flex gap-10 justify-center items-center">
            <li className="flex flex-col items-center gap-2">
              <ButtonCollectPublication
                optionsCollectMutation={{
                  async onSuccess() {
                    await queryClient.invalidateQueries(['linked-lens-publication-by-id', idLensPublication, idRally])
                  },
                }}
                idPublication={idLensPublication}
                disabled={!isSignedIn || (isSignedIn && !queryLensProfile?.data?.id)}
              >
                {queryLinkedLensPublication?.data?.publication?.hasCollectedByMe === false ? (
                  <Square2StackIcon className="text-primary-8 stroke-2 hover:text-primary-10 focus:text-primary-11 w-[1.2rem]" />
                ) : (
                  <SolidSquare2StackIcon className="text-primary-9 hover:text-primary-10 focus:text-primary-11 w-[1.2rem]" />
                )}
              </ButtonCollectPublication>
              <span className="flex text-2xs gap-x-2 gap-y-0 items-baseline flex-wrap justify-center">
                <span className="font-bold text-xs animate-appear">
                  {queryLinkedLensPublication?.data?.publication?.stats?.totalAmountOfCollects}
                </span>
                <span className="font-medium text-neutral-10 text-[0.75rem]">
                  <span>
                    {' '}
                    collect
                    {/* @ts-ignore */}
                    {parseInt(queryLinkedLensPublication?.data?.publication?.stats?.totalAmountOfCollects) > 1
                      ? 's'
                      : ''}
                  </span>
                </span>
              </span>
            </li>

            <li className="flex flex-col items-center gap-2">
              <ButtonMirrorPublication
                optionsMirrorMutation={{
                  async onSuccess() {
                    await queryClient.invalidateQueries(['linked-lens-publication-by-id', idLensPublication, idRally])
                  },
                }}
                idPublication={idLensPublication}
              >
                <span className="sr-only"> Mirror this publication</span>
                <ArrowsRightLeftIcon
                  className={`${
                    //@ts-ignore
                    queryLinkedLensPublication?.data?.publication?.mirrors?.length > 0
                      ? 'text-primary-9'
                      : 'text-neutral-9'
                  } hover:text-primary-10 focus:text-primary-11 w-[1.2rem]`}
                />
              </ButtonMirrorPublication>
              <span className="flex text-2xs gap-x-2 gap-y-0 items-baseline flex-wrap justify-center">
                <span className="font-bold text-xs animate-appear">
                  {queryLinkedLensPublication?.data?.publication?.stats?.totalAmountOfMirrors}
                </span>
                <span className="font-medium text-neutral-10 text-[0.75rem]">
                  <span>
                    {' '}
                    mirror
                    {/* @ts-ignore */}
                    {parseInt(queryLinkedLensPublication?.data?.publication?.stats?.totalAmountOfMirrors) > 1
                      ? 's'
                      : ''}
                  </span>
                </span>
              </span>
            </li>
          </ul>

          <div className="-mx-3 md:-mx-6">
            <section className="w-full border-neutral-4 border-t mt-4 pt-4 text-start">
              <div className="px-3 md:px-6">
                <div className="flex pb-8">
                  {account?.address &&
                  isSignedIn &&
                  queryLensProfile?.data?.id &&
                  queryLensProfile?.data?.ownedBy === account?.address ? (
                    <div className="animate-appear border-neutral-4 bg-neutral-1 border w-full rounded-md p-3">
                      <Disclosure>
                        <Disclosure.Button className="flex items-center text-sm font-bold text-neutral-12">
                          <ChatBubbleLeftRightIcon className="mis-2 w-5 text-neutral-11 mie-1ex" />
                          Comment
                        </Disclosure.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel className="pt-4">
                            <PostComment idLensPublication={idLensPublication} />
                          </Disclosure.Panel>
                        </Transition>
                      </Disclosure>
                    </div>
                  ) : (
                    <p className="text-xs italic text-neutral-11">
                      Connect your wallet and sign-in with your Lens to comment.
                    </p>
                  )}
                </div>

                <h2 className="font-bold text-md mb-3 mt-6">
                  {queryCommentFeed?.data?.publications?.items?.length}&nbsp; comment
                  {/* @ts-ignore */}
                  {parseInt(queryCommentFeed?.data?.publications?.items?.length) > 1 ? 's' : ''}
                </h2>
                <ul className="divide-y divide-neutral-4 -mx-3 md:-mx-6">
                  {queryCommentFeed?.data?.publications?.items?.map((comment) => {
                    const profile = comment?.profile
                    return (
                      <li
                        className={`${
                          //@ts-ignore
                          comment?.indexed === false ? 'animate-pulse' : 'animate-appear'
                        } px-3 md:px-6 py-4 text-sm`}
                        key={comment?.id}
                      >
                        <div className="flex gap-4">
                          <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile?.handle)}>
                            <a className="shrink-0 w-12 h-12 mie-2 bg-neutral-5 rounded-full overflow-hidden">
                              <img
                                className="w-full h-full object-cover"
                                src={
                                  //@ts-ignore
                                  profile?.picture?.original?.url?.replace(
                                    'ipfs://',
                                    'https://lens.infura-ipfs.io/ipfs/',
                                  ) ?? `https://avatars.dicebear.com/api/identicon/${profile?.ownedBy}.svg`
                                }
                                alt=""
                              />
                            </a>
                          </Link>
                          <div className="flex flex-col">
                            <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', profile?.handle)}>
                              <a className="flex gap-3 items-baseline">
                                {profile?.name && <span className="font-semibold">{profile?.name}</span>}
                                <span className="text-2xs text-neutral-11 font-medium">@{profile?.handle}</span>
                              </a>
                            </Link>{' '}
                            <span className="text-neutral-10 text-2xs">
                              {/* @ts-ignore */}
                              {comment?.indexed === false
                                ? 'Indexing...'
                                : formatRelative(new Date(comment?.createdAt), new Date())}
                            </span>
                            <div className="animate-appear pt-1 pb-2 text-neutral-12">
                              <LensPublicationContent publication={comment} />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          </div>
        </article>
      </section>
    </>
  )
}

export default PublishedRecordingLensPublication
