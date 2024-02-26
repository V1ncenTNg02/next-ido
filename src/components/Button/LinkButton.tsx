import cx from 'classnames'
import React from 'react'

import styles from './LinkButton.module.css'

import * as Model from './model'
import Anchor from '../Anchor/Anchor'

interface Props extends Model.Button {
  className?: string
}

const LinkButton: React.FC<Props> = ({ className, ...restButton }) => {
  const buttonClassNames = cx({
    [styles.basicButton as any]: true,
    [className as any]: true,
    [styles.theme1 as any]: restButton.buttonStyle === 'theme1',
    [styles.theme2 as any]: restButton.buttonStyle === 'theme2',
    [styles.theme3 as any]: restButton.buttonStyle === 'theme3',
    [styles.largeButton as any]: restButton.buttonWidth === 'large'
  })

  return (
    <li className='list-none flex items-center justify-center'>
      <Anchor url={restButton.url} title={restButton.title} className={buttonClassNames} />
    </li>
  )
}

export default LinkButton
