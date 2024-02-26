import React from 'react'

import * as Model from './model'
import ComponentMapper from '../../components/ComponentMapper'

interface Props extends Model.Standard {}

const Standard: React.FC<Props> = ({ heroPanel, body }) => (
  <main>
    {(heroPanel ?? []).map(blok => (
      <ComponentMapper blok={blok} key={blok._uid} />
    ))}
    {(body ?? []).map(blok => (
      <ComponentMapper blok={blok} key={blok._uid} />
    ))}
  </main>
)

export default Standard
