import { useEffect, useMemo, useState } from 'react'
import { readContracts } from 'wagmi'

import { mapAmount1PerWalletP, mapIsWhitelist, mapPool, mapReleaseDataList, mapReleaseType, mapTxFeeRatio } from '../components/SwapSection/data'
import { Pool, ReleaseDataListType, ReleaseType, SwapData } from '../components/SwapSection/model'
import { PoolType } from '../context/ProjectData/model'
import { getABI, getContractAddress } from '../helpers'

export const useSwapData = (netId: number, poolIndex: number, auctionType: PoolType) => {
  const [swapOrBidData, setSwapOrBidData] = useState<SwapData>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const contract = useMemo(() => {
    return {
      address: getContractAddress(auctionType, netId),
      abi: getABI(auctionType) as any
    }
  }, [auctionType, netId])

  useEffect(() => {
    let poolInfo: Pool | undefined = undefined
    let releaseType: ReleaseType = 'Instant'
    let isWhitelisted = false
    let maxAmountPerWallet = ''
    let releaseDataList: ReleaseDataListType[] = []
    let txFeeRatio = ''
    let stakeContract = '0x'

    let maxAmountFunctionName = 'maxAmount1PerWalletP'
    if (auctionType === 'ENGLISH') {
      maxAmountFunctionName = 'maxAmount1PerWallet'
    }
    if (auctionType === 'DUTCH') {
      maxAmountFunctionName = 'maxAmount0PerWallet'
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await readContracts({
          contracts: [
            {
              ...contract,
              functionName: 'pools',
              args: [poolIndex]
            },
            {
              ...contract,
              functionName: 'releaseTypes',
              args: [poolIndex]
            },
            {
              ...contract,
              functionName: 'whitelistRootP',
              args: [poolIndex]
            },
            {
              ...contract,
              functionName: maxAmountFunctionName,
              args: [poolIndex]
            },
            {
              ...contract,
              functionName: 'releaseDataList',
              args: [poolIndex, 0]
            },
            {
              ...contract,
              functionName: 'txFeeRatio',
              args: []
            },
            {
              ...contract,
              functionName: 'stakeContract',
              args: []
            }
          ]
        })
        const [poolData, releaseTypesData, whitelistRootPData, maxAmount1PerWalletPData, releaseDataListData, txFeeRatioData, stakeContractData] = data

        if (poolData.status === 'success') {
          poolInfo = mapPool(poolData.result, auctionType)
        }

        if (releaseTypesData.status === 'success') {
          releaseType = mapReleaseType(releaseTypesData.result)
        }

        if (whitelistRootPData.status === 'success') {
          isWhitelisted = mapIsWhitelist(whitelistRootPData.result)
        }

        if (maxAmount1PerWalletPData.status === 'success') {
          maxAmountPerWallet = mapAmount1PerWalletP(maxAmount1PerWalletPData.result)
        }

        if (releaseDataListData.status === 'success') {
          releaseDataList = mapReleaseDataList(releaseDataListData.result)
        }

        if (txFeeRatioData.status === 'success') {
          txFeeRatio = mapTxFeeRatio(String(txFeeRatioData.result))
        }

        if (stakeContractData.status === 'success') {
          stakeContract = String(stakeContractData.result)
        }

        if (txFeeRatioData.status === 'success')
          setSwapOrBidData({
            pool: poolInfo,
            releaseType,
            isWhitelisted,
            maxAmountPerWallet,
            releaseDataList,
            txFeeRatio,
            stakeContract
          })
      } catch (err: any) {
        console.error('fetchFixedSwapData error', err.message)
        setError('Unable to fetch swap data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [contract, poolIndex, auctionType])

  return { swapOrBidData, isLoading, error }
}
