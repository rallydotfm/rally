import { API_GUILD_URL } from '@config/guild'

export async function getGuildById(id: string) {
  try {
    const response = await fetch(`${API_GUILD_URL}/guild/${id}`)
    const result = await response.json()

    return result
  } catch (e) {
    console.error(e)
    return e
  }
}
