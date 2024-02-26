import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core'

import { GET_SWAPPEDS, GET_USERCLAIMEDS } from './queries'
import { PoolType } from '../context/ProjectData/model'
import { getFromBlock } from '../helpers'

interface ChainGraphUrl {
  [id: number]: string
}

export interface SwapData {
  id: string
  index: string
  sender: string
  amount0: string
  amount1: string
}

export interface Swappeds extends SwapData {
  type: PoolType
}

export interface userClaimedData {
  index: string
  amount0: string
  sender: string
}

export interface userClaimeds extends userClaimedData {
  type: PoolType
}

const first = 1000

const isEmptyArray = (arr: any[]) => !Array.isArray(arr) || !arr.length

const CHAIN_GRAPH_URLS: ChainGraphUrl = {
  5: 'https://api.thegraph.com/subgraphs/name/itachi-eth/goerli-next-ido',
  11155111: 'https://api.thegraph.com/subgraphs/name/itachi-eth/sepolia-next-ido'
}

const link = (netId: number) => {
  return CHAIN_GRAPH_URLS[netId]
}

const client = (netId: number) => {
  return new ApolloClient({
    uri: link(netId),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  })
}

export async function getSwappeds(netId: number) {
  const fromBlock = getFromBlock(netId)
  const { data } = await client(netId).query({
    query: gql(GET_SWAPPEDS),
    variables: { fromBlock, first }
  })
  if (!data) {
    return []
  }

  const { swappeds, bids, bounceEnglishAuctionSwappeds } = data
  const fixSwappeds: Swappeds[] = swappeds.map((item: SwapData) => ({ ...item, type: 'FIX' }))
  const dutchAuctions: Swappeds[] = bids.map((item: SwapData) => ({ ...item, type: 'DUTCH' }))
  const englishAuctions: Swappeds[] = bounceEnglishAuctionSwappeds.map((item: SwapData) => ({ ...item, type: 'ENGLISH' }))
  return [...fixSwappeds, ...dutchAuctions, ...englishAuctions]
}

export async function getUserClaimeds(netId: number) {
  const fromBlock = getFromBlock(netId)
  const { data } = await client(netId).query({
    query: gql(GET_USERCLAIMEDS),
    variables: { fromBlock, first }
  })
  if (!data) {
    return []
  }
  const { userClaimeds, bounceDutchAuctionUserClaimeds, bounceEnglishAuctionUserClaimeds } = data
  const fixSwappeds: userClaimeds[] = userClaimeds.map((item: userClaimedData) => ({ ...item, type: 'FIX' }))
  const dutchAuctions: userClaimeds[] = bounceDutchAuctionUserClaimeds.map((item: userClaimedData) => ({ ...item, type: 'DUTCH' }))
  const englishAuctions: userClaimeds[] = bounceEnglishAuctionUserClaimeds.map((item: userClaimedData) => ({ ...item, type: 'ENGLISH' }))

  return [...fixSwappeds, ...dutchAuctions, ...englishAuctions]
}

export const getAllSwappeds = async (netId: number) => {
  try {
    let allSwappeds: Swappeds[] = []
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (true) {
      const result = await getSwappeds(netId)
      if (isEmptyArray(result)) {
        break
      }
      if (result.length < first) {
        allSwappeds = allSwappeds.concat(result)
        break
      }
    }
    return allSwappeds
  } catch {
    return []
  }
}
