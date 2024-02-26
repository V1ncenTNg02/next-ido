import cx from 'classnames'
import React from 'react'

import styles from './Loading.module.css'

interface Props {
  className?: string
}

const LoadingSpinner: React.FC<Props> = ({ className }) => {
  return <div className={cx(styles.loader, className)}></div>
}

export default LoadingSpinner
