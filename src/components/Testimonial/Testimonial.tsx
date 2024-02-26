import cx from 'classnames'
import React from 'react'
import { FaStar } from 'react-icons/fa'

import styles from './Testimonial.module.css'

import * as Model from './model'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body, BodyBold, SubTitleBold } from '../Typography/Typography'

interface Props extends Model.Testimonial {}

const ACTIVE_STAR_COLOR = '#FFC107'
const INACTIVE_STAR_COLOR = '#E4E4E4'
const STAR_RANGE = [1, 2, 3, 4, 5]

const Testimonial: React.FC<Props> = ({ rating, comments, name, role, imgSrc, imgAlt, logoSrc, logoAlt, reversed }) => {
  const imageClassName = cx({
    [styles.image as any]: true,
    ['order-last lg:order-last']: reversed,
    ['order-last lg:-order-last']: !reversed
  })

  return (
    <div className={styles.testimonialContainer}>
      <ResponsiveMedia src={imgSrc} alt={imgAlt || ' '} className={imageClassName} />
      <div className={styles.testimonialWrapper}>
        <div className={styles.ratingWrapper}>
          {STAR_RANGE.map(index => {
            return <FaStar key={index} color={index <= rating ? ACTIVE_STAR_COLOR : INACTIVE_STAR_COLOR} />
          })}
        </div>
        <div className={styles.commentsWrapper}>
          <SubTitleBold className='text-primary'>{comments} </SubTitleBold>
        </div>
        <div className={styles.introWrapper}>
          <div>
            <BodyBold className={styles.textColorWrapper}>{name}</BodyBold>
            {role && (
              <div>
                <Body className={styles.textColorWrapper}>{role}</Body>
              </div>
            )}
          </div>
          {logoSrc && (
            <>
              <div className={styles.lineWrapper} />
              <div className={styles.logoImgWrapper}>
                <ResponsiveMedia src={logoSrc} alt={logoAlt || ' '} objectFit='contain' className={styles.logoWrapper} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Testimonial
