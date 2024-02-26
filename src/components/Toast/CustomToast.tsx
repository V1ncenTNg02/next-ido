import React from 'react'

import styles from './CustomToast.module.css'

import Anchor from '../Anchor/Anchor'
import { SubBody } from '../Typography/Typography'
import { getExplorerUrl } from '../../helpers'

interface CustomToastProps {
  hash?: string
  message: string
  netId: number
}

const CustomToast: React.FC<CustomToastProps> = ({ hash, message, netId }) => {
  return (
    <div className={styles.toastContainer}>
      <SubBody className='text-success-400'>{message}</SubBody>
      {hash && <Anchor title='Inspect on Etherscan' url={`${getExplorerUrl(netId)?.tx}${hash}`} target='_blank' className='text-xs md:text-sm' />}
    </div>
  )
}

export default CustomToast
