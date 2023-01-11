const alchemyRpcUrls = {
  [1]: 'https://eth-mainnet.g.alchemy.com/v2',
  [137]: 'https://polygon-mainnet.g.alchemy.com/v2',
  [10]: 'https://opt-mainnet.g.alchemy.com/v2',
  [42161]: 'https://arb-mainnet.g.alchemy.com/v2',
}

/**
 * Retrieve a given ERC20 token metadata
 * @param chainId - id of the chain on which the contract was deployed to
 * @param contractAddress - contract address
 */
export async function getErc20TokenByContractAddress(args: { chainId: number; contractAddress: string }) {
  const { chainId, contractAddress } = args
  //@ts-ignore
  const alchemyAppUrl = `${alchemyRpcUrls[chainId]}/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
  const response = await fetch(alchemyAppUrl, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      headers: {
        'Content-Type': 'application/json',
      },
      params: [contractAddress],
      id: 1,
    }),
    redirect: 'follow',
  })

  const data = response.json()

  return data
}

export default getErc20TokenByContractAddress
