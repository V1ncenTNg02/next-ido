import cx from 'classnames'
import Link from 'next/link'
import React from 'react'

import styles from '../Anchor/Anchor.module.css'

interface Props {
  email: string
  className?: string
  children?: React.ReactNode
}

const Email: React.FC<Props> = ({ email, className = '', children }) => {
  const anchorClassName = cx({
    [styles.anchor as any]: true,
    [className]: true
  })

  return (
    <Link href={`mailto:${email}`} className={anchorClassName} passHref>
      {children}
    </Link>
  )
}

export default Email
