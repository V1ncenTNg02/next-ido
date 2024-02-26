import cx from 'classnames'
import React from 'react'

import styles from './NavItem.module.css'

import * as Model from './model'
import Anchor from '../../Anchor/Anchor'

interface Props extends Model.NavItem {
  className?: string
}

const NavItem: React.FC<Props> = ({ className, ...restNavItem }) => {
  const navItemClassNames = cx({
    [styles.navItem as any]: true,
    [className as any]: true
  })

  return (
    <li className={navItemClassNames}>
      <Anchor url={restNavItem.url} title={restNavItem.title} className={styles.navItemAnchor} />
    </li>
  )
}

export default NavItem
