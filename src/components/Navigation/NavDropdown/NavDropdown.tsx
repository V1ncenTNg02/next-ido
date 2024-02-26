import cx from 'classnames'
import React from 'react'

import styles from './Navdropdown.module.css'

import * as Model from '../MoreColumn/model'
import MoreColumn from '../MoreColumn/MoreColumn'
interface Props {
  moreColumns: Model.MoreColumn[]
}

const NavDropdown: React.FC<Props> = ({ moreColumns }) => {
  const dropdownContainerClassName = cx({
    [styles.dropdownContainer as any]: true,
    [styles.threeCol as any]: moreColumns.length === 3,
    [styles.fourCol as any]: moreColumns.length === 4
  })

  return (
    <div className={dropdownContainerClassName}>
      {moreColumns.map(col => (
        <MoreColumn {...col} key={col.id} />
      ))}
    </div>
  )
}

export default NavDropdown
