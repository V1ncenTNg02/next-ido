import BN from 'bignumber.js'
import { t } from 'i18next'
import Link from 'next/link'
import React from 'react'
import { FaCopy } from 'react-icons/fa'

import styles from './SwapSection.module.css'

import { SwapToken } from './model'
import { Small } from '../Typography/Typography'
import { PoolStatusType, PoolType } from '../../context/ProjectData/model'
import { useCustomToast } from '../../context/Toast/hooks'
import { formatHash, formatTokenAmount, getContractAddress, getExplorerUrl, mapPoolType, numberFormat } from '../../helpers'

interface Props {
  type: PoolType
  index: number
  name: string
  netId: number
  isWhiteListed: boolean
  swapToken: SwapToken
  maxAmountPerWallet: string
  amountTotal0: string
  amountTotal1: string
  initialPrice: BN
  totalAmount: {
    token0: BN
    token1: BN
  }
  auctionPricePerToken1: BN
  poolStatus: PoolStatusType
}

const InfoCard: React.FC<Props> = ({
  type,
  index,
  name,
  netId,
  isWhiteListed,
  swapToken,
  maxAmountPerWallet,
  amountTotal0,
  initialPrice,
  totalAmount,
  auctionPricePerToken1,
  poolStatus
}) => {
  const auctionPerWallet =
    type === 'DUTCH' ? formatTokenAmount(maxAmountPerWallet, swapToken.token0?.decimals) : formatTokenAmount(maxAmountPerWallet, swapToken.token1?.decimals)
  const availableToken0Amount = formatTokenAmount(amountTotal0, swapToken.token0?.decimals)
  const token0TotalSwappedAmount = formatTokenAmount(String(totalAmount.token0), swapToken.token0?.decimals)
  const progress = new BN(totalAmount.token0).div(new BN(amountTotal0)).multipliedBy(100).toNumber()
  const toast = useCustomToast()

  return (
    <div className='col-span-1 lg:col-span-5'>
      <div className={styles.outerSection}>
        <div className={styles.tokenInfo}>
          <table className='w-full'>
            <thead>
              <tr>
                <th scope='col' className='text-start'>
                  {t('pool-token-information')}
                </th>
                <th aria-hidden></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('pool-token-address')}</td>
                <td className={styles.etherAddressTd}>
                  <Link target='_blank' href={`${getExplorerUrl(netId)?.address}${swapToken.token0?.address}` || ''}>
                    {formatHash(String(swapToken.token0?.address), 4)}
                  </Link>
                  <FaCopy
                    onClick={e => {
                      e.preventDefault()
                      navigator.clipboard.writeText(String(swapToken.token0?.address))
                      toast.showSuccessToast(t('pool-copied-to-clipboard'))
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>{t('pool-token-symbol')}</td>
                <td className='text-end'>{swapToken.token0?.symbol}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.auctionInfo}>
          <table className='w-full'>
            <thead>
              <tr>
                <th scope='col' className='text-start'>
                  {t('pool-auction-information')}
                </th>
                <th aria-hidden></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('pool-contract-address')}</td>
                <td className={styles.etherAddressTd}>
                  <Link target='_blank' href={`${getExplorerUrl(netId)?.address}${getContractAddress(type, netId)}` || ''}>
                    {formatHash(String(getContractAddress(type, netId)), 4)}
                  </Link>
                  <FaCopy
                    onClick={e => {
                      e.preventDefault()
                      navigator.clipboard.writeText(String(getContractAddress(type, netId)))
                      toast.showSuccessToast(t('pool-copied-to-clipboard'))
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>{t('pool-auction-type')}</td>
                <td className='text-end'>{t(`${mapPoolType(type)}`)}</td>
              </tr>
              <tr>
                <td>{t('pool-pool-number')}</td>
                <td className='text-end'>#{index}</td>
              </tr>
              <tr>
                <td>{t('pool-pool-name')}</td>
                <td className='text-end'>{name}</td>
              </tr>
              <tr>
                <td>{t('pool-participant')}</td>
                <td className='text-end'>{isWhiteListed ? 'Whitelist' : 'Public'}</td>
              </tr>
              <tr>
                <td>{t('pool-max-per-wallet')}</td>
                <td className='text-end'>
                  {numberFormat(auctionPerWallet, '0,0')} {type === 'DUTCH' ? swapToken.token0?.symbol : swapToken.token1?.symbol}
                </td>
              </tr>
              <tr>
                <td>{t('pool-total-avaiable-amount')}</td>
                <td className='text-end'>
                  {numberFormat(availableToken0Amount, '0,0')} {swapToken.token0?.symbol}
                </td>
              </tr>
              {type !== 'FIX' && (
                <tr>
                  <td>{t('initial-pool-price')}</td>
                  <td className='text-end'>
                    1 {swapToken.token1?.symbol} = {numberFormat(initialPrice.toFixed(), '0,0')} {swapToken.token0?.symbol}
                  </td>
                </tr>
              )}
              <tr>
                <td>{t('pool-price')}</td>
                <td className='text-end'>
                  1 {swapToken.token1?.symbol} = {numberFormat(auctionPricePerToken1.toFixed(), '0,0')} {swapToken.token0?.symbol}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {poolStatus !== 'Coming Soon' && (
        <div className='font-tektur mt-10 w-full'>
          <div className='w-full flex justify-between text-primary '>
            <Small>{t('pool-progress')}</Small>
            <Small>
              {numberFormat(token0TotalSwappedAmount, '0,0')} {swapToken.token0?.symbol} / {numberFormat(availableToken0Amount, '0,0')}{' '}
              {swapToken.token0?.symbol}
            </Small>
          </div>
          <div className={styles.progressBarOuterSection}>
            <div className={styles.progressBarInnerSection} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InfoCard
