import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'

export const chainId = process?.env?.NEXT_PUBLIC_CHAIN === 'mumbai' ? chain.polygonMumbai?.id : chain?.polygon?.id
export const { chains, provider } = configureChains(
  // for now we just want to support Mumbai testnet
  [process?.env?.NEXT_PUBLIC_CHAIN === 'mumbai' ? chain.polygonMumbai : chain?.polygon],
  // later on here we could add other providers
  // like Alchemy, Ankr, Infura...
  // eg: see https://wagmi.sh/docs/providers/alchemy
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }), publicProvider()],
)

const { wallets } = getDefaultWallets({
  appName: 'Rally',
  chains,
})

const connectors = connectorsForWallets([...wallets])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})
