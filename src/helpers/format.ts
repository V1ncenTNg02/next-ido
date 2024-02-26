import BN from 'bignumber.js'
import { t } from 'i18next'
import moment from 'moment'
import numeral from 'numeral'

import { PoolStatusType, PoolType } from '../context/ProjectData/model'
import { PoolInfo } from '../models/types'
import { ReferralCodeWithUser } from '../models/types'

const BIG_TEN = new BN(10)

export const mapPoolType = (type: PoolType) => {
  switch (type) {
    case 'FIX':
      return 'Fixed Price'
    case 'DUTCH':
      return 'Dutch Auction'
    case 'ENGLISH':
      return 'English Auction'
    default:
      return ''
  }
}

export const numberFormat = (num: number | string, format: string = '0,0') => numeral(num).format(format)

export const formatTokenAmount = (amount: string, decimals = 18) => {
  return BN(amount).dividedBy(BIG_TEN.pow(decimals)).toFixed()
}

export const formatFullAmount = (amount: string, decimals = 18) => {
  return BN(amount).multipliedBy(BIG_TEN.pow(decimals)).toFixed()
}

export const formatHash = (txHash: string, chars = 6) => {
  return `${txHash.substring(0, chars + 2)}...${txHash.substring(txHash.length - chars)}`
}

export const timeFormat = (timestamp: number | string, toUTC = true) => {
  if (toUTC) {
    return `${moment.utc(timestamp, 'X').format('DD/MM/YYYY HH:mm')} UTC`
  }

  return `${moment(timestamp, 'X').format('DD/MM/YYYY HH:mm')}`
}

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

export const formatContractError = (message: string) => {
  const formatMessage = message.toLowerCase()

  if (formatMessage.includes('user rejected the request')) return t('pool-error-reject')

  if (formatMessage.includes('invalid address')) return t('pool-error-address')

  if (formatMessage.includes('invalid BigNumber value')) return t('pool-error-value')

  if (formatMessage.includes('nonce has already been used')) return t('pool-error-nonce')

  if (formatMessage.includes('cannot estimate gas')) return t('pool-error-gas')

  if (formatMessage.includes('invalid openat')) return t('pool-error-start-time')

  if (formatMessage.includes('invalid closeat')) return t('pool-error-close-time')

  if (formatMessage.includes('invalid claimat')) return t('pool-error-claim-time')

  if (formatMessage.includes('startat < endatorratio')) return t('pool-error-time')

  return t('pool-error-reject')
}

export const formatTimeToMilliseconds = (timeStamp: string) => {
  return moment.unix(Number(timeStamp)).valueOf()
}

export const isNowAfterTimestamp = (timeStamp: string) => {
  return moment().isAfter(moment.unix(Number(timeStamp)))
}

export const isTimestamp1AfterTimestamp2 = (timestamp1: string, timestamp2: string) => {
  return moment.unix(Number(timestamp1)).isAfter(moment.unix(Number(timestamp2)))
}

export const mapPoolStatus = (poolInfo: PoolInfo): PoolStatusType => {
  const now = moment()

  const releaseType = poolInfo.releaseType
  const startAtMoment = moment(poolInfo.startAt)
  const endAtMoment = moment(poolInfo.endAt)
  const claimStartMoment = moment(poolInfo.claimStartAt)
  const claimEndAtMoment = moment(poolInfo.claimEndAt)

  if (now.isBefore(startAtMoment)) {
    return 'Coming Soon'
  }
  if (now.isBetween(startAtMoment, endAtMoment)) {
    return 'Live'
  }

  if (releaseType === '0' && now.isAfter(endAtMoment)) {
    return 'Closed'
  }

  if (now.isBetween(endAtMoment, claimStartMoment)) {
    return 'Claim Coming Soon'
  }

  if ((releaseType === '1' && now.isAfter(claimStartMoment)) || (releaseType === '2' && now.isBetween(claimStartMoment, claimEndAtMoment))) {
    return 'Claim Live'
  }

  if (now.isAfter(claimEndAtMoment)) {
    return 'Closed'
  }

  return 'Unknown'
}

export const getRefCodePair = (codes: ReferralCodeWithUser[]) => {
  const stack = []
  for (let i = 0; i < codes.length; i += 2) {
    stack.push(codes.slice(i, i + 2))
  }
  return stack
}
