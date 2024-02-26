import { useWeb3Modal } from '@web3modal/wagmi/react'
import axios from 'axios'
import cx from 'classnames'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import React, { useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaBars } from 'react-icons/fa'
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5'
import { recoverMessageAddress } from 'viem'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import styles from './Navigation.module.css'

import NavDropdown from './NavDropdown/NavDropdown'
import { isDropDown, isSingleItem } from './NavItem/data'
import NavItem from './NavItem/NavItem'
import ChainSelector from '../ChainSelector/ChainSelector'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import { Logo } from '../Logo/Logo'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { SubBody } from '../Typography/Typography'
import config from '../../configs'
import { useSettings } from '../../context/GlobalData/hooks'
import { useNavigation } from '../../context/Navigation/hooks'
import { useSignature } from '../../context/Signature/hooks'
import { useCustomToast } from '../../context/Toast/hooks'

const Navigation: React.FC = () => {
  const { navItems, moreColumns, userDropdown } = useSettings()
  const { onOpenItem, menuOpen, dropdownOpen, userInfoDropdownOpen, onSetMenuOpen, setDropdownOpen, onSetUserInfoDropdownOpen } = useNavigation()
  const { data: signMessageData, variables, signMessage } = useSignMessage()
  const { address } = useAccount()
  const { showErrorToast } = useCustomToast()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()
  const { recoveredAddress, setRecoveredAddress, signatureCheckPass, user, setUser } = useSignature()
  const router = useRouter()
  const dropDownRef = useRef<any>(null)

  useEffect(() => {
    const handleSignature = async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData
        })
        setRecoveredAddress(recoveredAddress)
      }
    }
    handleSignature()
  }, [setRecoveredAddress, signMessageData, variables?.message])

  useEffect(() => {
    if (router.pathname.includes('signup')) return
    if (localStorage.getItem('userToken')) return
    if (!address || recoveredAddress) return
    const message = 'Sign in to the Next Ido early access waitlist'
    signMessage({ message })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, recoveredAddress, signMessage])

  useEffect(() => {
    const login = async () => {
      if (user || localStorage.getItem('userToken')) return
      try {
        if (signatureCheckPass) {
          const resExistence = await axios.post(`${config.userApiPrefix}?action=addressExistence`, { address: recoveredAddress })
          const { existence } = resExistence.data
          if (!existence) {
            disconnect()
            router.push('/signup')
            return
          }

          //signin
          const { data } = await axios.post(`${config.userApiPrefix}?action=signin`, { address: recoveredAddress })
          if (!data) return

          const { userData } = data
          const { userInfo, userToken } = userData
          localStorage.setItem('userToken', userToken)
          setUser(userInfo)
        }
      } catch (e) {
        console.error('check user error')
        showErrorToast(t('toast-user-error'))
      }
    }
    login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoveredAddress, router, signatureCheckPass, user])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'scroll'
    }
  }, [menuOpen])

  //handle onClick event when user click outside of dropDown Area
  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event?.target)) {
        setDropdownOpen(false)
        onSetUserInfoDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleOutSideClick, true)
    return () => {
      document.removeEventListener('click', handleOutSideClick, true)
    }
  }, [setDropdownOpen, onSetUserInfoDropdownOpen])

  const menuSectionClassName = cx({
    [styles.menuSection as any]: true,
    [styles.menuOpen as any]: menuOpen,
    [styles.menuClose as any]: !menuOpen
  })

  const navigationOuterClassName = cx({
    [styles.navigationOuter as any]: true,
    [styles.navigationOuterExpand as any]: menuOpen
  })

  const toggleMenu = () => {
    if (menuOpen) onOpenItem(null)
    onSetMenuOpen(!menuOpen)
  }

  const toggleDropdown = () => {
    setDropdownOpen((prevState: boolean) => !prevState)
  }

  const toggleUserInfoDropdown = () => {
    onSetUserInfoDropdownOpen(!userInfoDropdownOpen)
  }

  const handleConnectWallet = async () => {
    try {
      sessionStorage.removeItem('referralToken')
      if (isConnected) {
        disconnect()
      }
      open({ view: 'Connect' })
    } catch (error: any) {
      console.error('handleConnectWallet error', error.message)
      showErrorToast(t('toast-handleConnectWallet-error'))
    }
  }

  return (
    <div className={navigationOuterClassName}>
      <nav className={styles.navigation}>
        <div className={styles.logoBox}>
          <Logo hasText />
        </div>

        <div className='flex items-center'>
          <ChainSelector className='lg:hidden' />
          <button type='button' className={styles.button} aria-controls='mobile-menu' aria-expanded='false' onClick={toggleMenu}>
            {menuOpen ? <AiOutlineClose className='h-6 w-6 text-primary' /> : <FaBars className='h-6 w-6 text-primary' />}
          </button>
        </div>

        <div className={menuSectionClassName}>
          <ul className={styles.navList}>
            {navItems.filter(isSingleItem).map(item => (
              <div
                key={item.id}
                className={styles.flexLayoutContainer}
                onClick={() => {
                  onSetMenuOpen(false)
                  setDropdownOpen(false)
                  onSetUserInfoDropdownOpen(false)
                }}
              >
                <NavItem className='max-lg:scale-[150%]' {...item} />
              </div>
            ))}
            {navItems.filter(isDropDown).map(item => (
              <div
                key={item.id}
                className={styles.flexLayoutContainer}
                onClick={() => {
                  toggleDropdown()
                  onSetUserInfoDropdownOpen(false)
                }}
              >
                <NavItem {...item} className='pointer-events-none max-lg:scale-[150%]' />
                {dropdownOpen ? (
                  <IoChevronUpSharp className='h-5 w-5 text-gray-500 -ml-3 mt-0.5 cursor-pointer' />
                ) : (
                  <IoChevronDownSharp className='h-5 w-5 text-gray-500 -ml-3 mt-0.5 cursor-pointer' />
                )}
              </div>
            ))}
          </ul>
          <div className={styles.mobileBoxContainer}>{dropdownOpen && <NavDropdown moreColumns={moreColumns} />}</div>

          <div className='lg:flex lg:gap-2 gap-6 flex justify-center max-lg:scale-[125%] lg:px-2'>
            <ChainSelector className='hidden lg:block' />
            <LanguageSelector />
            <ul className={cx(styles.navList)}>
              {user ? (
                <div
                  className={styles.twitterInfoContainer}
                  onClick={() => {
                    setDropdownOpen(false)
                    toggleUserInfoDropdown()
                  }}
                >
                  <ResponsiveMedia src={user.twitterAvatar} alt='twitter avatar' objectFit='contain' className={styles.twitterAvatar} />
                  <SubBody>{user.twitter}</SubBody>
                  {userInfoDropdownOpen ? (
                    <IoChevronUpSharp className='h-5 w-5 text-gray-500 mt-0.5 cursor-pointer' />
                  ) : (
                    <IoChevronDownSharp className='h-5 w-5 text-gray-500 mt-0.5 cursor-pointer' />
                  )}
                </div>
              ) : (
                <div>
                  {!router.pathname.includes('signup') && (
                    <button
                      onClick={handleConnectWallet}
                      className='text-primary p-2 bg-white outline-none hover:outline hover:opacity-80 hover:bg-grey-300 hover:border hover:rounded-md'
                    >
                      {t('nav-sign-in')}
                    </button>
                  )}
                </div>
              )}
              {userInfoDropdownOpen && (
                <ul className={cx(styles.userInfoContainer)} ref={dropDownRef}>
                  <div
                    onClick={() => {
                      onSetUserInfoDropdownOpen(false)
                      onSetMenuOpen(false)
                    }}
                  >
                    {userDropdown.map(item => (
                      <NavItem {...item} key={item.id} className={styles.userInfoLink} />
                    ))}
                    <li
                      className='cursor-pointer text-subBody p-2'
                      onClick={() => {
                        disconnect()
                        signOut()
                      }}
                    >
                      {t('nav-log-out')}
                    </li>
                  </div>
                </ul>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {dropdownOpen && (
        <div className={styles.moreColumnsContiner} ref={dropDownRef}>
          <div className='max-w-1440 mx-auto'>
            <NavDropdown moreColumns={moreColumns} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Navigation
