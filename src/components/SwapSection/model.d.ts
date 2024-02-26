import { HexData } from '../../configs'

export interface Pool {
  creator: string
  token0: HexData
  token1: HexData
  amountTotal0: string
  amountTotal1: string
  amountStartOrMin1: string | null
  amountEndOrMax1: string | null
  openAt: string
  closeAt: string
  claimAt: string
}

export type ReleaseType = 'Instant' | 'Cliff' | 'Linear' | 'Fragment'

type ReleaseDataListType = {
  startAt: string
  endAtOrRatio: string
}

export interface SwapData {
  pool?: Pool
  releaseType: ReleaseType
  isWhitelisted: boolean
  maxAmountPerWallet: string
  releaseDataList: ReleaseDataListType[]
  txFeeRatio: string
  stakeContract: string
}

export interface IToken {
  address: HexData
  symbol: string
  decimals: number
}

export interface SwapToken {
  token0?: IToken
  token1?: IToken
}
