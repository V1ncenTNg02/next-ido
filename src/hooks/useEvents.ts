import axios from 'axios'
import BN from 'bignumber.js'
import { useEffect, useState } from 'react'

import config from '../configs'
import { PoolType } from '../context/ProjectData/model'
import { useRefresh } from '../context/Refresh/hooks'
import { useSignature } from '../context/Signature/hooks'
import { getSupportedChains } from '../helpers'
import { Swappeds, userClaimeds } from '../services/graph'

export const useEvents = (netId?: number, poolIndex?: number, type?: PoolType) => {
  const [totalAmount, setTotalAmount] = useState({
    token0: new BN(0),
    token1: new BN(0)
  })
  const [totalClaimed, setTotalClaimed] = useState(new BN(0))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [allSwappedData, setAllSwappedData] = useState<Swappeds[]>([])
  const [allUserClaimedData, setAllUserClaimedData] = useState<userClaimeds[]>([])
  const { fastRefresh } = useRefresh()
  const { user } = useSignature()

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        if (!netId) return
        setIsLoading(true)

        const supportedChains = getSupportedChains()
        const hasNetId = supportedChains.find(item => item === netId.toString())

        if (!hasNetId) {
          setError('We do not support this chain')
          return
        } else {
          setError(null)
        }

        const { data } = await axios.get(config.eventsApiPrefix, {
          params: {
            netId
          }
        })

        const allSwappedsData = data.swappeds as Swappeds[]
        const allUserClaimedsData = data.userClaimeds as userClaimeds[]
        setAllSwappedData(allSwappedsData)
        setAllUserClaimedData(allUserClaimedsData)
        if (!poolIndex && poolIndex !== 0) {
          setLoaded(true)
          return
        }
        let poolSwappedData
        if (type) {
          poolSwappedData = allSwappedsData.filter(item => item.index === String(poolIndex) && item.type === type)
        } else {
          poolSwappedData = allSwappedsData.filter(item => item.index === String(poolIndex))
        }
        const totalAmount0 = poolSwappedData.reduce((accumulator, currentValue) => accumulator.plus(new BN(currentValue.amount0)), new BN(0))
        const totalAmount1 = poolSwappedData.reduce((accumulator, currentValue) => accumulator.plus(new BN(currentValue.amount1)), new BN(0))
        setTotalAmount(prev => ({
          ...prev,
          token0: totalAmount0,
          token1: totalAmount1
        }))

        if (!user) {
          return
        }
        let poolUserClaimedData
        if (type) {
          poolUserClaimedData = allUserClaimedsData
            .filter(item => item.index === String(poolIndex) && item.type === type)
            .filter(item => item.sender === user.etherAddress.toLowerCase())
        } else {
          poolUserClaimedData = allUserClaimedsData
            .filter(item => item.index === String(poolIndex))
            .filter(item => item.sender === user.etherAddress.toLowerCase())
        }

        const totalCurrentUserClaimed = poolUserClaimedData.reduce((accumulator, currentValue) => accumulator.plus(new BN(currentValue.amount0)), new BN(0))

        setTotalClaimed(totalCurrentUserClaimed)
        setLoaded(true)
      } catch (err: any) {
        console.error('fetchEventsData error', err.message)
        setError('Unable to fetch events data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEventsData()
  }, [netId, fastRefresh, poolIndex, type, user])
  return { totalAmount, error, isLoading, totalClaimed, allSwappedData, allUserClaimedData, loaded, setLoaded }
}
