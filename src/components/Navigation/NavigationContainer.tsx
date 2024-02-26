import React from 'react'

import Navigation from './Navigation'
import PreviewAlert from '../PreviewAlert/PreviewAlert'

interface Props {
  children: React.ReactNode
  preview: boolean
}

const NavigationContainer: React.FC<Props> = ({ children, preview }) => {
  return (
    <div>
      {preview && <PreviewAlert />}
      <Navigation />
      <div>{children}</div>
    </div>
  )
}

export default NavigationContainer
