import BN from 'bignumber.js'
import { ethers } from 'ethers'
import { t } from "i18next";
import React, { useEffect } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import styles from './Web3Button.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { SwapToken } from '../SwapSection/model'
import { PoolType } from '../../context/ProjectData/model'
import { useSwap } from '../../context/Swap/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import { formatContractError, formatFullAmount, getABI, getContractAddress } from '../../helpers'

interface Props {
  netId: number
  type: PoolType
  index: number
  swapToken: SwapToken
  disabled: boolean
  tokenSwapAmount: string
  auctionPricePerToken1: BN
  proof: string[]
  setTokenSwapAmount: (amount: string) => void
}

export const SwapButton: React.FC<Props> = ({ netId, type, index, disabled, tokenSwapAmount, swapToken, auctionPricePerToken1, proof, setTokenSwapAmount }) => {
  
  const contractAddress = getContractAddress(type, netId)
  const abi = getABI(type)
  const fullTokenSwapAmount =
    type === 'DUTCH' ? formatFullAmount(tokenSwapAmount, swapToken.token0?.decimals) : formatFullAmount(tokenSwapAmount, swapToken.token1?.decimals)
  const sendValue =
    swapToken.token1?.address === ethers.constants.AddressZero
      ? type === 'DUTCH'
        ? formatFullAmount(new BN(tokenSwapAmount).dividedBy(auctionPricePerToken1).toFixed(), swapToken.token1?.decimals)
        : fullTokenSwapAmount
      : '0'
  const { swapStatus, onSetSwapStatus, onSetSwapError } = useSwap()
  const { showPendingToast, showSuccessToast, closeToast } = useCustomToast()
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: type === 'DUTCH' ? 'bid' : 'swap',
    enabled: !disabled,
    args: [index, fullTokenSwapAmount, proof],
    value: BigInt(new BN(sendValue).decimalPlaces(0, BN.ROUND_CEIL).toFixed()),
    onSuccess() {
      onSetSwapError(null)
    },
    onError(error) {
      onSetSwapStatus('prepare')
      onSetSwapError(formatContractError(error.message))
    }
  })

  const {
    data,
    write,
    reset: resetContractWrite
  } = useContractWrite({
    ...config,
    onSuccess(data) {
      showPendingToast(data.hash)
      onSetSwapStatus('wait')
      onSetSwapError(null)
    },
    onError(error) {
      closeToast()
      onSetSwapError(formatContractError(error.message))
      onSetSwapStatus('prepare')
    }
  })

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      if (data.status === 'reverted') {
        closeToast()
        onSetSwapStatus('prepare')
      } else {
        onSetSwapStatus('success')
        showSuccessToast(data.transactionHash)
        onSetSwapError(null)
      }
      setTokenSwapAmount('')
    },
    onError(error) {
      closeToast()
      onSetSwapError(formatContractError(error.message))
      onSetSwapStatus('prepare')
    }
  })

  const handleClick = () => {
    onSetSwapError(null)
    onSetSwapStatus('write')
    write?.()
  }

  useEffect(() => {
    return () => {
      resetContractWrite()
    }
  }, [resetContractWrite])

  const disabledSwapButton = !write || swapStatus === 'wait' || swapStatus === 'write' || disabled

  const buttonText = swapStatus === 'write' ? t('button-check-wallet') : swapStatus === 'wait' ? t('button-wait') : type === 'DUTCH' ? t('button-bid') : t('button-swap')

  return (
    <button className={styles.sharedButtonWrapper} disabled={disabledSwapButton} onClick={handleClick}>
      {swapStatus === 'wait' && <LoadingSpinner className={styles.loading} />}
      {buttonText}
    </button>
  )
}
