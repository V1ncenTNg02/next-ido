import cx from 'classnames'
import React, { useEffect, useState } from 'react'
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import styles from './ChainSelector.module.css'

import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { SubBody } from '../Typography/Typography'
import { useSignature } from '../../context/Signature/hooks'
import { getChainImage, getChainName, getSupportedChains } from '../../helpers'

const CHAIN_SELECTOR_ID = 'chain-selector'

interface Props {
  className?: string
}

const ChainSelector: React.FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNetId, setSelectedNetId] = useState(5)
  const { switchNetwork } = useSwitchNetwork()
  const { user } = useSignature()
  const { chain } = useNetwork()
  const netId = chain?.id ?? 5

  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest('div')
      if (target && target.id === CHAIN_SELECTOR_ID) {
        return
      }
      setIsOpen(false)
    }
    window.addEventListener('click', handleWindowClick)
    return () => {
      window.removeEventListener('click', handleWindowClick)
    }
  }, [])

  useEffect(() => {
    if (!user || !netId) return
    if (getSupportedChains().find(item => item.toString() === netId.toString())) {
      setSelectedNetId(Number(netId))
      switchNetwork?.(Number(netId))
    }
  }, [netId, user])

  const handleSwitchNetwork = (netId: string) => {
    if (!user) return
    setSelectedNetId(Number(netId))
    switchNetwork?.(Number(netId))
  }

  return (
    <div className={cx(styles.selectorContainer, className)}>
      <div className={styles.selectorWrapper} onClick={() => setIsOpen(!isOpen)} id={CHAIN_SELECTOR_ID}>
        <div className={styles.image}>
          <ResponsiveMedia src={getChainImage(selectedNetId)} alt={getChainName(selectedNetId)} />
        </div>
        <SubBody className='font-tektur text-primary capitalize'>{getChainName(selectedNetId)}</SubBody>
        {isOpen ? <IoChevronUpSharp className='h-5 w-5 text-gray-500' /> : <IoChevronDownSharp className='h-5 w-5 text-gray-500' />}
      </div>
      {isOpen && (
        <div className={styles.dropdownContainer}>
          {getSupportedChains().map(netId => (
            <div className='flex items-center justify-center cursor-pointer' key={netId} onClick={() => handleSwitchNetwork(netId)}>
              <div className={styles.image}>
                <ResponsiveMedia src={getChainImage(netId)} alt={getChainName(netId)} />
              </div>
              <SubBody className='font-tektur capitalize'>{getChainName(netId)}</SubBody>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChainSelector
