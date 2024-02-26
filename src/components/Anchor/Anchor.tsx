import cx from 'classnames'
import Link from 'next/link'
import React from 'react'

import styles from './Anchor.module.css'

import * as Model from './model'
import { SubBody } from '../Typography/Typography'
import { isUrlExternal } from '../../helpers'

interface Props extends Model.Anchor {
  onClick?: (event: React.MouseEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  target?: '_self' | '_blank'
  className?: string
  children?: React.ReactNode
}

const Anchor: React.FC<Props> = ({ url, title, onClick, onKeyDown, target = '_self', className = '', children }) => {
  if (!url) return null
  const isExternal = isUrlExternal(url)
  const rel = isExternal ? 'noopener' : undefined

  const anchorClassNames = cx({
    [styles.anchor as any]: true,
    [className]: true
  })

  return (
    <Link className={anchorClassNames} href={url} target={isExternal ? '_blank' : target} rel={rel} onClick={onClick} onKeyDown={onKeyDown}>
      {title && <SubBody className='font-tektur'>{title}</SubBody>}
      {children}
    </Link>
  )
}

export default Anchor
