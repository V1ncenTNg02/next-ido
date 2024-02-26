import cx from 'classnames'
import { ethers } from 'ethers'
import { t } from 'i18next'
import React, { useEffect } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import styles from './Web3Button.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { abis, HexData } from '../../configs'
import { useSwap } from '../../context/Swap/hooks'
import { useCustomToast } from '../../context/Toast/hooks'
import { formatContractError } from '../../helpers'

interface Props {
  token1Address: HexData
  swapAddress: HexData
  className?: string
}

const ApproveButton: React.FC<Props> = ({ token1Address, swapAddress, className }) => {
  const { approveStatus, onSetApproveStatus, onSetApproveError } = useSwap()
  const { showPendingToast, showSuccessToast, closeToast } = useCustomToast()
  const approveAmount = ethers.constants.MaxUint256.toString()

  const { config } = usePrepareContractWrite({
    address: token1Address,
    abi: abis.erc20,
    functionName: 'approve',
    args: [swapAddress, approveAmount],
    onSuccess() {
      onSetApproveError(null)
    },
    onError(error) {
      onSetApproveStatus('prepare')
      onSetApproveError(formatContractError(error.message))
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
      onSetApproveStatus('wait')
      onSetApproveError(null)
    },
    onError(error) {
      onSetApproveError(formatContractError(error.message))
      onSetApproveStatus('prepare')
    }
  })

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      if (data.status === 'reverted') {
        closeToast()
        onSetApproveStatus('prepare')
      } else {
        onSetApproveStatus('success')
        showSuccessToast(data.transactionHash)
        onSetApproveError(null)
      }
    },
    onError(error) {
      closeToast()
      onSetApproveError(formatContractError(error.message))
      onSetApproveStatus('prepare')
    }
  })

  const handleClick = (e: any) => {
    e.preventDefault()
    onSetApproveStatus('write')
    write?.()
  }

  useEffect(() => {
    return () => {
      resetContractWrite()
    }
  }, [resetContractWrite])

  const disabledApproveButton = !write || approveStatus === 'wait' || approveStatus === 'write'

  const buttonText = approveStatus === 'write' ? t('button-check-wallet') : approveStatus === 'wait' ? t('button-wait') : t('button-approve')

  return (
    <button className={`${cx(styles.sharedButtonWrapper)} ${className}`} disabled={disabledApproveButton} onClick={handleClick}>
      {approveStatus === 'wait' && <LoadingSpinner className={styles.loading} />}
      {buttonText}
    </button>
  )
}

export default ApproveButton
