import { IconSpinner } from '@components/Icons'
import { supportedChains } from '@config/lit'
import { chainRPC } from '@config/wagmi'
import formatTokenAmountWithComparator from '@helpers/formatTokenAmountWithComparator'
import useGetErc20Token from '@hooks/useGetErc20Token'

export const Token = (props: any) => {
  const { condition } = props
  const queryToken = useGetErc20Token({
    contract: condition.contractAddress,
    chainId: chainRPC?.[supportedChains.filter((c) => c.lit === condition?.chain)?.[0]?.id],
  })
  return (
    <article className="text-2xs flex flex-col gap-2">
      <span className="font-bold">
        Hold{' '}
        {formatTokenAmountWithComparator(
          condition?.returnValueTest?.value ?? '0',
          condition?.returnValueTest?.comparator,
          queryToken?.data?.name
            ? `${queryToken?.data?.name} (${queryToken?.data?.symbol})`
            : ` of the following token`,
        )}
      </span>

      {queryToken?.isLoading && (
        <div className="text-[0.75rem] animate-appear flex items-center justify-center space-i-1ex">
          <IconSpinner className="text-lg animate-spin" />
          <p className="font-bold animate-pulse">Loading token info...</p>
        </div>
      )}

      <div className="flex flex-col whitespace-pre-line overflow-hidden text-ellipsis">
        <span className="text-[0.9em] block opacity-75 italic">{condition?.chain}</span>
        <span className="text-[0.9em] opacity-50 font-mono block overflow-hidden text-ellipsis">
          {condition?.contractAddress}
        </span>
      </div>
    </article>
  )
}
export default Token
