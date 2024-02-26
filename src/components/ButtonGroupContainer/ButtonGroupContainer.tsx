import cx from 'classnames'
import React from 'react'

import styles from './ButtonGroupContainer.module.css'

import * as Model from './model'
import ComponentMapper from '../ComponentMapper'
import { isCentreLayout, isLeftLayout, isRightLayout } from '../../helpers'

interface Props extends Model.ButtonGroupContainer {}

const ButtonGroupContainer: React.FC<Props> = ({ button, layout }) => {
  const groupWrapperClassName = cx({
    [styles.groupWrapper as any]: true,
    ['justify-center']: isCentreLayout(layout),
    ['justify-start']: isLeftLayout(layout),
    ['justify-end']: isRightLayout(layout),
    ['justify-center lg:justify-start mt-3']: layout === 'adaptive'
  })

  return (
    <div className={groupWrapperClassName}>
      {button.map(blok => (
        <ComponentMapper blok={blok} key={blok._uid} />
      ))}
    </div>
  )
}

export default ButtonGroupContainer
