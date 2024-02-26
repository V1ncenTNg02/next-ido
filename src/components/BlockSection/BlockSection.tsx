import cx from 'classnames'
import React from 'react'

import styles from './BlockSection.module.css'

import * as Model from './model'
import ComponentMapper from '../ComponentMapper'

interface Props extends Model.BlockSection {}

const BlockSection: React.FC<Props> = ({ theme, blocks }) => {
  const boxContainerClassName = cx({
    [styles.container as any]: true,
    [styles.greyBg as any]: theme === 'grey',
    [styles.whiteBg as any]: theme === 'white',
    [styles.slateBlueBg as any]: theme === 'bluePurple',
    [styles.bluePurpleReverse as any]: theme === 'bluePurpleReverse',
    [styles.purplePinkGradientBg as any]: theme === 'purplePink',
    [styles.skyBlueBg as any]: theme === 'skyBlue'
  })

  return (
    <div className={boxContainerClassName}>
      <div className='max-w-1440 mx-auto'>
        {blocks.map(blok => (
          <ComponentMapper blok={blok} key={blok._uid} />
        ))}
      </div>
    </div>
  )
}

export default BlockSection
