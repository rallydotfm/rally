import CardGuild from './CardGuild'

interface DisplayGatedRequirementsProps {
  requirements: any
}

export const DisplayGatedRequirements = (props: DisplayGatedRequirementsProps) => {
  const { requirements } = props
  return (
    <>
      {requirements.map((r: any) => (
        <CardGuild guild={r} />
      ))}
    </>
  )
}

export default DisplayGatedRequirements
