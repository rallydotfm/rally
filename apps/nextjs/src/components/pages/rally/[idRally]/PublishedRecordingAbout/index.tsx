import LensPublicationContent from '@components/LensPublicationContent'

export const PublishedRecordingAbout = (props: any) => {
  const { publication } = props
  return (
    <>
      <div className="text-start py-8 md:px-6 -mx-3 md:-mx-6 border-b border-neutral-4">
        <h2 className="mb-4 font-semibold text-neutral-12">About this recording</h2>
        <LensPublicationContent publication={publication} />
      </div>
    </>
  )
}

export default PublishedRecordingAbout
