import { t } from 'i18next'
import React from 'react'

import styles from './FooterColumn.module.css'

import Anchor from '../../Anchor/Anchor'
import { renderSocialIcon } from '../../TeamMember/TeamMember'
import { BodyBold } from '../../Typography/Typography'
import { useSettings } from '../../../context/GlobalData/hooks'

const SocialLinksColumn: React.FC = () => {
  const { socialLinks } = useSettings()

  return (
    <div className={styles.columnContainer}>
      <BodyBold className='mb-5'>{t('follow-us')}</BodyBold>
      {Object.keys(socialLinks).map(item => (
        <div key={item} className={styles.columnLinkContainer}>
          <div className='-ml-2'>{renderSocialIcon(item, socialLinks[item])}</div>
          <Anchor url={socialLinks[item] as string} title={item} className='capitalize' />
        </div>
      ))}
    </div>
  )
}

export default SocialLinksColumn
