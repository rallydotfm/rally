import { supportedChains } from '@config/lit'
import type {
  NftOwnership,
  EoaOwnership,
  FollowCondition,
  ProfileOwnership,
  CollectCondition,
  Erc20TokenOwnership,
} from '@lens-protocol/sdk-gated/dist/types'

/**
 * Return formatted access control criteria for both Lens and Lit
 */
export function getEncryptionCriteria(args: {
  currentUserEthAddress: `0x${string}`
  accessControlConditions: Array<any>
  conditionOperator?: string
}) {
  const { currentUserEthAddress, accessControlConditions, conditionOperator } = args
  // Lens access controls condition are slightly different from Lit
  // So we create 2 different objects that will have the same conditions but with a different syntax

  // Lens conditions
  let accessControl = {}

  // Lit conditions
  // We ensure the creator's address is whitelisted by default
  let litCriteria: any = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: process.env.NEXT_PUBLIC_LENS_API_URL?.includes('mumbai') ? 'mumbai' : 'polygon',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: currentUserEthAddress,
      },
    },
    { operator: 'or' },
  ]

  let lensCriteria: any = []
  accessControlConditions.map((accessControl, i) => {
    const condition = accessControlConditions[i]
    const litChain = supportedChains.filter((lChain) => lChain.id === parseInt(condition.chainID))?.[0]?.lit

    let lensCondition
    let litCondition
    switch (condition.type) {
      case 'token':
        // Lit condition
        litCondition = {
          contractAddress: condition.contractAddress, // the address of the ERC20 token that signers should own
          standardContractType: 'ERC20',
          chain: litChain, // the chain ID of the network
          method: 'balanceOf',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: condition.condition, // the condition that must be met to grant access to the metadata, supported conditions are: '==', '!=', '>', '<', '>=', '<='
            value: `${condition.amount.toFixed(8)}`, // the amount of the ERC20 token that grants access to the metadata
          },
        }
        // Lens condition
        const tokenCondition: Erc20TokenOwnership = {
          contractAddress: condition.contractAddress, // the address of the ERC20 token that signers should own
          chainID: parseInt(condition.chainID), // the chain ID of the network
          amount: `${condition.amount.toFixed(8)}`, // the amount of the ERC20 token that grants access to the metadata
          decimals: parseInt(condition.decimals), // the decimals of the ERC20 token that grants access to the metadata
          condition: condition.condition, // the condition that must be met to grant access to the metadata, supported conditions are: '==', '!=', '>', '<', '>=', '<='
        }
        lensCondition = { token: tokenCondition }
        break
      case 'unlock':
      case 'nft':
        // Unlock Locks are ERC-721

        // Lens condition
        const nftCondition: NftOwnership = {
          contractType: condition.contractType, // the type of the NFT collection, ERC721 and ERC1155 are supported
          contractAddress: condition.contractAddress, // NFT Contract address
          chainID: parseInt(condition.chainID), // the chain ID of the network the NFT collection is deployed on
        }
        lensCondition = { nft: nftCondition }
        // Lit condition
        litCondition = {
          standardContractType: condition.contractType, // the type of the NFT collection, ERC721 and ERC1155 are supported
          contractAddress: condition.contractAddress, // NFT Contract address
          chain: litChain, // the chain ID of the network the NFT collection is deployed on
        }
        if (condition.shouldLimitAccessToNftHoldersWithSpecificIds === true && condition?.tokenIds?.length > 0) {
          //@ts-ignore
          lensCondition.nft.tokenIds = condition?.tokenIds
          if (condition.contractType === 'ERC721') {
            litCondition = {
              ...litCondition,
              method: 'ownerOf',
              parameters: condition?.tokenIds,
              returnValueTest: {
                comparator: '=',
                value: ':userAddress',
              },
            }
          } else {
            litCondition = {
              ...litCondition,
            }
          }
        } else {
          litCondition = {
            ...litCondition,
            method: 'balanceOf',
            parameters: [':userAddress'],
            returnValueTest: {
              comparator: '>',
              value: '0',
            },
          }
        }
        break
      case 'eoa': // externally owned address aka not a contract address
        // Lens condition
        const eoaCondition: EoaOwnership = {
          address: condition.address,
        }

        lensCondition = {
          eoa: eoaCondition,
        }

        // Lit condition
        litCondition = {
          contractAddress: '',
          standardContractType: '',
          chain: litChain,
          method: '',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: '=',
            value: condition.address,
          },
        }
        break

      case 'lens-profile': // Own a lens profile with a specific id
        // Lens condition
        const profileCondition: ProfileOwnership = {
          profileId: condition.profileId,
        }
        lensCondition = {
          profile: profileCondition,
        }

        // Lit condition
        litCondition = {
          standardContractType: 'ERC721',
          contractAddress: process.env.NEXT_PUBLIC_LENS_API_URL?.includes('mumbai')
            ? '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b'
            : '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d', // the address of the ERC20 token that signers should own
          chain: process.env.NEXT_PUBLIC_LENS_API_URL?.includes('mumbai') ? 'mumbai' : 'polygon',
          method: 'ownerOf',
          parameters: [`${parseInt(condition.profileId)}`],
          returnValueTest: {
            comparator: '=',
            value: ':userAddress',
          },
        }
        break

      case 'follow': // Must follow a specific Lens profile
        // Lens condition
        const followCondition: FollowCondition = {
          profileId: condition.profileId,
        }
        lensCondition = {
          follow: followCondition,
        }

        // Lit condition
        // Lens profiles have a followNFT contract attached to them
        // We use this value for `contractAddress`
        // Followers own a ERC721 NFT minted from that contract
        litCondition = {
          standardContractType: 'ERC721',
          contractAddress: condition.followNftContractAddress,
          chain: process.env.NEXT_PUBLIC_LENS_API_URL?.includes('mumbai') ? 'mumbai' : 'polygon',
          method: 'balanceOf',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: '>',
            value: '0',
          },
        }
        break
      case 'collect':
        // Lens condition
        const collectCondition: CollectCondition = {
          publicationId: condition.publicationId,
        }
        lensCondition = {
          collect: collectCondition,
        }

        // Lit condition
        // Publications can have a collectNFT contract attached to them
        // We use this value for `contractAddress`
        // Collectors own a ERC721 NFT minted from that contract
        litCondition = {
          standardContractType: 'ERC721',
          contractAddress: condition.publicationCollectModuleContractAddress,
          chain: process.env.NEXT_PUBLIC_LENS_API_URL?.includes('mumbai') ? 'mumbai' : 'polygon',
          method: 'balanceOf',
          parameters: [':userAddress'],
          returnValueTest: {
            comparator: '>',
            value: '0',
          },
        }
        break
      default:
        break
    }
    //@ts-ignore
    litCriteria.push(litCondition)
    lensCriteria.push(lensCondition)
    let k = i
    if (
      conditionOperator &&
      accessControlConditions.length > 1 &&
      ['and', 'or'].includes(conditionOperator) &&
      k + 2 < accessControlConditions?.length
    ) {
      litCriteria.push({
        operator: conditionOperator,
      })
    }
  })

  if (conditionOperator && accessControlConditions?.length > 1 && ['and', 'or'].includes(conditionOperator)) {
    accessControl = {
      [conditionOperator]: {
        criteria: lensCriteria,
      },
    }
  } else {
    accessControl = {
      ...lensCriteria[0],
    }
  }

  return {
    litCriteria,
    lensCriteria,
    accessControl,
  }
}

export default getEncryptionCriteria
