import cx from 'classnames'
import Image from 'next/legacy/image'
import React from 'react'

import styles from './Card.module.css'

import * as Model from './model'
import ButtonGroupContainer from '../ButtonGroupContainer/ButtonGroupContainer'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body, SubTitleBold } from '../Typography/Typography'
import { isCentreLayout, isLeftLayout, isRightLayout } from '../../helpers'

interface Props extends Model.Card {}

const Card: React.FC<Props> = ({ imageSrc, imageAlt, iconSrc, iconAlt, title, description, tag, buttons, textAlignment, isBorder }) => {
  const cardClassName = cx({
    [styles.cardBasic as any]: true,
    [styles.cardBorder as any]: isBorder
  })

  const textAlignClass = cx({
    ['text-center']: isCentreLayout(textAlignment),
    ['text-right']: isRightLayout(textAlignment),
    ['text-left']: isLeftLayout(textAlignment),
    ['min-h-[4.5rem] line-clamp-3 text-primary']: true
  })

  const tagWrapperClassName = cx({
    ['justify-center']: isCentreLayout(textAlignment),
    ['justify-end']: isRightLayout(textAlignment),
    ['justify-start']: isLeftLayout(textAlignment),
    ['flex flex-wrap']: true,
    [styles.tagWrapper as any]: true
  })

  const renderImage = () => {
    if (imageSrc) return <ResponsiveMedia src={imageSrc} alt={imageAlt || ' '} screenHeight className='w-auto h-60 rounded-[15px]' />
    if (iconSrc) return <ResponsiveMedia src={iconSrc} alt={iconAlt || ' '} screenHeight objectFit='contain' className='w-auto h-20' />
    return <></>
  }

  return (
    <div className={cardClassName}>
      <div className='flex justify-center'>{renderImage()}</div>
      <div className={textAlignClass}>
        <span className={styles.iconInline}>
          {iconSrc && imageSrc && <Image src={iconSrc} alt={iconAlt} layout='fixed' width='50' height='28' objectFit='contain' priority />}
        </span>
        <div className={styles.headingWrapper}>
          <SubTitleBold>{title}</SubTitleBold>
        </div>
      </div>
      <div className={tagWrapperClassName}>
        {tag &&
          tag.map((item, i) => (
            <span key={i} className={styles.tag}>
              {item}
            </span>
          ))}
      </div>
      <div className={textAlignClass}>
        <Body>{description}</Body>
      </div>
      {buttons && <ButtonGroupContainer button={buttons} layout={buttons.length == 1 ? 'left' : 'center'} />}
    </div>
  )
}

export default Card
