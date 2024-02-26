import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import styles from './LanguageSelector.module.css'

import { SubBody } from '../Typography/Typography'
import { useNavigation } from '../../context/Navigation/hooks'
import { Language } from '../../context/Navigation/model'

const LANGUAGE_SELECTOR_ID = 'language-selector'

const languages: Language[] = [
  {
    countryCode: 'au',
    locale: 'en'
  },
  {
    countryCode: 'cn',
    locale: 'zh'
  }
]

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const countryCode = languages.find(language => language.locale === router.locale)?.countryCode
  const { dropdownOpen, setDropdownOpen } = useNavigation()

  const handleLanguageChange = (language: Language) => {
    setIsOpen(false)
    router.push(`/${language.locale}${router.asPath}`, undefined, { locale: language.locale })
  }

  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest('button')
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return
      }
      setIsOpen(false)
    }
    window.addEventListener('click', handleWindowClick)
    return () => {
      window.removeEventListener('click', handleWindowClick)
    }
  }, [])

  const handleClick = () => {
    if (dropdownOpen) setDropdownOpen(false)
    setIsOpen(!isOpen)
  }

  return (
    <div className='flex items-center z-40 relative'>
      <div className='inline-block text-left'>
        <button type='button' id={LANGUAGE_SELECTOR_ID} className={styles.buttonContainer} onClick={handleClick}>
          <span className={`fi fi-${countryCode} fis`} />
        </button>
      </div>
      {isOpen && (
        <div className={styles.dropdownListContainer} role='menu' aria-orientation='vertical' aria-labelledby='language-selector'>
          <div className='py-1 grid grid-cols-1' role='none'>
            {languages.map(language => (
              <button className={styles.languageBtn} key={language.countryCode} onClick={() => handleLanguageChange(language)}>
                <span className={`fi fi-${language.countryCode} fis`} />
                <SubBody className='text-primary'>{language.locale.toUpperCase()}</SubBody>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
