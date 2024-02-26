import { t } from 'i18next'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import styles from './ProgressionMap.module.css'

import { StyledButton } from '../StyledButton/StyledButton'
import { Body, HeaderBold, Heading5Bold, SubHeader } from '../Typography/Typography'
import { useSignature } from '../../context/Signature/hooks'
import { useCustomToast } from '../../context/Toast/hooks'

type ProgressionMapProps = {
  handleTwitterAuth: () => void
  handleMetaMaskAuth: () => void
  recoveredAddress: string | null
  isConnected: boolean
  refCode?: string
}

const ProgressionMap: React.FC<ProgressionMapProps> = ({ handleTwitterAuth, handleMetaMaskAuth, isConnected }) => {
  const [refCode, setRefCode] = useState<string>()
  const { data: session } = useSession()
  const { signatureCheckPass } = useSignature()
  const { showErrorToast } = useCustomToast()

  useEffect(() => {
    const code = sessionStorage.getItem('referralCode')
    code ? setRefCode(code) : null
  }, [])

  const renderCardTitle = (title: string, markStatus: boolean) => {
    return (
      <div className={styles.cardTitleSection}>
        <Heading5Bold>{title}</Heading5Bold>
        <IoMdCheckmarkCircleOutline className={markStatus ? styles.checkMarkDone : styles.checkMark} />
      </div>
    )
  }

  const handleConnectWalletButton = () => {
    return session && session.user ? handleMetaMaskAuth() : showErrorToast(t('toast-connect-twitter-first'))
  }

  return (
    <div className='flex flex-col justify-center items-center py-52'>
      <div className={styles.headerSection}>
        <HeaderBold>{t('signup-early-access')}</HeaderBold>
        <SubHeader>{t('signup-early-access-intro')}</SubHeader>
      </div>

      <div className={styles.cardSection}>
        <div className={styles.card}>
          {renderCardTitle(`${t('signup-step1')}`, Boolean(refCode))}
          <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6'>
            {t('signup-code-button', { code: refCode })}
          </StyledButton>
          <Body className='block'>{t('signup-code-desc')}</Body>
        </div>
        <div className={styles.card}>
          {renderCardTitle(`${t('signup-step2')}`, Boolean(session && session.user))}
          {session && session.user ? (
            <>
              <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6'>
                {t('signup-twitter-button-connect')}
              </StyledButton>
              <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6' onClick={() => signOut()}>
                {t('signup-twitter-button-signout')}
              </StyledButton>
            </>
          ) : (
            <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6' onClick={() => handleTwitterAuth()}>
              {t('signup-twitter-button-disconnect')}
              <FaChevronRight />
            </StyledButton>
          )}
          <Body className='block'>{t('signup-twitter-desc')}</Body>
        </div>

        <div className={styles.card}>
          {renderCardTitle(`${t('signup-step3')}`, false)}
          <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6'>
            {t('signup-telegram-button-disconnect')}
            <FaChevronRight />
          </StyledButton>
          <Body className='block'>{t('signup-telegram-desc')}</Body>
        </div>
        <div className={styles.card}>
          {renderCardTitle(`${t('signup-step4')}`, signatureCheckPass && isConnected)}
          {signatureCheckPass && isConnected ? (
            <StyledButton size='full-width' colorTheme='theme-1' className='flex items-center gap-4 hover:gap-6'>
              {t('signup-wallet-button-connect')}
            </StyledButton>
          ) : (
            <StyledButton size='full-width' colorTheme='theme-1' onClick={handleConnectWalletButton} className='flex items-center gap-4 hover:gap-6'>
              {t('signup-wallet-button-disconnect')} <FaChevronRight />
            </StyledButton>
          )}
          <Body className='block'>{t('signup-wallet-desc')}</Body>
        </div>
      </div>
    </div>
  )
}

export default ProgressionMap
