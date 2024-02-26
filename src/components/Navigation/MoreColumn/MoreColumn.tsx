import cx from 'classnames'
import React from 'react'

import styles from './MoreColumn.module.css'

import * as Model from './model'
import MoreItem from '../MoreItem/MoreItem'
import { BodyBold } from '../../Typography/Typography'

interface Props extends Model.MoreColumn {}

const MoreColumn: React.FC<Props> = ({ colTitle, moreItems, inverted }) => {
  const columnContainerClassName = cx({
    [styles.columnContainer as any]: true,
    [styles.invertedBox as any]: inverted
  })

  return (
    <div className={columnContainerClassName}>
      <BodyBold className='text-primary font-tektur pb-3'>{colTitle}</BodyBold>
      {moreItems.map(item => (
        <MoreItem {...item} key={item.id} />
      ))}
    </div>
  )
}

export default MoreColumn
