import Link from 'next/link'
import React from 'react'

import styles from './MoreItem.module.css'

import * as Model from './model'
import ResponsiveMedia from '../../ResponsiveMedia/ResponsiveMedia'
import { SubBody } from '../../Typography/Typography'
import { useNavigation } from '../../../context/Navigation/hooks'

interface Props extends Model.MoreItem {}

const MoreItem: React.FC<Props> = ({ link, src, alt, description, title }) => {
  const { setDropdownOpen } = useNavigation()

  return (
    <>
      <Link href={link} className={styles.itemContainer} onClick={() => setDropdownOpen(false)}>
        <div className={styles.image}>{src && <ResponsiveMedia src={src} alt={alt || ''} objectFit='contain' className={styles.image} />}</div>
        <div>
          <div className={styles.linkWrapper} onClick={() => setDropdownOpen(false)}>
            <SubBody className='font-tektur'>{title}</SubBody>
          </div>
          <div className={styles.textWrapper}>
            <SubBody>{description}</SubBody>
          </div>
        </div>
      </Link>
    </>
  )
}

export default MoreItem
