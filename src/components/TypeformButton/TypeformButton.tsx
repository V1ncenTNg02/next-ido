import { PopupButton } from '@typeform/embed-react'
import cx from 'classnames'
import React from 'react'

import styles from '../Button/LinkButton.module.css'

import * as Model from './model'
import Button from '../Button/LinkButton'
import { isCentreLayout, isLeftLayout, isRightLayout } from '../../helpers/layout'
import { SBTypeformType } from '../../storyblok/models'
interface Props extends Model.TypeformButton {}

const TypeformButton: React.FC<Props> = ({ typeformType = 'forward', button, layout = 'left' }) => {
  const buttonWrapperClassName = cx({
    [styles.basicButton as any]: true,
    ['justify-center']: isCentreLayout(layout),
    ['justify-start']: isLeftLayout(layout),
    ['justify-end']: isRightLayout(layout),
    [styles.theme3 as any]: true,
    [styles.largeButton as any]: true
  })
  const renderButton = (typeformType: SBTypeformType) => {
    switch (typeformType) {
      case 'popup': {
        const typeformId = button.url.split('/').pop() ?? ''
        return (
          <div className='flex items-center justify-center'>
            <PopupButton id={typeformId} size={80} className={buttonWrapperClassName}>
              {button.title}
            </PopupButton>
          </div>
        )
      }
      case 'forward':
        return <Button {...button} />
      default:
        return <Button {...button} />
    }
  }
  return <div>{renderButton(typeformType)}</div>
}

export default TypeformButton
