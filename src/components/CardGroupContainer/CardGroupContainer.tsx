import cx from 'classnames'
import React from 'react'

import styles from './CardGroupContainer.module.css'

import * as Model from './model'
import Card from '../Card/Card'

interface Props extends Model.CardGroupContainer {}

const CardGroupContainer: React.FC<Props> = ({ cards }) => {
  const containerWrapperClassNames = cx({
    [styles.fullWidthWrapper as any]: cards.length === 1,
    [styles.twoColsWrapper as any]: cards.length == 2,
    [styles.threeColsWrapper as any]: cards.length >= 3
  })

  return (
    <div className={containerWrapperClassNames}>
      {cards.map((card, index) => (
        <div key={index}>
          <Card
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            iconSrc={card.iconSrc}
            iconAlt={card.iconAlt}
            title={card.title}
            description={card.description}
            tag={card.tag}
            buttons={card.buttons}
            textAlignment={card.textAlignment}
            linkLayout={card.linkLayout}
            isBorder={card.isBorder}
          />
        </div>
      ))}
    </div>
  )
}

export default CardGroupContainer
