import React from 'react'
import Marquee from 'react-fast-marquee'

import styles from './Marquee.module.css'

import * as Model from './model'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body } from '../Typography/Typography'
import { SBAsset, WebsiteComponent } from '../../storyblok/models'

interface Props extends Model.MarqueeImageType {
  title: string
  images: WebsiteComponent<SBAsset>[]
}

const MarqueeImage: React.FC<Props> = ({ title, images }) => {
  return (
    <div className={styles.marqueeOuterContainer}>
      {title && (
        <div className={styles.marqueeTitle}>
          <Body>{title}</Body>
        </div>
      )}
      <Marquee>
        <div className={styles.marqueeContainer}>
          {images.map(img => (
            <ResponsiveMedia className={styles.logImg} key={img.filename} src={img.filename} alt='logo' />
          ))}
        </div>
      </Marquee>
    </div>
  )
}

export default MarqueeImage
