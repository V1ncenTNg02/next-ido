import React from 'react'

import styles from './Layout.module.css'

import Footer from '../Footer/Footer'
import NavigationContainer from '../Navigation/NavigationContainer'

interface Props {
  children: React.ReactNode
  preview: boolean
  showFooter?: boolean
}

const Layout: React.FC<Props> = ({ children, preview, showFooter = true }) => {
  return (
    <div className={styles.layout}>
      <NavigationContainer preview={preview}>{children}</NavigationContainer>
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout
