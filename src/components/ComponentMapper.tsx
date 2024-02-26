import { storyblokEditable } from '@storyblok/react'
import React from 'react'

import { componentMap } from './componentMap'
import { WebsiteComponent } from '../storyblok/models'

interface Props {
  blok: WebsiteComponent
}

const ComponentMapper: React.FC<Props> = ({ blok }) => {
  const [Component, mapFn] = componentMap[blok.component] ?? []

  if (typeof componentMap[blok.component] === 'undefined') {
    return (
      <p style={{ padding: 40, textAlign: 'center', border: '2px dashed #ccc' }}>
        <strong>{blok.component}</strong> has not been implemented yet.
        <br />
      </p>
    )
  }
  const props = mapFn ? mapFn(blok) : {}

  return (
    <div {...storyblokEditable(blok)}>
      <Component {...props} />
    </div>
  )
}

export default ComponentMapper
