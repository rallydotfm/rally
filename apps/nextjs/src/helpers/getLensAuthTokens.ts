import { COOKIE_LENS_ACCESS_TOKEN } from '@config/storage'
import Cookies from 'js-cookie'

export function getLensAuthToken() {
  return Cookies.get(COOKIE_LENS_ACCESS_TOKEN)
}

export default getLensAuthToken
