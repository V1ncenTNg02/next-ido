import * as Model from './model'
import { ReleaseDataListType } from './model'
import { PoolType } from '../../context/ProjectData/model'
import { formatTokenAmount } from '../../helpers'

export const mapPool = (result: any[], auctionType: PoolType): Model.Pool => {
  return {
    creator: result[0],
    token0: result[1],
    token1: result[2],
    amountTotal0: result[3].toString(),
    amountTotal1: result[4].toString(),
    amountStartOrMin1: auctionType !== 'FIX' ? (auctionType === 'ENGLISH' ? result[4].toString() : result[5].toString()) : null,
    amountEndOrMax1: auctionType !== 'FIX' ? (auctionType === 'ENGLISH' ? result[5].toString() : result[4].toString()) : null,
    openAt: auctionType === 'FIX' ? result[5].toString() : result[7].toString(),
    closeAt: auctionType === 'FIX' ? result[6].toString() : result[8].toString(),
    claimAt: auctionType === 'FIX' ? result[7].toString() : result[9].toString()
  }
}

export const mapReleaseType = (result: any): Model.ReleaseType => {
  if (result) {
    switch (result) {
      case 0:
        return 'Instant'
      case 1:
        return 'Cliff'
      case 2:
        return 'Linear'
      case 3:
        return 'Fragment'
      default:
        return 'Instant'
    }
  } else {
    return 'Instant'
  }
}

export const mapIsWhitelist = (result: any): boolean => {
  const decimalNumber = parseInt(result, 16)
  return decimalNumber !== 0
}

export const mapAmount1PerWalletP = (result: any): string => {
  return String(result)
}

export const mapReleaseDataList = (result: any): ReleaseDataListType[] => {
  const stringfiedResult = result.map((item: any) => String(item))
  return [
    {
      startAt: stringfiedResult[0],
      endAtOrRatio: stringfiedResult[1]
    }
  ]
}

export const mapTxFeeRatio = (result: any): string => {
  return formatTokenAmount(result)
}
