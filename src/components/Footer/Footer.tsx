import React from 'react'

import styles from './Footer.module.css'

import FooterColumns from './FooterColumns/FooterColumns'
import Anchor from '../Anchor/Anchor'
import NavItem from '../Navigation/NavItem/NavItem'
import config from '../../configs'
import { useSettings } from '../../context/GlobalData/hooks'
import { useSignature } from '../../context/Signature/hooks'

const Footer = () => {
  const { user } = useSignature()

  const { copyright, legalLinks } = useSettings()
  return (
    <footer className={styles.footerContainer}>
      <div className='max-w-1440 mx-auto'>
        <FooterColumns />
        <div className={styles.splitLine}></div>
        <div className={styles.footerBottomContainer}>
          <div className={styles.copyRightContainer}>{copyright}</div>
          <ul className={styles.legalLinksContainer}>
            {legalLinks.map(item => (
              <NavItem {...item} key={item.id} className={styles.policy} />
            ))}
            {user && config.admins.find(item => item.toLowerCase() === user.etherAddress.toLowerCase()) && (
              <Anchor url='/createPool' className={styles.policy} title='Create Pool' />
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
