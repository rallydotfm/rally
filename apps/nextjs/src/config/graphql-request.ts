import { GraphQLClient, request as graphqlRequest } from 'graphql-request'
import Cookies from 'js-cookie'
import { API_URL } from './lens'
import { COOKIE_LENS_ACCESS_TOKEN, COOKIE_LENS_REFRESH_TOKEN } from './storage'
import { RefreshDocument } from '@graphql/generated'

async function middleware(request: RequestInit) {
  const token = Cookies.get(COOKIE_LENS_ACCESS_TOKEN)
  if (token) {
    return {
      ...request,
      headers: { ...request.headers, ['Authorization']: `Bearer ${token}` },
    }
  } else {
    const refreshToken = Cookies.get(COOKIE_LENS_REFRESH_TOKEN)
    if (refreshToken) {
      const refreshResult = await graphqlRequest(API_URL as string, RefreshDocument, {
        request: {
          refreshToken,
        },
      })
      if (refreshResult?.refresh?.accessToken) {
        const token = refreshResult?.refresh?.accessToken
        Cookies.set(COOKIE_LENS_ACCESS_TOKEN, refreshResult?.refresh?.accessToken, {
          expires: 1 / 48, // 30min
        })
        Cookies.set(COOKIE_LENS_REFRESH_TOKEN, refreshResult?.refresh?.refreshToken, {
          expires: 7, // 7 days
        })

        return {
          ...request,
          headers: {
            ...request.headers,
            ['Authorization']: `Bearer ${token}`,
          },
        }
      }
    }
  }
  return {
    ...request,
    headers: { ...request.headers },
  }
}
export const client = new GraphQLClient(API_URL as string, { requestMiddleware: middleware })