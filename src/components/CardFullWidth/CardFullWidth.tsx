import React from 'react'

import styles from './CardFullWidth.module.css'

import * as Model from './model'
import Button from '../Button/LinkButton'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body, SubHeaderBold } from '../Typography/Typography'
import { removePagesPath } from '../../helpers'

interface Props extends Model.CardFullWidth {}
const CardFullWidth: React.FC<Props> = ({ src, alt, title, description, link, linkField }) => {
  return (
    <div className={styles.card}>
      <ResponsiveMedia src={src} alt={alt || ' '} className={styles.imageWrapper} screenHeight />
      <div className={styles.infoWrapper}>
        <div className='mb-6 text-primary'>
          {title && <SubHeaderBold>{title}</SubHeaderBold>}
          {description && <Body>{description}</Body>}
        </div>
        <div className={styles.linkWrapper}>{link && linkField && <Button id='' url={removePagesPath(link)} title={linkField} buttonStyle='theme1' buttonWidth='normal' />}</div>
      </div>
    </div>
  )
}

export default CardFullWidth
