import useGetGuildById from '@hooks/useGetGuildById'
import CardGuild from './CardGuild'

interface DisplayGattedRequirementsProps {
    requirements: any
  }


export const DisplayGattedRequirements = (props: DisplayGattedRequirementsProps) => {
    const { requirements} = props
    //access_control.guild
    return (
        <>
        
        {
            requirements.map((r : any) => 

                <CardGuild guild={r} />
            
            )
        }</>
    )
}

export default DisplayGattedRequirements