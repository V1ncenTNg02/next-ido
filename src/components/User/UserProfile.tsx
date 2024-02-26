import { User } from '@prisma/client'
import { t } from 'i18next'
import Image from 'next/image'
import React from 'react'

import styles from './UserProfile.module.css'

import ResponsiveMedia from '../ResponsiveMedia/ResponsiveMedia'
import { Body, HeaderBold, SubBody, SubTitle } from '../Typography/Typography'
import { useSignature } from '../../context/Signature/hooks'

const iconArray = ['/userIcon.png', '/vector.svg', '/userGroup1.png', '/vector.svg', '/userGroup2.png']

const RenderStageDisplay = () => {
  const contentKey = ['player', 'team', 'global']

  return (
    <div className={styles.stageDisplayWrapper}>
      <div className={styles.iconImageContainer}>
        {iconArray.map((src, index) => (
          <div key={index} className={index % 2 === 1 ? 'col-span-1' : 'col-span-2'}>
            {index % 2 === 1 ? (
              <div className={styles.vectorContainer}>
                <Image src={src} alt='vector' width={17} height={33} />
              </div>
            ) : (
              <div className='flex items-center justify-center flex-col'>
                <div className={styles.hexagonImageContainer}>
                  <Image src={src} alt='icon' width={75} height={75} />
                </div>
                <div className={styles.stepDescriptionWrapper}>
                  <SubTitle className='text-center lg:text-left'>{t(`user-${contentKey[index / 2]}-title`)}</SubTitle>
                  <SubBody className='text-center lg:text-left'>{t(`user-${contentKey[index / 2]}-content`)}</SubBody>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  orderedUserInfo: User[]
}

const UserProfile: React.FC<Props> = ({ orderedUserInfo }) => {
  const { user } = useSignature()

  if (!user) return null

  const currentUserIndex = orderedUserInfo.findIndex(u => u.etherAddress === user.etherAddress)
  const currentUserRank = currentUserIndex >= 0 ? String(currentUserIndex + 1) : '50+'
  const currentUserScore = orderedUserInfo.find(u => u.etherAddress === user.etherAddress)?.score

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userInfoWrapper}></div>
      <div className={styles.userSection}>
        <div className={styles.userSectionLeft}>
          <div>
            <div className='flex mb-5'>
              <div className='mx-3'>
                <ResponsiveMedia src={user.twitterAvatar} alt='twitter avatar' objectFit='contain' className={styles.twitterAvatar} />
              </div>
              <div className='flex justify-center items-center'>
                <HeaderBold className={styles.usernameText}>{user.twitter}</HeaderBold>
              </div>
            </div>
            <Body>{t('user-profile-intro', { username: user.twitter })}</Body>
          </div>
          <div className={styles.userPointsContainer}>
            <div className={styles.pointsCol}>
              <div className='flex items-center justify-center flex-col border-r-2'>
                <Body>{t('user-ranking')}</Body>
                <HeaderBold className={styles.usernameText}>#{currentUserRank}</HeaderBold>
              </div>
              <div className='flex items-center justify-center flex-col'>
                <Body>{t('user-score')}</Body>
                <HeaderBold className={styles.usernameText}>{currentUserScore}</HeaderBold>
              </div>
            </div>
          </div>
          <div className={styles.userPointsContainer}>
            <SubBody>{t('user-profile-content', { username: user.twitter })}</SubBody>
          </div>
        </div>

        <div className={styles.userSectionRight}>
          <RenderStageDisplay />
        </div>
      </div>
    </div>
  )
}

export default UserProfile
