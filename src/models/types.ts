import { ReferralCode, User } from '@prisma/client'

export type ReferralCodeWithUser = ReferralCode & { referredUser: User | null }

export type Contract = {
  id: number
  contract: 'FIX' | 'ENGLISH' | 'DUTCH'
  poolIndex: number
  poolName: string
  SBKey: string
  isSuccess: boolean
  poolInfo: PoolInfo
  netId: number
  projectIcon: string
  slug: string
}

export type PoolInfo = {
  token0: Token
  token1: Token
  releaseType: string
  startAt: string
  endAt: string
  claimStartAt: string
  claimEndAt: string
}

export type Token = {
  address: string
  symbol: string
  decimals: number
}
