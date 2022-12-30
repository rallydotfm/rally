import FormPublishRecording from '../FormPublishRecording'
import {
  useSmartContract,
  useStoreTxUi,
} from '@components/pages/rally/publish-recording/FormPublishRecording/useSmartContract'
import useForm from '@components/pages/rally/publish-recording/FormPublishRecording/useForm'
import { useMountEffect, useUnmountEffect, useUpdateEffect } from '@react-hookz/web'
import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import useBundlr, { useStoreBundlr } from '@hooks/useBundlr'
import { IconSpinner } from '@components/Icons'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { Disclosure } from '@headlessui/react'
import DeploymentStep from '@components/DeploymentStep'
import Notice from '@components/Notice'
import Link from 'next/link'
import { ROUTE_DASHBOARD, ROUTE_RALLY_VIEW } from '@config/routes'
import button from '@components/Button/styles'
import { useState } from 'react'

export const PublishRecording = (props: any) => {
  const { values, showSectionLens } = props
  const [fileSize, setFileSize] = useState(undefined)
  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const { queryGetBundlrBalance, mutationFundBalance, mutationEstimateUploadCost } = useBundlr()
  const stateTxUi = useStoreTxUi()

  const { onSubmitRecording, statePublishRecording } = useSmartContract(stateTxUi)
  const { formPublishRecording, apiInputRecordingTags } = useForm({
    onSubmit: (formValues: any) => {
      onSubmitRecording({
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
      recording_title: values?.name,
      recording_description: values?.description,
      recording_tags: values?.tags,
      recording_category: values?.category,
      recording_language: values?.language,
      recording_is_nsfw: values?.is_nsfw,
      recording_image_src: values?.image,
      publish_on_lens: false,
    },
  })

  useUnmountEffect(() => {
    stateTxUi.resetState()
  })

  useMountEffect(() => {
    stateTxUi.resetState()
  })

  useUpdateEffect(() => {
    //@ts-ignore
    if (fileSize) {
      //@ts-ignore
      mutationEstimateUploadCost.mutate(fileSize)
    }
  }, [formPublishRecording?.data()?.file])

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
        <p className="font-bold">Your recording file</p>

        <p className="pt-4 text-2xs text-neutral-11 mb-3">Upload your file below :</p>
        <div className="relative">
          <input
            className="w-full"
            onChange={(e) => {
              //@ts-ignore
              const file = e.target.files[0]
              //@ts-ignore
              setFileSize(file?.size)
              if (file) {
                let reader = new FileReader()
                reader.onload = () => {
                  if (reader.result) {
                    formPublishRecording?.setData('file', Buffer.from(reader.result as any))
                  }
                }
                reader.readAsArrayBuffer(file)
              }
            }}
            type="file"
            accept="audio/*"
          />
        </div>

        {fileSize && (
          <div className="mt-8 animate-appear flex flex-col gap-4">
            <Button
              intent="negative-ghost"
              scale="xs"
              onClick={() => {
                formPublishRecording?.setData('file', undefined)
              }}
            >
              Reset file
            </Button>
          </div>
        )}
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
      </section>
      <div className={!fileSize ? 'opacity-50 pointer-events-none' : ''}>
        <section className={`mt-20  animate-appear`}>
          <FormPublishRecording
            showSectionLens={showSectionLens}
            disabled={!fileSize || !isSignedIn ? true : false}
            storeForm={formPublishRecording}
            apiInputRecordingTags={apiInputRecordingTags}
            state={statePublishRecording}
            labelButtonSubmit="Publish recording"
            labelButtonSubmitting="Publishing..."
          />
        </section>
      </div>
      <DialogModal
        title="Publishing recording"
        isOpen={stateTxUi.isDialogVisible}
        setIsOpen={stateTxUi.setDialogVisibility}
      >
        <>
          <span className="font-bold">Uploading and deploying recording</span>
          {/* @ts-ignore */}
          <ol className="space-y-3 mt-6 font-medium text-xs">
            <li className={`flex items-center text-white`}>
              <DeploymentStep
                isLoading={statePublishRecording.uploadAudioFile.isLoading}
                isError={statePublishRecording.uploadAudioFile.isError}
                isSuccess={statePublishRecording.uploadAudioFile.isSuccess}
              >
                Sign the 'Upload recording file to Bundlr' message and sign the transaction
              </DeploymentStep>
            </li>

            <li
              className={`
            flex items-center
            ${statePublishRecording.uploadMetadata.isIdle ? 'text-neutral-11' : 'text-white'}`}
            >
              <DeploymentStep
                isLoading={statePublishRecording.uploadMetadata.isLoading}
                isError={statePublishRecording.uploadMetadata.isError}
                isSuccess={statePublishRecording.uploadMetadata.isSuccess}
              >
                Sign the 'Upload recording metadata file to Bundlr' message
              </DeploymentStep>
            </li>
            {formPublishRecording?.data()?.publish_on_lens === true && (
              <>
                <li
                  className={`
            flex items-center
            ${
              statePublishRecording.postToLens.isIdle || statePublishRecording.postToLensGasless
                ? 'text-neutral-11'
                : 'text-white'
            }`}
                >
                  <DeploymentStep
                    isLoading={
                      statePublishRecording.postToLens.isLoading || statePublishRecording.postToLensGasless.isLoading
                    }
                    isError={
                      statePublishRecording.postToLens.isError || statePublishRecording.postToLensGasless.isError
                    }
                    isSuccess={
                      statePublishRecording.postToLens.isSuccess || statePublishRecording.postToLensGasless.isSuccess
                    }
                  >
                    Publishing on Lens
                  </DeploymentStep>
                </li>
              </>
            )}
            <li
              className={`
            flex items-center 
            ${statePublishRecording.contract.isIdle ? 'text-neutral-11' : 'text-white'}`}
            >
              <DeploymentStep
                isLoading={statePublishRecording.contract.isLoading}
                isError={statePublishRecording.contract.isError}
                isSuccess={statePublishRecording.contract.isSuccess}
              >
                Sign the 'Publish recording' transaction{' '}
              </DeploymentStep>
            </li>
            <li
              className={`
            flex items-center 
            ${statePublishRecording.transaction.isIdle ? 'text-neutral-11' : 'text-white'}`}
            >
              <DeploymentStep
                isLoading={statePublishRecording.transaction.isLoading}
                isError={statePublishRecording.transaction.isError}
                isSuccess={statePublishRecording.transaction.isSuccess}
              >
                Linking recording {formPublishRecording?.data()?.publish_on_lens === true && 'and Lens publication'} to
                your rally
              </DeploymentStep>
            </li>
          </ol>
          {[
            statePublishRecording.transaction,
            statePublishRecording.contract,
            statePublishRecording.uploadAudioFile,
            statePublishRecording.uploadMetadata,
            statePublishRecording.postToLens,
          ].find((slice) => slice.isError) && (
            <div className="mt-6 animate-appear">
              {[
                statePublishRecording.transaction,
                statePublishRecording.contract,
                statePublishRecording.uploadAudioFile,
                statePublishRecording.uploadMetadata,
                statePublishRecording.postToLens,
              ]
                .filter((slice) => slice.isError)
                .map((slice, key) => (
                  <Notice className="overflow-hidden text-ellipsis" intent="negative-outline" key={`error-${key}`}>
                    {/* @ts-ignore */}
                    {slice.error?.message ?? slice?.error}
                  </Notice>
                ))}
              <Button className="mt-6" onClick={() => formPublishRecording.handleSubmit()}>
                Try again
              </Button>
            </div>
          )}
          {statePublishRecording?.transaction?.isSuccess && (
            <div className="animate-appear space-y-4 mt-6">
              <Notice>
                🎉 Your recording was published successfully ! <br />
                <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', values?.id)}>
                  <a>
                    Check it <span className="underline hover:no-underline">here</span>
                  </a>
                </Link>
              </Notice>
              <p className="flex flex-col gap-4 text-2xs mt-6">
                <a
                  className="block text-neutral-11"
                  target="_blank"
                  href={`https://arweave.net/${stateTxUi?.audioFileArweaveTxId}`}
                >
                  Recording file Arweave transaction id :{' '}
                  <span className="link">{stateTxUi?.audioFileArweaveTxId}</span>
                </a>
                <a
                  className="block text-neutral-11"
                  target="_blank"
                  href={`https://arweave.net/${stateTxUi?.metadataArweaveTxId}`}
                >
                  Metadata Arweave transaction id : <span className="link">{stateTxUi?.metadataArweaveTxId}</span>
                </a>
                <a
                  className="block text-neutral-11"
                  target="_blank"
                  href={`https://${
                    (process.env.NEXT_PUBLIC_CHAIN as string) === 'mumbai' ? 'testnet.' : ''
                  }lenster.xyz/posts/${statePublishRecording?.postToLens?.data}`}
                >
                  View your linked Lens publication on <span className="link">Lenster</span>
                </a>
              </p>

              <div className="flex flex-col space-y-3 xs:space-y-0 xs:space-i-3 xs:flex-row ">
                <Link href={ROUTE_DASHBOARD}>
                  <a className={button({ intent: 'primary-outline' })}>Go to my dashboard</a>
                </Link>
              </div>
            </div>
          )}
        </>
      </DialogModal>
    </div>
  )
}

export default PublishRecording
