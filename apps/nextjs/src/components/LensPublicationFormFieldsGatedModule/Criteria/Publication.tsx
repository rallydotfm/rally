import { SetStateAction, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import { useUpdateEffect } from '@react-hookz/web'
import useGetLensPublicationById from '@hooks/useGetLensPublicationById'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import toast from 'react-hot-toast'
import { IconSpinner } from '@components/Icons'
import Notice from '@components/Notice'

export const Publication = (props: any) => {
  const { index, chains, ...formProps } = props
  const { errors, data, setFields } = formProps
  const account = useAccount()
  const queryUserProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {})
  const { chain } = useNetwork()
  const [publicationId, setPublicationId] = useState(null)
  const [publicationContractAddress, setPublicationContractAddress] = useState(null)

  useUpdateEffect(() => {
    if (
      !errors()?.access_control_conditions?.[index]?.publicationUrl?.length &&
      data()?.access_control_conditions?.[index]?.publicationUrl
    ) {
      const { pathname } = new URL(data()?.access_control_conditions?.[index]?.publicationUrl)
      const id = pathname.match(/\/(posts|post|bytes|watch)\/([^\/\?]+)/)?.[2]
      setPublicationContractAddress(null)
      //@ts-ignore
      setPublicationId(id)
    }
  }, [data()?.access_control_conditions?.[index]?.publicationUrl])

  const queryPublicationById = useGetLensPublicationById({
    idLensPublication: `${publicationId}`,
    idProfile: queryUserProfile?.data?.id,
    options: {
      enabled: publicationId !== null ? true : false,
      onError(error: { message: any; cause: any }) {
        toast?.error(error?.message ?? error?.cause ?? error)
      },
      onSuccess(data: { publication: { collectModule: { contractAddress: SetStateAction<null> }; id: any } }) {
        if (data?.publication && data?.publication?.collectModule?.contractAddress) {
          setFields(`access_control_conditions.${index}.publicationId`, data?.publication?.id)
          setFields(
            `access_control_conditions.${index}.publicationCollectModuleContractAddress`,
            data?.publication?.collectModule?.contractAddress,
          )
          setPublicationContractAddress(data?.publication?.collectModule?.contractAddress)
        } else {
          setPublicationContractAddress(null)
        }
      },
    },
  })
  return (
    <div>
      <div className="group relative">
        <FormField>
          <FormField.InputField>
            <FormField.Label
              className="text-2xs flex flex-wrap"
              hasError={errors()?.access_control_conditions?.[index]?.publicationUrl?.length > 0 ? true : false}
              htmlFor={`access_control_conditions.${index}.publicationUrl`}
            >
              Paste the Lens publication link below (Lenster, Lenstube, Amnisiac or Orb)
            </FormField.Label>
            <FormField.Description
              className="sr-only"
              id={`access_control_conditions.${index}.publicationUrl-description`}
            >
              The link of the Lens publication you want to use to get access to your publication
            </FormField.Description>
            <FormInput
              className="w-full"
              scale="sm"
              type="url"
              placeholder="eg: https://lenster.xyz/posts/0x3586-0x30"
              required={true}
              disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
              hasError={errors()?.access_control_conditions?.[index]?.publicationUrl?.length > 0 ? true : false}
              name={`access_control_conditions.${index}.publicationUrl`}
              id={`access_control_conditions.${index}.publicationUrl`}
              aria-describedby={`access_control_conditions.${index}.publicationUrl-description access_control_conditions.${index}.publicationUrl-helpblock`}
            />
          </FormField.InputField>
          <FormField.HelpBlock
            className="sr-only"
            hasError={errors()?.access_control_conditions?.[index]?.publicationUrl?.length > 0 ? true : false}
            id={`access_control_conditions.${index}.publicationUrl-helpblock`}
          >
            The link must be a valid URL and point to an existing Lens publication
          </FormField.HelpBlock>
        </FormField>
      </div>

      {queryPublicationById?.isError && (
        <Notice className="my-8" intent="negative-outline">
          This publication can't be used. <br />
          <div className="text-2xs font-medium pt-1 text-negative-12">
            This publication couldn't be fetched or doesn't exist.
          </div>
        </Notice>
      )}
      {queryPublicationById?.isLoading && publicationId !== null && (
        <div className="my-8 flex justify-center animate-pulse">
          <IconSpinner className="text-md animate-spin" />
        </div>
      )}
      {queryPublicationById?.data?.publication?.id && (
        <div className="animate-appear text-2xs mt-6">
          {/* @ts-ignore */}
          {queryPublicationById?.data?.publication?.collectModule?.contractAddress &&
          publicationContractAddress !== null &&
          data()?.access_control_conditions?.[index]?.publicationCollectModuleContractAddress ? (
            <>
              <div className="animate-appear">
                <div>
                  Picked publication:{' '}
                  <span className="overflow-hidden text-ellipsis font-mono text-neutral-11">
                    {queryPublicationById?.data?.publication?.id}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-white bg-opacity-10 border-neutral-4 border rounded-md">
                  <blockquote className="">{`${queryPublicationById?.data?.publication?.metadata?.description.substring(
                    0,
                    67,
                  )}...`}</blockquote>
                  <div className="mt-4 flex items-center flex-wrap gap-2">
                    <div className="shrink-0 w-8 h-8  bg-neutral-5 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        //@ts-ignore
                        src={queryPublicationById?.data?.publication?.profile?.picture?.original?.url?.replace(
                          'ipfs://',
                          'https://lens.infura-ipfs.io/ipfs/',
                        )}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[0.9em] italic">
                        {queryPublicationById?.data?.publication?.metadata?.name}
                      </p>
                      <p className="mt-3 font-medium text-[0.9em]">
                        Publication by{' '}
                        {queryPublicationById?.data?.publication?.profile?.name ??
                          queryPublicationById?.data?.publication?.profile?.onChainIdentity?.ens?.name ??
                          queryPublicationById?.data?.publication?.profile?.handle}{' '}
                        {(queryPublicationById?.data?.publication?.profile?.name ||
                          queryPublicationById?.data?.publication?.profile?.onChainIdentity?.ens?.name) &&
                          `(${queryPublicationById?.data?.publication?.profile?.handle})`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* @ts-ignore */}
              </div>
            </>
          ) : (
            <Notice intent="negative-outline">
              This publication can't be used. <br />
              <div className="text-2xs font-medium pt-1 text-negative-12">
                This publication doesn't have a collect module set and therefore, can't be collected. <br /> Please pick
                a different publication.
              </div>
            </Notice>
          )}
        </div>
      )}

      <div className="pt-12 text-center">
        <a className="text-neutral-11 block text-2xs" target="_blank " href="https://docs.lens.xyz/docs/publication/">
          Curious about Lens publications ? <br />
          <span className="underline hover:no-underline">Learn more on Lens's website.</span>
        </a>
      </div>
      {/* We need to add at least one named form element to avoid felte bug */}
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.publicationUrl`} />
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.publicationId`} />
      <input
        className="sr-only"
        disabled
        hidden
        name={`access_control_conditions.${index}.publicationCollectModuleContractAddress`}
      />
      <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.chainID`} />
    </div>
  )
}

export default Publication
