import React, { createContext, useState } from 'react'

import { Navigation } from './model'

export const NavigationContext = createContext<Navigation>({
  menuOpen: false,
  openItem: null,
  dropdownOpen: false,
  userInfoDropdownOpen: false,
  onOpenItem: () => {},
  onSetMenuOpen: () => {},
  setDropdownOpen: () => {},
  onSetUserInfoDropdownOpen: () => {}
})

interface Props {
  children: React.ReactNode
}

const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userInfoDropdownOpen, setUserInfoDropdownOpen] = useState(false)

  const onOpenItem = (id: string | null) => setOpenItem(id)
  const onSetUserInfoDropdownOpen = (open: boolean) => setUserInfoDropdownOpen(open)
  const onSetMenuOpen = setMenuOpen

  return (
    <NavigationContext.Provider
      value={{ menuOpen, openItem, dropdownOpen, userInfoDropdownOpen, onOpenItem, onSetMenuOpen, setDropdownOpen, onSetUserInfoDropdownOpen }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
