import React from 'react'

type CountryCode = 'au' | 'cn'

type Locale = 'en' | 'zh'
export interface Language {
  countryCode: CountryCode
  locale: Locale
}

export interface Navigation {
  menuOpen: boolean
  openItem: string | null
  dropdownOpen: boolean
  userInfoDropdownOpen: boolean
  onOpenItem: (id: string | null) => void
  onSetMenuOpen: (open: boolean) => void
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSetUserInfoDropdownOpen: (open: boolean) => void
}
