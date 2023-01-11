import { GraphQLClient, request as graphqlRequest } from 'graphql-request'
import Cookies from 'js-cookie'
import { API_URL as LENS_API_URL } from './lens'
import { API_URL as STOREDAT_API_URL, CLIENT_ID as STOREDAT_CLIENT_ID, API_KEY as STOREDAT_API_KEY } from './storedat'
import { COOKIE_LENS_ACCESS_TOKEN, COOKIE_LENS_REFRESH_TOKEN } from './storage'
import { RefreshDocument } from '@graphql/lens/generated'
import { API_URL_SUBGRAPH_RALLY } from './subgraph'

async function lensMiddleware(request: RequestInit) {
  const token = Cookies.get(COOKIE_LENS_ACCESS_TOKEN)
  if (token) {
    return {
      ...request,
      headers: { ...request.headers, ['Authorization']: `Bearer ${token}` },
    }
  } else {
    const refreshToken = Cookies.get(COOKIE_LENS_REFRESH_TOKEN)
    if (refreshToken) {
      const refreshResult = await graphqlRequest(LENS_API_URL as string, RefreshDocument, {
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

async function storedatMiddleware(request: RequestInit) {
  return {
    ...request,
    headers: {
      ...request.headers,
      ['Access-Control-Allow-Headers']: '*',
      ['Authorization']: `${STOREDAT_API_KEY}`,
      ['client-id']: `${STOREDAT_CLIENT_ID}`,
    },
  }
}
export const clientLens = new GraphQLClient(LENS_API_URL as string, {
  //@ts-ignore
  requestMiddleware: lensMiddleware,
  // enable resolving partial data, see documentation https://www.npmjs.com/package/graphql-request#ignore
  errorPolicy: 'all',
})
//@ts-ignore
export const clientStoredat = new GraphQLClient(STOREDAT_API_URL as string, { requestMiddleware: storedatMiddleware })
export const clientSubgraphRally = new GraphQLClient(API_URL_SUBGRAPH_RALLY as string)
