import cx from 'classnames'
import React from 'react'

import styles from './TeamMember.module.css'

import * as Model from './model'
import Anchor from '../Anchor/Anchor'
import Email from '../Anchor/Email'
import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body, BodyBold, SubTitle } from '../Typography/Typography'
import socialIconConfig from '../../configs/socialIconConfig'
import { SBSocialMediaType } from '../../storyblok/models'

interface Props extends Model.TeamMember {}

export const renderSocialIcon = (type: string, url?: string) => {
  const socialType = type as SBSocialMediaType
  const IconComponent = socialIconConfig[socialType]

  return url ? (
    socialType === 'email' ? (
      <Email email={url}>
        <IconComponent className={styles.iconStyles} />
      </Email>
    ) : (
      <Anchor url={url} target='_blank' className={styles.anchorContainer}>
        <IconComponent className={styles.iconStyles} />
      </Anchor>
    )
  ) : null
}

const TeamMember: React.FC<Props> = ({ avatarSrc, avatarAlt, name, title, description, socialMedia, withMarginBottom }) => {
  const teamMemberClassName = cx({
    [styles.teamMemberWrapper as any]: true,
    [styles.teamMemberMarginBottom as any]: withMarginBottom
  })

  return (
    <div className={teamMemberClassName}>
      <div className={styles.avatarWrapper}>
        <ResponsiveMedia src={avatarSrc} alt={avatarAlt || ' '} />
      </div>
      <div className={styles.infoWrapper}>
        <SubTitle>{name}</SubTitle>

        <div className={styles.titleWrapper}>
          <BodyBold>{title}</BodyBold>
        </div>
        <div className={styles.descriptionWrapper}>{description && <Body>{description}</Body>}</div>
        <div className={styles.socialWrapper}>
          {socialMedia.map(({ type, url }) => (
            <div key={type} className={styles.iconStyle}>
              {renderSocialIcon(type, url)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamMember
