import cx from 'classnames'
import React from 'react'
import { useSwitchNetwork } from 'wagmi'

import styles from './Web3Button.module.css'

import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

interface Props {
  netId: number
  chainName: string
  className?: string
}

const NetworkSwitchButton: React.FC<Props> = ({ netId, chainName, className }) => {
  const { isLoading, switchNetwork } = useSwitchNetwork()
  const handleClick = () => {
    switchNetwork?.(netId)
  }

  return (
    <button className={cx(styles.sharedButtonWrapper, className)} disabled={!switchNetwork} onClick={handleClick}>
      {isLoading && <LoadingSpinner className={styles.loading} />}
      Switch to {chainName}
    </button>
  )
}

export default NetworkSwitchButton
