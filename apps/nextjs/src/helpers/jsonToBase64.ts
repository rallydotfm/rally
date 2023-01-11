export function jsonToBase64(jsonObj: any) {
  const jsonString = JSON.stringify(jsonObj)
  return Buffer.from(jsonString).toString('base64')
}

export default jsonToBase64
