import React from 'react'

import styles from './FooterColumn.module.css'

import * as Model from './model'
import NavItem from '../../Navigation/NavItem/NavItem'
import { BodyBold } from '../../Typography/Typography'

interface Props extends Model.FooterColumn {}

const FooterColumn: React.FC<Props> = ({ title, footerItems }) => {
  return (
    <ul className={styles.columnContainer}>
      <BodyBold className='mb-5 font-tektur'>{title}</BodyBold>
      {footerItems.map(link => (
        <div key={link.id} className={styles.columnLinkContainer}>
          <NavItem {...link} className={styles.navItem} />
        </div>
      ))}
    </ul>
  )
}

export default FooterColumn
