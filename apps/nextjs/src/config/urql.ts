import { API_URL } from './lens'
import { createClient } from 'urql'
/*
import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import { authExchange } from '@urql/exchange-auth'
import Cookies from 'js-cookie'
import { API_URL } from './lens'
import { COOKIE_ACCESS_TOKENS, COOKIE_REFRESH_TOKENS } from './storage'
import { makeOperation } from '@urql/core'
import refreshAuthenticate from '@graphql/authentication/refresh-authenticate'
import getAuthToken from '@helpers/getAuthTokens'
*/

export const client = createClient({
  url: API_URL as string,
})

/*
const addAuthToOperation = ({ authState, operation }: any) => {
  if (!authState || !authState.token) {
    return operation
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {}

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: authState.token,
      },
    },
  })
}

const getAuth = async ({ authState, mutate }: any) => {
  if (!authState) {
    const tokens = getAuthToken()
    const token = tokens?.accessToken
    const refreshToken = tokens?.refreshToken
    if (token && refreshToken) {
      return { token, refreshToken }
    }
    return null
  }

  const result = await refreshAuthenticate(authState!.refreshToken)

  if (result.data?.refresh) {
    Cookies.set(COOKIE_ACCESS_TOKENS, result.data.refresh.accessToken, {
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: 1 / 48, // 30min ; See documentation of js-cookie for more info https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#how-to-make-the-cookie-expire-in-less-than-a-day
    })
    Cookies.set(COOKIE_REFRESH_TOKENS, result.data.refresh.refreshToken, {
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires: 1, // 1 day
    })

    return {
      token: result.data.refresh.accessToken,
      refreshToken: result.data.refresh.refreshToken,
    }
  }
  Cookies.remove(COOKIE_ACCESS_TOKENS)
  return null
}

export const client = createClient({
  url: API_URL,
  // - dedupExchange: deduplicates requests if we send the same queries twice
  // - cacheExchange: implements the default "document caching" behaviour
  // - fetchExchange: send our requests to the GraphQL API
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      getAuth,
      addAuthToOperation,
    }),
    fetchExchange,
  ],
})

*/
