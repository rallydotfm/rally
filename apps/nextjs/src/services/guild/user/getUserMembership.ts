import { API_GUILD_URL } from '@config/guild'

export async function getUserMembership(walletAddress: `0x${string}`) {
  try {
    const response = await fetch(`${API_GUILD_URL}/user/membership/${walletAddress}`)
    const result = await response.json()
    return result
  } catch (e) {
    console.error(e)
    return e
  }
}
