import cx from 'classnames'
import Image from 'next/legacy/image'
import React from 'react'

import styles from './ResponsiveMedia.module.css'

import * as Model from './model'
import { hasImageExt } from '../../helpers'

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

interface Props extends Model.ResponsiveMedia {
  screenHeight?: boolean
  className?: string
  objectFit?: ObjectFit
}

const ResponsiveMedia: React.FC<Props> = ({ src, alt, screenHeight, className, objectFit = 'cover' }) => {
  if (!src) return null

  const isImage = hasImageExt(src)
  const videoClassName = cx({
    [styles.video as any]: true,
    'min-h-full': screenHeight
  })

  return isImage ? (
    <div className={cx(styles.responsiveMedia, className)}>
      <Image src={src} alt={alt} layout='fill' objectFit={objectFit} priority className={className} />
    </div>
  ) : (
    <div className={className}>
      <video src={src} className={videoClassName} loop muted autoPlay disableRemotePlayback playsInline />
    </div>
  )
}

export default ResponsiveMedia
