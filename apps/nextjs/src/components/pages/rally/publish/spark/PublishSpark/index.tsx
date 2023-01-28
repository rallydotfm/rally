import FormPublishSpark from '../FormPublishSpark'
import { usePublish, useStoreTxUi } from '@components/pages/rally/publish/spark/FormPublishSpark/usePublish'
import useForm from '@components/pages/rally/publish/spark/FormPublishSpark/useForm'
import Button from '@components/Button'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { useState } from 'react'
import { IconSpinner } from '@components/Icons'
import { useUpdateEffect } from '@react-hookz/web'
import { useStoreBundlr, useBundlr } from '@hooks/useBundlr'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import DeploymentStep from '@components/DeploymentStep'
import Notice from '@components/Notice'
import { ROUTE_DASHBOARD } from '@config/routes'
import button from '@components/Button/styles'
import Link from 'next/link'
import DialogModal from '@components/DialogModal'

export const PublishSpark = (props: any) => {
  const { values, showSectionLens } = props
  const [fileSize, setFileSize] = useState(undefined)
  const [videoSrc, setVideoSrc] = useState(undefined)

  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const { queryGetBundlrBalance, mutationFundBalance, mutationEstimateUploadCost } = useBundlr()
  const stateTxUi = useStoreTxUi()

  const { onSubmitSpark, statePublishSpark } = usePublish(stateTxUi)
  const { formPublishSpark, apiInputSparkTags } = useForm({
    onSubmit: (formValues: any) => {
      onSubmitSpark({
        values: {
          ...formValues,
        },
        id: values.id,
        is_indexed: values.is_indexed,
        start_at: values.start_at,
        metadata_cid: values.cid,
      })
    },
    initialValues: {
      spark_title: values?.name,
      spark_description: values?.description,
      spark_tags: values?.tags,
      spark_category: values?.category,
      spark_language: values?.language,
      spark_is_nsfw: values?.is_nsfw,
      spark_image_src: values?.image,
      publish_on_lens: true,
      gated_module: false,
      gated_module_condition_operator: 'and',
    },
  })

  useUpdateEffect(() => {
    //@ts-ignore
    if (fileSize) {
      //@ts-ignore
      mutationEstimateUploadCost.mutate(fileSize)
    }
  }, [formPublishSpark?.data()?.file])

  return (
    <div className="mt-6 mb-8">
      <Disclosure>
        <div className="animate-appear border-neutral-4 border text-xs p-1 rounded-lg">
          <Disclosure.Button className="font-bold w-full flex items-center px-3 py-2 justify-between">
            <div className="shrink-0 flex-grow flex items-center">
              <span className="inline-flex items-center">
                {queryGetBundlrBalance?.data === '0' && (
                  <ExclamationTriangleIcon className="text-negative-10 mie-1ex w-5" />
                )}
                <span className="inline-flex items-center">
                  Your Bundlr balance:{' '}
                  {queryGetBundlrBalance?.isLoading || mutationFundBalance?.isLoading ? (
                    <>
                      <IconSpinner className=" mx-2 text-md animate-spin" />
                    </>
                  ) : (
                    <>
                      {queryGetBundlrBalance?.data?.toString()}&nbsp;
                      <span className="inline-flex uppercase">{bundlr?.currency}</span>
                    </>
                  )}
                </span>
              </span>
            </div>
            <ChevronDownIcon className="shrink-0 pointer-events-none text-neutral-9 rotate-0 transition-all ui-open:rotate-180 ui-open:text-white w-6" />
          </Disclosure.Button>

          <Disclosure.Panel className="px-3 pb-2">
            {queryGetBundlrBalance?.data === '0' && (
              <p className="mt-1.5 font-bold animate-appear">
                You need to deposit funds in your balance to be able to upload your files.
              </p>
            )}
            <p className="font-medium mt-1.5 mb-1 text-neutral-12">Deposit funds in your balance:</p>

            <ul className="mb-5 flex flex-wrap justify-center xs:justify-start gap-2">
              {[1, 2, 3].map((value) => {
                return (
                  <li key={`${value}`}>
                    <Button
                      onClick={async () => {
                        //@ts-ignore
                        await mutationFundBalance.mutateAsync(value)
                      }}
                      disabled={mutationFundBalance?.isLoading}
                      scale="xs"
                      intent="neutral-outline"
                    >
                      Deposit {value} {bundlr?.currency}
                    </Button>
                  </li>
                )
              })}
            </ul>
            <a
              className="text-neutral-11 block text-2xs"
              target="_blank "
              href="https://docs.bundlr.network/docs/overview?utm_source=website&utm_campaign=footer_cta/"
            >
              Curious about Bundlr ?{' '}
              <span className="underline hover:no-underline">Learn more on Bundlr's documentation.</span>
            </a>
          </Disclosure.Panel>
        </div>
      </Disclosure>

      <section className="mt-6 animate-appear p-6 text-start xs:text-center bg-neutral-1 w-full rounded-lg flex flex-col xs:items-center justify-center">
        <p className="font-bold">Your video</p>

        <p className="pt-4 text-2xs text-neutral-11 mb-3">Upload your .mp4 file below :</p>
        <div className="relative">
          <input
            className="w-full"
            onChange={(e) => {
              //@ts-ignore
              const file = e.target.files[0]
              //@ts-ignore
              setVideoSrc(URL.createObjectURL(file))
              //@ts-ignore
              setFileSize(file?.size)
              if (file) {
                let reader = new FileReader()
                reader.onload = () => {
                  if (reader.result) {
                    formPublishSpark?.setData('file', Buffer.from(reader.result as any))
                  }
                }
                reader.readAsArrayBuffer(file)
              }
            }}
            type="file"
            accept="video/mp4"
          />
        </div>

        {fileSize && videoSrc && (
          <div className="mt-8 animate-appear flex flex-col gap-4">
            <div className="animate-appear max-w-prose">
              <video autoPlay={false}>
                <source src={videoSrc} type="video/mp4"></source>
              </video>
            </div>
            <Button
              intent="negative-ghost"
              scale="xs"
              onClick={() => {
                formPublishSpark?.setData('file', undefined)
                setFileSize(undefined)
                setVideoSrc(undefined)
              }}
            >
              Reset file
            </Button>
            {fileSize && (
              <p className="inline-flex flex-wrap text-2xs font-medium animate-appear">
                Estimated cost of upload:&nbsp; <br />
                {!mutationEstimateUploadCost?.data ? (
                  <IconSpinner className="animate-spin" />
                ) : (
                  <span className="uppercase">{`${mutationEstimateUploadCost?.data} ${bundlr?.currency}`}</span>
                )}
              </p>
            )}
          </div>
        )}
      </section>
      <div className={!fileSize ? 'opacity-50 pointer-events-none' : ''}>
        <section className={`mt-20  animate-appear`}>
          <FormPublishSpark
            showSectionLens={showSectionLens}
            disabled={!fileSize || !isSignedIn ? true : false}
            storeForm={formPublishSpark}
            apiInputSparkTags={apiInputSparkTags}
            state={statePublishSpark}
            labelButtonSubmit="Upload and publish spark"
            labelButtonSubmitting="Publishing..."
          />
        </section>
      </div>
      <DialogModal
        title="Publishing spark"
        isOpen={stateTxUi.isDialogVisible}
        setIsOpen={stateTxUi.setDialogVisibility}
      >
        <>
          <span className="font-bold">Uploading and publishing spark</span>
          {/* @ts-ignore */}
          <ol className="space-y-3 mt-6 font-medium text-xs">
            <li className={`flex items-center text-white`}>
              <DeploymentStep
                isLoading={statePublishSpark.uploadVideo.isLoading}
                isError={statePublishSpark.uploadVideo.isError}
                isSuccess={statePublishSpark.uploadVideo.isSuccess}
              >
                Sign the 'Upload spark file to Bundlr' message and sign the transaction
              </DeploymentStep>
            </li>

            <li
              className={`
            flex items-center
            ${statePublishSpark.uploadMetadata.isIdle ? 'text-neutral-11' : 'text-white'}`}
            >
              <DeploymentStep
                isLoading={statePublishSpark.uploadMetadata.isLoading}
                isError={statePublishSpark.uploadMetadata.isError}
                isSuccess={statePublishSpark.uploadMetadata.isSuccess}
              >
                Sign the 'Upload recording metadata file to Bundlr' message
              </DeploymentStep>
            </li>
            <li
              className={`
            flex items-center
            ${
              statePublishSpark.postToLens.isIdle || statePublishSpark.postToLensGasless.isIdle
                ? 'text-neutral-11'
                : 'text-white'
            }`}
            >
              <DeploymentStep
                isLoading={statePublishSpark.postToLens.isLoading || statePublishSpark.postToLensGasless.isLoading}
                isError={statePublishSpark.postToLens.isError || statePublishSpark.postToLensGasless.isError}
                isSuccess={statePublishSpark.postToLens.isSuccess || statePublishSpark.postToLensGasless.isSuccess}
              >
                Publishing on Lens
              </DeploymentStep>
            </li>
          </ol>
          {[statePublishSpark.uploadVideo, statePublishSpark.uploadMetadata, statePublishSpark.postToLens].find(
            (slice) => slice.isError,
          ) && (
            <div className="mt-6 animate-appear">
              {[statePublishSpark.uploadVideo, statePublishSpark.uploadMetadata, statePublishSpark.postToLens]
                .filter((slice) => slice.isError)
                .map((slice, key) => (
                  <Notice className="overflow-hidden text-ellipsis" intent="negative-outline" key={`error-${key}`}>
                    {/* @ts-ignore */}
                    {slice.error?.message ?? slice?.error}
                  </Notice>
                ))}
              <Button className="mt-6" onClick={() => formPublishSpark.handleSubmit()}>
                Try again
              </Button>
            </div>
          )}
          {/* @ts-ignore */}
          {stateTxUi?.lensPublicationId && (
            <div className="animate-appear space-y-4 mt-6">
              <Notice>
                🎉 Your spark was published successfully ! <br />
              </Notice>

              {statePublishSpark.postToLens?.isSuccess && (
                <>
                  <p className="flex flex-col gap-4 text-2xs mt-6">
                    <a
                      className="block text-neutral-11 overflow-hidden text-ellipsis"
                      target="_blank"
                      href={`https://arweave.net/${stateTxUi?.videoFileArweaveTxId}`}
                    >
                      Spark file Arweave transaction id :{' '}
                      <span className="link">{stateTxUi?.videoFileArweaveTxId}</span>
                    </a>
                    <a
                      className="block text-neutral-11 overflow-hidden text-ellipsis"
                      target="_blank"
                      href={`https://ipfs.io/ipsf/${stateTxUi?.metadataCid}`}
                    >
                      Metadata IPFS CID: <span className="link">{stateTxUi?.metadataCid}</span>
                    </a>
                    <a
                      className="block text-neutral-11 overflow-hidden text-ellipsis"
                      target="_blank"
                      href={`https://${
                        (process.env.NEXT_PUBLIC_CHAIN as string) === 'mumbai' ? 'testnet.' : ''
                      }lenster.xyz/posts/${statePublishSpark?.postToLens?.data}`}
                    >
                      View your linked Lens publication on <span className="link">Lenster</span>
                    </a>
                  </p>
                </>
              )}

              <div className="flex flex-col space-y-3 xs:space-y-0 xs:space-i-3 xs:flex-row ">
                <Link className={button({ intent: 'primary-outline' })} href={ROUTE_DASHBOARD}>
                  Go to my dashboard
                </Link>
              </div>
            </div>
          )}
        </>
      </DialogModal>
    </div>
  )
}

export default PublishSpark
