import cx from 'classnames'
import React from 'react'

import styles from './ColumnContainer.module.css'

import * as Model from './model'
import ComponentMapper from '../ComponentMapper'
import { HeaderBold, SubHeaderBold, SubTitle } from '../Typography/Typography'

interface Props extends Model.ColumnContainer {}

const ColumnContainer: React.FC<Props> = ({ title, subheading, text, column, theme }) => {
  const columnWrapperClassNames = cx({
    [styles.fullWidthWrapper as any]: column.length === 1,
    [styles.twoColsWrapper as any]: column.length == 2,
    [styles.threeColsWrapper as any]: column.length === 3
  })

  const columnContainerClassNames = cx({
    [styles.columnContainer as any]: true,
    ['text-white']: theme === 'white',
    ['text-primary']: theme === 'primary',
    [styles.rainbowText as any]: theme === 'rainbow'
  })

  return (
    <div className={columnContainerClassNames}>
      {subheading && (
        <div className={styles.subheadingWrapper}>
          <SubHeaderBold>{subheading}</SubHeaderBold>
        </div>
      )}
      {title && (
        <div className={styles.titleWrapper}>
          <HeaderBold>{title}</HeaderBold>
        </div>
      )}
      {text && (
        <div className={styles.textWrapper}>
          <SubTitle>{text}</SubTitle>
        </div>
      )}
      <div className={columnWrapperClassNames}>
        {column.map(blok => (
          <ComponentMapper blok={blok} key={blok._uid} />
        ))}
      </div>
    </div>
  )
}

export default ColumnContainer
