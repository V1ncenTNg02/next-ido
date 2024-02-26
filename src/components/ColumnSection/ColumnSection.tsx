import React from 'react'

import * as Model from './model'
import ComponentMapper from '../ComponentMapper'

interface Props extends Model.ColumnSection {}

const ColumnSection: React.FC<Props> = ({ section }) => {
  return (
    <div>
      {section.map(blok => (
        <ComponentMapper blok={blok} key={blok._uid} />
      ))}
    </div>
  )
}

export default ColumnSection
