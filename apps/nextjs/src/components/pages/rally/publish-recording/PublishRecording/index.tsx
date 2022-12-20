import FormPublishRecording from '../FormPublishRecording'
import {
  useSmartContract,
  useStoreTxUi,
} from '@components/pages/rally/publish-recording/FormPublishRecording/useSmartContract'
import useForm from '@components/pages/rally/publish-recording/FormPublishRecording/useForm'
import { useUnmountEffect, useUpdateEffect } from '@react-hookz/web'
import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import useBundlr, { useStoreBundlr } from '@hooks/useBundlr'
import { useState } from 'react'
import useGetAudioChatSessionRecording from '@hooks/useGetAudioChatSessionRecordings'
import { IconSpinner } from '@components/Icons'
import useGetRecordingPresignedUrl from '@hooks/useGetRecordingPresignedUrl'
import dynamic from 'next/dynamic'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { Disclosure, Listbox } from '@headlessui/react'
const NoSSRPlayerPreview = dynamic(() => import('./../PlayerPreview'), { ssr: false })

export const PublishRecording = (props: any) => {
  const { values, showSectionLens } = props
  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const { queryGetBundlrBalance, mutationFundBalance, mutationEstimateUploadCost } = useBundlr()
  const querySessionRecordings = useGetAudioChatSessionRecording(values)
  const stateTxUi = useStoreTxUi()
  const [valueListBoxFile, setValueListBoxFile] = useState(undefined)
  const [pickedFile, setPickedFile] = useState(undefined)
  const [pickedFileSrc, setPickedFileSrc] = useState(undefined)
  const mutationSelectRecording = useGetRecordingPresignedUrl({
    onSuccess(mutationData: any, args) {
      setPickedFile({
        name: mutationData,
        size: args.size,
      })
      setPickedFileSrc(mutationData)
    },
  })

  const { onSubmitRecording, statePublishRecording } = useSmartContract(stateTxUi)
  const { formPublishRecording, apiInputRecordingTags } = useForm({
    onSubmit: (formValues: any) => {
      onSubmitRecording({
        values: formValues,
        id: values.id,
        is_indexed: values.is_indexed,
        start_at: values.epoch_time_start_at,
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
      recording_publish_to_lens: !isSignedIn || !showSectionLens,
    },
  })

  useUnmountEffect(() => {
    stateTxUi.resetState()
  })

  useUpdateEffect(() => {
    if (pickedFile) {
      mutationEstimateUploadCost.mutate(pickedFile?.size)
    }
  }, [pickedFile])
  return (
    <div className="mt-6 mb-8">
      <Disclosure>
        <div className="animate-appear border-neutral-4 border text-xs p-2 rounded-lg">
          <Disclosure.Button className="font-bold w-full flex items-center justify-between">
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
            <ChevronDownIcon className="shrink-0 text-neutral-9 rotate-0 transition-all ui-open:rotate-180 ui-open:text-white w-8" />
          </Disclosure.Button>

          <Disclosure.Panel className="px-1 pb-2">
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
        <p className="font-bold mb-3">Select the file to upload to Bundlr</p>

        {/* @ts-ignore */}
        {querySessionRecordings?.data?.length > 0 && (
          <>
            <Listbox
              value={valueListBoxFile}
              onChange={async (value) => {
                if (valueListBoxFile !== value?.name) {
                  setValueListBoxFile(value?.name)

                  await mutationSelectRecording.mutateAsync({
                    id_rally: values?.id,
                    filename: value?.name,
                    size: value?.size,
                  })
                }
              }}
            >
              <Listbox.Button>Pick one of your raw recording</Listbox.Button>
              <Listbox.Options className="mt-3 flex flex-col gap-4" static>
                {querySessionRecordings?.data.map((file) => (
                  <Listbox.Option
                    className="relative z-20 bg-neutral-6 animate-appear delay-75 pis-2 py-1 rounded-full border-neutral-4 text-2xs flex justify-between items-center"
                    key={file.name}
                    value={file}
                  >
                    {valueListBoxFile === file?.name &&
                      mutationSelectRecording?.isSuccess &&
                      mutationSelectRecording?.data && <NoSSRPlayerPreview src={mutationSelectRecording?.data} />}

                    <span className="px-3">{file.name}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </>
        )}

        <p className="pt-8 text-2xs text-neutral-11 mb-3">Or upload your own :</p>
        <div className="relative">
          <input
            className="w-full"
            onChange={(e) => {
              //@ts-ignore
              setPickedFile(e.target.files[0])
              //@ts-ignore
              setPickedFileSrc(URL.createObjectURL(e.target.files[0]))
              setValueListBoxFile(undefined)
            }}
            type="file"
            accept="audio/*"
          />
        </div>

        {pickedFile && (
          <div className="mt-8 animate-appear flex flex-col gap-4">
            <Button
              intent="negative-ghost"
              scale="xs"
              onClick={() => {
                setPickedFile(undefined)
                setPickedFileSrc(undefined)
              }}
            >
              Reset file
            </Button>
          </div>
        )}
        {pickedFile && mutationEstimateUploadCost?.data && (
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

      <section className="mt-20 animate-appear">
        <FormPublishRecording
          showSectionLens={showSectionLens}
          disabled={!pickedFile || !isSignedIn ? true : false}
          storeForm={formPublishRecording}
          apiInputRecordingTags={apiInputRecordingTags}
          state={statePublishRecording}
          labelButtonSubmit="Publish recording"
          labelButtonSubmitting="Publishing..."
        />
      </section>

      <DialogModal
        title="Publishing recording"
        isOpen={stateTxUi.isDialogVisible}
        setIsOpen={stateTxUi.setDialogVisibility}
      >
        <span className="font-bold">Publishing rally</span>
        1. Upload to Arweave 2. Post to Lens 3. Link Rally to Lens publication & recording
        {/* @ts-ignore */}
      </DialogModal>
    </div>
  )
}

export default PublishRecording
