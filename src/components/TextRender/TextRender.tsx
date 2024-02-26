import cx from 'classnames'
import React from 'react'

import styles from './TextRender.module.css'

import * as Model from './model'
import { Body, BodyBold, Header, HeaderBold, SubBody, SubBodyBold, SubHeader, SubHeaderBold } from '../Typography/Typography'
import { isCentreLayout, isLeftLayout, isRightLayout } from '../../helpers'
import { SBTextRenderType } from '../../storyblok/models'

interface Props extends Model.TextRender {}

const renderText = (type: SBTextRenderType, content: string): JSX.Element | null => {
  switch (type) {
    case 'header':
      return <Header>{content}</Header>
    case 'headerBold':
      return <HeaderBold>{content}</HeaderBold>
    case 'subHeader':
      return <SubHeader>{content}</SubHeader>
    case 'subHeaderBold':
      return <SubHeaderBold>{content}</SubHeaderBold>
    case 'subTitle':
      return <SubHeader>{content}</SubHeader>
    case 'subTitleBold':
      return <SubHeaderBold>{content}</SubHeaderBold>
    case 'body':
      return <Body>{content}</Body>
    case 'bodyBold':
      return <BodyBold>{content}</BodyBold>
    case 'subBody':
      return <SubBody>{content}</SubBody>
    case 'subBodyBold':
      return <SubBodyBold>{content}</SubBodyBold>
    default:
      break
  }
  return null
}

const TextRender: React.FC<Props> = ({ type, content, layout, theme }) => {
  const textAlignClass = cx({
    ['text-primary text-center']: true,
    ['text-white']: theme === 'white',
    [styles.rainboText as any]: theme === 'rainbow',
    ['lg:text-center']: isCentreLayout(layout),
    ['lg:text-right']: isRightLayout(layout),
    ['lg:text-left']: isLeftLayout(layout)
  })

  return <div className={textAlignClass}>{renderText(type, content)}</div>
}

export default TextRender
