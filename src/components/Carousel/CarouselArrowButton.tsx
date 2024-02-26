import React, { PropsWithChildren } from 'react'
import { FaArrowCircleLeft } from 'react-icons/fa'
import { FaArrowCircleRight } from 'react-icons/fa'

import styles from './Carousel.module.css'

type Props = PropsWithChildren<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>

export const PrevButton: React.FC<Props> = props => {
  const { children, ...restProps } = props
  return (
    <button type='button' {...restProps} className={styles.emblaButton}>
      <FaArrowCircleLeft className={styles.emblaButton__icon} />
      {children}
    </button>
  )
}

export const NextButton: React.FC<Props> = props => {
  const { children, ...restProps } = props
  return (
    <button type='button' {...restProps} className={styles.emblaButton}>
      <FaArrowCircleRight className={styles.emblaButton__icon} />
      {children}
    </button>
  )
}
