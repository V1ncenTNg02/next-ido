import { createContext } from 'react'

import { GlobalData } from './model'
import { Settings } from './model'

export const SettingsContext = createContext<Settings>({
  navItems: [],
  moreColumns: [],
  socialLinks: {},
  footerColumns: [],
  socialLinksTitle: '',
  footerFeatures: {
    newsletterText: '',
    subscriptionButtonText: '',
    subscriptionText: ''
  },
  copyright: '',
  legalLinks: [],
  userDropdown:[],
})

interface Props {
  globalData: GlobalData
  children: React.ReactNode
}

const GlobalDataProvider: React.FC<Props> = ({ globalData, children }) => {
  if (!globalData) return <>{children}</>

  const { settings } = globalData

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export default GlobalDataProvider
