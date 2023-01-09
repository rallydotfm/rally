import EthereumAddress from '@components/EthereumAddress'
import { ScalarOperator } from '@lens-protocol/sdk-gated'
import Nft from './Nft'
import Token from './Token'

export const DecryptGatedContent = (props: any) => {
  const { condition } = props
  if (condition.standardContractType === 'ERC20') {
    return <Token condition={condition} />
  }
  if (['ERC721', 'ERC1155'].includes(condition.standardContractType)) {
    if (
      condition.method === 'ownerOf' &&
      ((condition.contractAddress === '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d' && condition.chain === 'polygon') ||
        (condition.contractAddress === '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b' && condition.chain === 'mumbai'))
    )
      return (
        <article>
          <div className="xs:text-center text-2xs">
            Have a <span className="font-bold">Lens profile</span>{' '}
            <span className="text-neutral-11 text-[0.8rem]">({condition?.chain}).</span>
          </div>
        </article>
      )
    else {
      return (
        <article className="text-2xs flex flex-col gap-2">
          <span className="text-neutral-11 text-[0.8rem]">
            Own at least 1 NFT{' '}
            {condition?.parameters?.tokenIds?.length ? `with ID ${condition?.parameters?.tokenIds.toString()}` : ''} in
            this collection :
          </span>

          <Nft condition={condition} />
        </article>
      )
    }
  }
  if (condition?.standardContractType === '' && condition?.contractAddress === '') {
    return (
      <article className="text-2xs flex flex-col gap-2">
        <span className="text-neutral-11 text-[0.8rem]">Be the owner of this wallet :</span>
        <EthereumAddress
          address={condition?.returnValueTest?.value}
          shortenOnFallback={true}
          displayLensProfile={true}
        />
        <p className="text-neutral-12 text-opacity-75 text-[0.75rem] font-mono overflow-hidden text-ellipsis">
          {condition?.returnValueTest?.value}
        </p>
      </article>
    )
  }
  return null
}

export default DecryptGatedContent
