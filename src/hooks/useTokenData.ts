import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { readContracts } from 'wagmi'

import { IToken, SwapToken } from '../components/SwapSection/model'
import { abis, HexData } from '../configs'
import { getCurrencyName } from '../helpers'

export const useTokenData = (netId: number | string, token0Address?: HexData, token1Address?: HexData) => {
  const [swapToken, setSwapToken] = useState<SwapToken>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isToken1NativeCurrency = token1Address === ethers.constants.AddressZero

  const token0Contract = useMemo(() => {
    return {
      address: token0Address as HexData,
      abi: abis.erc20 as any
    }
  }, [token0Address])

  const token1Contract = useMemo(() => {
    return {
      address: token1Address as HexData,
      abi: abis.erc20 as any
    }
  }, [token1Address])

  const sharedContracts = useMemo(() => {
    return [
      {
        ...token0Contract,
        functionName: 'decimals'
      },
      {
        ...token0Contract,
        functionName: 'symbol'
      }
    ]
  }, [token0Contract])

  useEffect(() => {
    let token0: IToken | undefined = undefined
    let token1: IToken | undefined = undefined

    const fetchData = async () => {
      if (!token0Address || !token1Address) return
      try {
        setIsLoading(true)
        const contracts = isToken1NativeCurrency
          ? sharedContracts
          : [
              ...sharedContracts,
              {
                ...token1Contract,
                functionName: 'decimals'
              },
              {
                ...token1Contract,
                functionName: 'symbol'
              }
            ]
        const data = await readContracts({
          contracts
        })
        const [token0DecimalsData, token0SymbolData] = data

        if (token0DecimalsData?.status === 'success' && token0SymbolData?.status === 'success') {
          token0 = {
            address: token0Address as HexData,
            symbol: String(token0SymbolData.result),
            decimals: Number(token0DecimalsData.result)
          }
        }

        if (data.length > 2) {
          const [, , token1DecimalsData, token1SymbolData] = data
          if (token1DecimalsData?.status === 'success' && token1SymbolData?.status === 'success') {
            token1 = {
              address: token1Address as HexData,
              symbol: String(token1SymbolData.result),
              decimals: Number(token1DecimalsData.result)
            }
          }
        } else {
          token1 = {
            address: token1Address as HexData,
            symbol: getCurrencyName(netId),
            decimals: 18
          }
        }

        setSwapToken({
          token0,
          token1
        })
      } catch (err: any) {
        console.error('fetchData error', err.message)
        setError('Unable to fetch token data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [isToken1NativeCurrency, sharedContracts, token1Contract, netId, token0Address, token1Address])

  return { swapToken, error, isLoading }
}
