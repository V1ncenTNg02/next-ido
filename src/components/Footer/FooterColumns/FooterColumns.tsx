import React from 'react'

import styles from './FooterColumns.module.css'

import FooterColumn from '../FooterColumn/FooterColumn'
import SocialLinksColumn from '../FooterColumn/SocialLinkColumn'
import { Logo } from '../../Logo/Logo'
import { StyledButton } from '../../StyledButton/StyledButton'
import { Body } from '../../Typography/Typography'
import { useSettings } from '../../../context/GlobalData/hooks'

const FooterColumns = () => {
  const { footerColumns, footerFeatures } = useSettings()

  return (
    <div className={styles.footerSectionContainer}>
      <div className={styles.featuresContainer}>
        <div className={styles.logoBox}>
          <Logo hasText className='w-1/3' />
        </div>
        <Body>{footerFeatures.newsletterText}</Body>
        <div className={styles.subscriptionContainer}>
          <input className={styles.subscriptionInput} type='text' />
          <StyledButton colorTheme='theme-1' className='w-[150px] lg:w-1/3'>
            {footerFeatures.subscriptionButtonText}
          </StyledButton>
        </div>
        <div>
          <Body>{footerFeatures.subscriptionText}</Body>
        </div>
      </div>
      {footerColumns.map((column, index) => (
        <FooterColumn key={index} {...column} />
      ))}
      <SocialLinksColumn />
    </div>
  )
}

export default FooterColumns
