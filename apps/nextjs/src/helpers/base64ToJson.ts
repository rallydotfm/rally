export function base64ToJson(base64String: string) {
  const jsonString = Buffer.from(base64String, 'base64').toString()
  return JSON.parse(jsonString)
}

export default base64ToJson
