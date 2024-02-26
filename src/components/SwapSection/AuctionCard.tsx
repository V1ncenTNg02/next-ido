import BN from 'bignumber.js'
import { ethers } from 'ethers'
import Link from 'next/link'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCopy } from 'react-icons/fa'
import { useBalance, useContractRead } from 'wagmi'

import styles from './SwapSection.module.css'

import { ReleaseType, SwapToken } from './model'
import CountdownSection from '../Countdown/CountdownSection'
import { Body, BodyBold } from '../Typography/Typography'
import { CreatorClaimButton, SwapButton, UserClaimButton } from '../Web3Button'
import ApproveButton from '../Web3Button/ApproveButton'
import { abis, HexData } from '../../configs'
import { PoolStatusType, PoolType } from '../../context/ProjectData/model'
import { useSignature } from '../../context/Signature/hooks'
import { useSwap } from '../../context/Swap/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import {
  escapeRegExp,
  formatFullAmount,
  formatHash,
  formatTimeToMilliseconds,
  formatTokenAmount,
  getABI,
  getContractAddress,
  getExplorerUrl,
  inputRegex,
  isNowAfterTimestamp,
  numberFormat,
  timeFormat
} from '../../helpers'
import { MerkleTreeService } from '../../services/merkleTree'

interface Props {
  type: PoolType
  index: number
  netId: number
  totalAmount: {
    token0: BN
    token1: BN
  }
  swapToken: SwapToken
  creator: string
  releaseType: ReleaseType
  openAt: string
  closedAt: string
  claimedAt: string
  maxAmountPerWallet: string
  amountTotal0: string
  amountTotal1: string
  releasedDataList: any[]
  totalClaimed: BN
  creatorClaimed: boolean
  auctionPricePerToken1: BN
  poolStatus: PoolStatusType
  txFeeRatio: string
  stakeContract: string
  isPoolWhitelisted: boolean
  treeService: MerkleTreeService | null
}

const AuctionCard: React.FC<Props> = ({
  type,
  index,
  netId,
  totalAmount,
  swapToken,
  creator,
  releaseType,
  openAt,
  closedAt,
  claimedAt,
  maxAmountPerWallet,
  amountTotal0,
  releasedDataList,
  totalClaimed,
  auctionPricePerToken1,
  creatorClaimed,
  poolStatus,
  txFeeRatio,
  stakeContract,
  treeService,
  isPoolWhitelisted
}) => {
  const { t } = useTranslation()
  const [tokenSwapAmount, setTokenSwapAmount] = useState('')
  const { swapError, onSetSwapError, claimError } = useSwap()
  const [debouncedTokenSwapAmount, setDebouncedTokenSwapAmount] = useState('0')
  const [inputError, setInputError] = useState<string | null>(null)
  const [isAmountApproved, setIsAmountApproved] = useState(true)
  const [isAddressWhitelisted, setIsAddressWhitelisted] = useState(false)
  const [proof, setProof] = useState([])
  const isToken1NativeCurrency = swapToken.token1 && swapToken.token1.address === ethers.constants.AddressZero

  const token0TotalAmount = formatTokenAmount(String(totalAmount.token0), swapToken.token0?.decimals)
  const token1TotalAmount = formatTokenAmount(String(totalAmount.token1), swapToken.token1?.decimals)
  const availableToken0Amount = formatTokenAmount(amountTotal0, swapToken.token0?.decimals)
  const token0TotalClaimedByCurrentUser = formatTokenAmount(String(totalClaimed), swapToken.token0?.decimals)

  const progress = new BN(totalClaimed).div(new BN(amountTotal0)).multipliedBy(100).toNumber()
  const toast = useCustomToast()

  const { user } = useSignature()

  const contract = useMemo(() => {
    return {
      address: getContractAddress(type, netId),
      abi: getABI(type)
    }
  }, [type, netId])

  const { data } = useContractRead({
    ...contract,
    enabled: !!user,
    functionName: type === 'DUTCH' ? 'myAmountSwap0' : 'myAmountSwapped1',
    args: [user?.etherAddress, index]
  })

  const myAmountSwapped = data && data[0]?.result

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setTokenSwapAmount(nextUserInput)
    }
  }

  const { data: nativeCurrencyBalance } = useBalance({
    address: user?.etherAddress as HexData,
    enabled: !!user,
    watch: true
  })

  const { data: token1Erc20Balance } = useBalance({
    token: swapToken.token1?.address as HexData,
    address: user?.etherAddress as HexData,
    enabled: swapToken.token1 && swapToken.token1.address !== ethers.constants.AddressZero && !!user,
    watch: true
  })

  const { data: allowanceAmount, refetch: refetchAllowanceAmount } = useContractRead({
    address: swapToken.token1?.address as HexData,
    abi: abis.erc20,
    enabled: swapToken.token1 && swapToken.token1.address !== ethers.constants.AddressZero && !!user,
    functionName: 'allowance',
    args: [user?.etherAddress, getContractAddress(type, netId)],
    watch: true
  })

  useEffect(() => {
    if (!treeService || !user) return
    setIsAddressWhitelisted(treeService.checkWhitelist(user.etherAddress))
    if (isPoolWhitelisted) {
      setProof(treeService.generateProof(user.etherAddress))
    }
  }, [treeService, user, isPoolWhitelisted])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tokenSwapAmount) setDebouncedTokenSwapAmount(tokenSwapAmount)
      else {
        onSetSwapError(null)
        setInputError(null)
        setDebouncedTokenSwapAmount('0')
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [tokenSwapAmount, onSetSwapError])

  useEffect(() => {
    if (!swapToken) return
    if (!swapToken.token1) return

    let isWithinAllowance = true
    if (swapToken.token1.address !== ethers.constants.AddressZero) {
      refetchAllowanceAmount()
      const formatAllowanceAmount = new BN(String(allowanceAmount)).div(10 ** swapToken.token1.decimals)
      if (type !== 'DUTCH') {
        isWithinAllowance = formatAllowanceAmount.isGreaterThanOrEqualTo(new BN(debouncedTokenSwapAmount))
      } else {
        isWithinAllowance = formatAllowanceAmount.isGreaterThanOrEqualTo(new BN(debouncedTokenSwapAmount).dividedBy(auctionPricePerToken1))
      }
      setIsAmountApproved(isWithinAllowance)
    }
  }, [allowanceAmount, refetchAllowanceAmount, swapToken, isToken1NativeCurrency, debouncedTokenSwapAmount, type, auctionPricePerToken1])

  const token1Balance = isToken1NativeCurrency ? nativeCurrencyBalance : token1Erc20Balance

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, '.')
    enforcer(inputValue)
    if (!token1Balance) return
    if (type === 'FIX' || type === 'ENGLISH') {
      const userInputToken1FullAmount = formatFullAmount(inputValue, swapToken.token1?.decimals)
      if (new BN(inputValue).isGreaterThan(new BN(token1Balance.formatted))) {
        setInputError(t('pool-error-balance'))
      } else if (new BN(userInputToken1FullAmount).plus(new BN(String(myAmountSwapped))).isGreaterThan(new BN(maxAmountPerWallet))) {
        setInputError(t('pool-error-max-amout'))
      } else if (new BN(userInputToken1FullAmount).dividedBy(auctionPricePerToken1).plus(new BN(totalAmount.token0)).isGreaterThan(new BN(amountTotal0))) {
        setInputError(t('pool-error-ava-amout'))
      } else {
        setInputError(null)
      }
    } else {
      const userSpentToken0FullAmount = formatFullAmount(inputValue, swapToken.token0?.decimals)
      if (new BN(userSpentToken0FullAmount).plus(new BN(String(myAmountSwapped))).isGreaterThan(new BN(maxAmountPerWallet))) {
        setInputError(t('pool-error-max-amout'))
      } else if (new BN(inputValue).dividedBy(auctionPricePerToken1).isGreaterThan(new BN(token1Balance.formatted))) {
        setInputError(t('pool-error-balance'))
      } else if (new BN(userSpentToken0FullAmount).plus(new BN(totalAmount.token0)).isGreaterThan(amountTotal0)) {
        setInputError(t('pool-error-ava-amout'))
      } else {
        setInputError(null)
      }
    }
  }

  const tokenEstSwapAmount =
    type !== 'DUTCH' ? new BN(debouncedTokenSwapAmount).multipliedBy(auctionPricePerToken1) : new BN(debouncedTokenSwapAmount).dividedBy(auctionPricePerToken1)

  const showSwapButton = (isAmountApproved && Number(debouncedTokenSwapAmount) >= 0) || isToken1NativeCurrency || inputError

  return (
    <div className='col-span-1 lg:col-span-7'>
      <div className={styles.auctionCardOuterSection}>
        <table className='w-full'>
          <thead>
            <tr>
              <th scope='col' className={styles.auctionCardTitle}>
                {swapToken.token0?.symbol.toUpperCase()} Pool
                <div className='text-primary'>{!isNowAfterTimestamp(openAt) && <CountdownSection startDate={formatTimeToMilliseconds(openAt)} />}</div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('pool-started-at')}</td>
              <td className='text-end'>{timeFormat(openAt, false)}</td>
            </tr>
            <tr>
              <td>{t('pool-ended-at')}</td>
              <td className='text-end'>{timeFormat(closedAt, false)}</td>
            </tr>
            {releasedDataList.length > 0 && (
              <tr className='h-[40px] w-full'>
                <td>{t('pool-claim-start-at')}</td>
                <td className='text-end'>{timeFormat(releasedDataList[0].startAt, false)}</td>
              </tr>
            )}
            {releasedDataList.length > 0 && releaseType === 'Linear' && (
              <tr className='h-[40px] w-full'>
                <td>{t('pool-claim-end-at')}</td>
                <td className='text-end'>{timeFormat(releasedDataList[0].endAtOrRatio, false)}</td>
              </tr>
            )}
            <tr>
              <td>{t('pool-successful-sold-amount')}</td>
              <td className='text-end'>
                {Number(token0TotalAmount) > 1 || Number(token0TotalAmount) === 0
                  ? numberFormat(token0TotalAmount, '0,0')
                  : numberFormat(token0TotalAmount, '0.0')}{' '}
                {swapToken.token0?.symbol}
              </td>
            </tr>
            <tr>
              <td>{t('pool-successful-fund-raised')}</td>
              <td className='text-end'>
                {Number(token1TotalAmount) > 1 || Number(token1TotalAmount) === 0
                  ? numberFormat(token1TotalAmount, '0,0')
                  : numberFormat(token1TotalAmount, '0.000')}{' '}
                {swapToken.token1?.symbol}
              </td>
            </tr>
            <tr>
              <td>{t('pool-fund-receiving-wallet')}</td>
              <td className={styles.etherAddressTd}>
                <Link target='_blank' href={`${getExplorerUrl(netId)?.address}${stakeContract}` || ''}>
                  {formatHash(stakeContract, 4)}
                </Link>
                <FaCopy
                  onClick={e => {
                    e.preventDefault()
                    navigator.clipboard.writeText(stakeContract)
                    toast.showSuccessToast(t('pool-copied-to-clipboard'))
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>{t('pool-platform-fee-charged')}</td>
              <td className='text-end'>
                {numberFormat(txFeeRatio, '0.0%')} &nbsp;
                {swapToken.token1?.symbol}
              </td>
            </tr>
            <tr>
              <td>{t('pool-creator-wallet-address')}</td>
              <td className={styles.etherAddressTd}>
                <Link target='_blank' href={`${getExplorerUrl(netId)?.address}${creator}` || ''}>
                  {formatHash(creator, 4)}
                </Link>
                <FaCopy
                  onClick={e => {
                    e.preventDefault()
                    navigator.clipboard.writeText(creator)
                    toast.showSuccessToast(t('pool-copied-to-clipboard'))
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>{t('pool-methods-of-token-unlocking')}</td>
              <td className='text-end'>{releaseType} Unblocking</td>
            </tr>
          </tbody>
        </table>
      </div>

      {poolStatus !== 'Coming Soon' && (
        <div className='mt-5 text-primary'>
          <div className='mb-3'>
            <BodyBold className='mb-3'>{t('pool-actions')}</BodyBold>
          </div>
          {poolStatus === 'Claim Coming Soon' && <Body className='text-success-400'>{t('pool-claim-coming-soon')}</Body>}
          {poolStatus === 'Closed' && <Body className='text-error-400'>{t('pool-the-pool-is-closed')}</Body>}
          {user ? (
            <div>
              {user.etherAddress.toLowerCase() === creator.toLowerCase() ? (
                <CreatorClaimButton disabled={!isNowAfterTimestamp(closedAt) || !!creatorClaimed} index={index} type={type} netId={netId} />
              ) : !isPoolWhitelisted || isAddressWhitelisted ? (
                <div>
                  {poolStatus === 'Live' && (
                    <div className={styles.inputWrapper}>
                      <input
                        value={tokenSwapAmount}
                        className={styles.amountInput}
                        type='text'
                        placeholder={t('pool-placeholder', { bidtype: type === 'DUTCH' ? swapToken.token0?.symbol : swapToken.token1?.symbol })}
                        onChange={handleInputChange}
                      />
                      {showSwapButton ? (
                        <SwapButton
                          disabled={
                            !!inputError || !tokenSwapAmount || isNowAfterTimestamp(closedAt) || Number(debouncedTokenSwapAmount) === 0 || !isAmountApproved
                          }
                          index={index}
                          type={type}
                          netId={netId}
                          tokenSwapAmount={debouncedTokenSwapAmount}
                          swapToken={swapToken}
                          auctionPricePerToken1={auctionPricePerToken1}
                          setTokenSwapAmount={setTokenSwapAmount}
                          proof={proof}
                        />
                      ) : (
                        <ApproveButton token1Address={swapToken.token1?.address as HexData} swapAddress={getContractAddress(type, netId)} />
                      )}
                    </div>
                  )}
                  <div className='my-2'>
                    {inputError ? (
                      <Body className='text-error-400'>
                        <strong>{t('pool-error')}</strong> {inputError}
                      </Body>
                    ) : (
                      <div className='mt-2'>
                        {Number(debouncedTokenSwapAmount) > 0 && (
                          <Body className='text-success-400'>
                            {type === 'DUTCH' ? (
                              <span>
                                <strong>{t('pool-info')}</strong> {t('pool-you-will-spent')} {numberFormat(tokenEstSwapAmount.toFixed(), '0,0.000000')}{' '}
                                {swapToken.token1?.symbol}
                              </span>
                            ) : (
                              <span>
                                <strong>{t('pool-info')}</strong> {t('pool-you-will-get')} {numberFormat(tokenEstSwapAmount.toFixed(), '0,0')}{' '}
                                {swapToken.token0?.symbol}
                              </span>
                            )}
                          </Body>
                        )}
                      </div>
                    )}
                  </div>
                  {releaseType === 'Linear' && poolStatus === 'Claim Live' && (
                    <div className='mt-5'>
                      <div className='flex justify-between font-tektur'>
                        <div>{t('pool-progress')}</div>
                        <div className=' '>
                          {numberFormat(parseFloat(token0TotalClaimedByCurrentUser), '0,0')} {swapToken.token0?.symbol} /
                          {numberFormat(availableToken0Amount, '0,0')} {swapToken.token0?.symbol}
                        </div>
                      </div>
                      <div className={styles.progressBarOuterSection}>
                        <div className={styles.progressBarInnerSection} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  <div className='w-full my-3'>
                    {releaseType !== 'Instant' && poolStatus === 'Claim Live' && (
                      <UserClaimButton
                        type={type}
                        netId={netId}
                        index={index}
                        disabled={
                          !(
                            (releaseType === 'Cliff' && isNowAfterTimestamp(claimedAt)) ||
                            (releaseType === 'Linear' &&
                              isNowAfterTimestamp(closedAt) &&
                              isNowAfterTimestamp(claimedAt) &&
                              !isNowAfterTimestamp(releasedDataList[0].endAtOrRatio))
                          )
                        }
                      />
                    )}
                  </div>
                  {swapError && (
                    <Body className='text-error-400'>
                      <strong>{t('pool-error')}</strong> {swapError}
                    </Body>
                  )}
                  {claimError && (
                    <Body className='text-error-400'>
                      <strong>{t('pool-error')}</strong> {claimError}
                    </Body>
                  )}
                </div>
              ) : (
                <Body className='text-error-400'>* This pool requires whitelisted address to participate</Body>
              )}
            </div>
          ) : (
            <Body className='text-error-400'>{t('pool-please-signup-first')}</Body>
          )}
        </div>
      )}
    </div>
  )
}

export default AuctionCard
