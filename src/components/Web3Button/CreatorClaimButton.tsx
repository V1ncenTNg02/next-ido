import cx from 'classnames'
import React, { useEffect } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import styles from './Web3Button.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { PoolType } from '../../context/ProjectData/model'
import { useSwap } from '../../context/Swap/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import { formatContractError, getABI, getContractAddress } from '../../helpers'

interface Props {
  type: PoolType
  netId: number
  index: number
  disabled: boolean
}

export const CreatorClaimButton: React.FC<Props> = ({ type, netId, index, disabled }) => {
  const contractAddress = getContractAddress(type, netId)
  const abi = getABI(type)
  const { claimStatus, onSetClaimStatus, onSetClaimError } = useSwap()
  const { showPendingToast, showSuccessToast, closeToast } = useCustomToast()
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi,
    functionName: 'creatorClaim',
    enabled: !disabled,
    args: [index],
    onSuccess() {
      onSetClaimError(null)
    },
    onError(error) {
      onSetClaimStatus('prepare')
      onSetClaimError(formatContractError(error.message))
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
      onSetClaimStatus('wait')
      onSetClaimError(null)
    },
    onError(error) {
      closeToast()
      onSetClaimError(formatContractError(error.message))
      onSetClaimStatus('prepare')
    }
  })

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        onSetClaimStatus('prepare')
      } else {
        onSetClaimStatus('success')
      }
      showSuccessToast(data.transactionHash)
      onSetClaimError(null)
    },
    onError(error) {
      closeToast()
      onSetClaimError(formatContractError(error.message))
      onSetClaimStatus('prepare')
    }
  })

  const handleClick = () => {
    onSetClaimError(null)
    onSetClaimStatus('write')
    write?.()
  }

  useEffect(() => {
    return () => {
      resetContractWrite()
    }
  }, [resetContractWrite])

  const disabledClaimButton = !write || claimStatus === 'wait' || claimStatus === 'write' || disabled

  const buttonText = claimStatus === 'write' ? 'Check wallet' : claimStatus === 'wait' ? 'Waiting...' : 'Creator Claim'

  return (
    <button className={cx(styles.sharedButtonWrapper, styles.claimButton)} disabled={disabledClaimButton} onClick={handleClick}>
      {claimStatus === 'wait' && <LoadingSpinner className={styles.loading} />}
      {buttonText}
    </button>
  )
}
