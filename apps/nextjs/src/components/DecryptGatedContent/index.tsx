import EthereumAddress from '@components/EthereumAddress'
import { LensProfile } from './LensProfile'
import Nft from './Nft'
import Token from './Token'

export const DecryptGatedContent = (props: any) => {
  const { condition } = props
  if (condition.standardContractType === 'ERC20') {
    return <Token condition={condition} />
  }
  if (['ERC721', 'ERC1155'].includes(condition.standardContractType)) {
    if (
      (condition.contractAddress === '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d' && condition.chain === 'polygon') ||
      (condition.contractAddress === '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b' && condition.chain === 'mumbai')
    ) {
      return (
        <article className="relative">
          {condition?.method === 'balanceOf' ? (
            <div className="text-2xs">
              Have a <span className="font-bold">Lens profile</span> <br />
              <span className="text-[0.9em] block opacity-75 italic pt-1">{condition?.chain}</span>
            </div>
          ) : (
            <div className="text-2xs">
              <div className="text-2xs mb-3">
                Own this <span className="font-bold">Lens profile</span> <br />
              </div>

              <LensProfile
                id={
                  '0x' +
                  parseInt(condition?.parameters?.[0])
                    .toString(16)
                    .padStart(
                      parseInt(condition?.parameters?.[0]).toString(16).length % 2 === 0
                        ? parseInt(condition?.parameters?.[0]).toString(16).length
                        : parseInt(condition?.parameters?.[0]).toString(16).length + 1,
                      '0',
                    )
                }
              />
              <span className="text-[0.9em] block opacity-75 italic pt-1">{condition?.chain}</span>
            </div>
          )}
          <a
            className="absolute inset-0 h-full w-full opacity-0 z-10"
            target="_blank"
            rel="noopener noreferrer"
            title="View on Rarible"
            href={`https://rarible.com/token/${condition?.chain}/${condition.contractAddress}`}
          >
            View on Rarible
          </a>
        </article>
      )
    } else {
      return (
        <article className="relative text-2xs flex flex-col gap-2">
          <span className="font-bold">
            Own at least 1 NFT{' '}
            {condition?.parameters?.tokenIds?.length ? `with ID ${condition?.parameters?.tokenIds.toString()}` : ''}{' '}
            from this collection :
          </span>

          <Nft condition={condition} />
        </article>
      )
    }
  }
  if (condition?.standardContractType === '' && condition?.contractAddress === '') {
    return (
      <article className="text-2xs flex flex-col gap-2">
        <span>Be the owner of this wallet :</span>
        <div className="font-mono font-bold">
          <EthereumAddress
            address={condition?.returnValueTest?.value}
            shortenOnFallback={true}
            displayLensProfile={false}
          />
        </div>
        <p className="text-neutral-12 text-opacity-75 text-[0.75rem] font-mono overflow-hidden text-ellipsis">
          {condition?.returnValueTest?.value}
        </p>
      </article>
    )
  }
  return null
}

export default DecryptGatedContent
