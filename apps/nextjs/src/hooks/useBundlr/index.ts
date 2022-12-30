import create from 'zustand'
import { providers } from 'ethers'
import { WebBundlr } from '@bundlr-network/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { chainId } from '@config/wagmi'
import { chain } from 'wagmi'

export const useStoreBundlr = create((set) => ({
  bundlr: undefined,
  initialize: async () => {
    try {
      //@ts-ignore
      await window?.ethereum?.enable()
      //@ts-ignore
      const provider = new providers.Web3Provider(window?.ethereum)
      await provider._ready()

      const bundlr = new WebBundlr(
        chainId === chain.polygonMumbai.id ? 'https://devnet.bundlr.network' : 'https://node1.bundlr.network',
        'matic',
        provider,
        {
          providerUrl: process.env.NEXT_PUBLIC_RPC_URL,
        },
      )
      await bundlr.ready()
      return set(() => ({
        bundlr,
      }))
    } catch (e) {
      return set(() => ({
        bundlr: undefined,
      }))
    }
  },
  resetState: () =>
    set(() => ({
      bundlr: undefined,
    })),
}))

//@ts-ignore
export function useBundlr() {
  const bundlr = useStoreBundlr((state: any) => state.bundlr)
  const initialize = useStoreBundlr((state: any) => state.initialize)
  const mutationPrepareBundlr = useMutation(async () => await initialize())
  const queryGetBundlrBalance = useQuery(
    ['bundlr-balance', bundlr?.address],
    async () => {
      const balance = await bundlr.getLoadedBalance()
      return bundlr.utils.unitConverter(balance)
    },
    {
      enabled: bundlr?.address ? true : false,
    },
  )
  const mutationFundBalance = useMutation(
    async (price) => {
      //@ts-ignore
      const response = await bundlr.fund(new BigNumber(price).multipliedBy(bundlr.currencyConfig.base[1]))
      return response
    },
    {
      async onSuccess() {
        await queryGetBundlrBalance.refetch()
      },
    },
  )
  const mutationEstimateUploadCost = useMutation(async (fileSize) => {
    const price = await bundlr.getPrice(fileSize)
    const amount = bundlr.utils.unitConverter(price)
    return amount.toString()
  })
  return {
    mutationPrepareBundlr,
    queryGetBundlrBalance,
    mutationFundBalance,
    mutationEstimateUploadCost,
  }
}

export default useBundlr
