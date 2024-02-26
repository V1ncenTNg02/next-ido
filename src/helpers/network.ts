import { ethers } from 'ethers'

import { abiConfig, HexData, networkConfig } from '../configs'
import { PoolType } from '../context/ProjectData/model'

export const getRpcProvider = (netId: number | string) => {
  if (!netId) return null
  const config = networkConfig[`netId${netId}`]
  if (!config) return null
  const rpcUrl = config.rpcUrl
  return new ethers.providers.JsonRpcProvider(rpcUrl)
}

export const getFixedSwapContractAddress = (netId?: number | string): HexData => {
  if (!netId) return '0x'
  const config = networkConfig[`netId${netId}`]
  if (!config) return '0x'
  return config.fixedSwapContract
}

export const getDutchAuctionContractAddress = (netId?: number | string): HexData => {
  if (!netId) return '0x'
  const config = networkConfig[`netId${netId}`]
  if (!config) return '0x'
  return config.dutchAuctionContract
}

export const getEnglishAuctionContractAddress = (netId?: number | string): HexData => {
  if (!netId) return '0x'
  const config = networkConfig[`netId${netId}`]
  if (!config) return '0x'
  return config.englishAuctionContract
}

export const getContractAddress = (type: PoolType, netId?: number | string): HexData => {
  if (!netId) return '0x'
  const config = networkConfig[`netId${netId}`]
  if (!config) return '0x'
  if (type === 'FIX') return config.fixedSwapContract
  if (type === 'DUTCH') return config.dutchAuctionContract
  if (type === 'ENGLISH') return config.englishAuctionContract
  return '0x'
}

export const getABI = (type: PoolType) => {
  const config = abiConfig
  if (!config) return null
  if (type === 'FIX') return config.fixedSwapABI
  if (type === 'DUTCH') return config.dutchAuctionABI
  if (type === 'ENGLISH') return config.englishAuctionABI
  return null
}

export const getCurrencyName = (netId?: number | string) => {
  if (!netId) return ''
  const config = networkConfig[`netId${netId}`]
  if (!config) return ''
  return config.currencyName
}

export const getFromBlock = (netId?: number | string) => {
  if (!netId) return 1
  const config = networkConfig[`netId${netId}`]
  if (!config) return 1
  return config.fromBlock
}

export const getSupportedChains = () => {
  return Object.keys(networkConfig).map(item => item.replace(/^netId/, ''))
}

export function getExplorerUrl(netId: number | string) {
  const config = networkConfig[`netId${netId}`]
  if (!config) return null
  return config.explorerUrl
}

export function getChainName(netId: number | string) {
  const config = networkConfig[`netId${netId}`]
  if (!config) return ''
  return config.chainName
}

export const getChainImage = (netId: number | string) => {
  if (!netId) return ''
  const config = networkConfig[`netId${netId}`]
  if (!config) return ''
  return config.image
}
