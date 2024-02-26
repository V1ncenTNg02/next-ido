import cx from 'classnames'
import { t } from 'i18next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useNetwork } from 'wagmi'

import styles from './ProjectProfile.module.css'

import * as Model from './model'
import ComponentMapper from '../../components/ComponentMapper'
import { mapHeroPanel } from '../../components/HeroPanel/data'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import MarkdownRender from '../../components/MarkdownRender/MarkdownRender'
import SwapSection from '../../components/SwapSection/SwapSection'
import { renderSocialIcon } from '../../components/TeamMember/TeamMember'
import { SubTitle } from '../../components/Typography/Typography'
import NetworkSwitchButton from '../../components/Web3Button/NetworkSwitchButton'
import { useProjectData } from '../../context/ProjectData/hooks'
import SwapProvider from '../../context/Swap/SwapProvider'
import { getChainName, mapPoolStatus } from '../../helpers'

import cloud from '/public/images/bg/cloud.svg'

interface Props extends Model.ProjectProfile {}

const getTabs = (projectTeam?: string, tokenomics?: string, locale?: string) => {
  const tabs: string[] = []
  if (locale === 'zh') {
    tabs.push('项目详情')

    if (projectTeam) {
      tabs.push('项目团队')
    }

    if (tokenomics) {
      tabs.push('代币模型')
    }
  } else {
    tabs.push('Project Details')

    if (projectTeam) {
      tabs.push('Project Teams')
    }

    if (tokenomics) {
      tabs.push('Tokenomics')
    }
  }

  return tabs
}

const ProjectProfile: React.FC<Props> = ({ heroPanel, body }) => {
  const projectData = useProjectData()
  const { locale } = useRouter()

  const { chain } = useNetwork()
  const netId = chain?.id ?? 5

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [selectedSwap, setSelectedSwap] = useState(0)

  if (!projectData) return null

  const { projectLogo, projectName, projectSummary, projectTeam, projectInfoDetails, socialLinks, tokenomics, contracts, whitelistAddress } = projectData

  const tabs = getTabs(projectTeam, tokenomics, locale)

  const tabWrapperClassName = (currentIndex: number) =>
    cx({
      [styles.tabWrapper as any]: true,
      [styles.unactive as any]: selectedTabIndex !== currentIndex,
      [styles.active as any]: selectedTabIndex === currentIndex
    })

  const handleTabSeclection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.target.value
    const tabIndex = tabs.findIndex(tab => tab.toLowerCase() === targetValue.toLowerCase())
    setSelectedTabIndex(tabIndex < 0 ? 0 : tabIndex)
  }

  return (
    <main>
      {heroPanel.map(blok => (
        <div key={blok._uid}>
          <HeroPanel
            {...mapHeroPanel(blok)}
            logoSrc={projectLogo.filename}
            logoAlt={projectLogo.alt || ''}
            heading={projectName}
            subheading={projectSummary}
            className={styles.heroPanelContainer}
          >
            <div className={styles.iconGroupContainer}>
              {Object.keys(socialLinks).map(item => (
                <div key={item}>{socialLinks[item]?.url && <div className='mx-[5px]'>{renderSocialIcon(item, socialLinks[item]?.url)}</div>}</div>
              ))}
            </div>
          </HeroPanel>
        </div>
      ))}
      {contracts && contracts.length > 0 && (
        <div className={styles.swapSectionContainer}>
          <div className='sm:hidden'>
            <select
              id='swap'
              name='swap'
              className={styles.selectWrapper}
              onChange={e => {
                const targetValue = e.target.value
                setSelectedSwap(Number(targetValue))
              }}
            >
              {contracts.map((contract, index) => (
                <option key={index} value={index}>
                  {contract.poolName} ({mapPoolStatus(contract.poolInfo)})
                </option>
              ))}
            </select>
          </div>
          <div className='hidden sm:block'>
            <div className='border-b border-primary-400'>
              <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                {contracts.map((contract, index) => (
                  <div className='flex' key={index}>
                    <div
                      className={cx({ ['text-primary font-bold px-5']: index === selectedSwap, ['font-tektur text-subTitle cursor-pointer']: true })}
                      onClick={() => {
                        setSelectedSwap(index)
                      }}
                    >
                      {contract.poolName}
                    </div>
                    <sup>{t(`${mapPoolStatus(contract.poolInfo)}`)}</sup>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          {contracts.map((item, index) => (
            <div key={`${item.poolIndex}:${item.contract}`}>
              {index === selectedSwap && (
                <SwapProvider>
                  {item.netId === netId ? (
                    <SwapSection
                      whitelistAddress={whitelistAddress}
                      type={item.contract}
                      index={item.poolIndex}
                      name={item.poolName}
                      poolStatus={mapPoolStatus(item.poolInfo)}
                    />
                  ) : (
                    <div className='min-h-[400px] flex flex-col gap-2 items-center justify-center'>
                      <SubTitle className='text-error-400'>{t('wrong-network', { chainName: getChainName(item.netId).toUpperCase() })}</SubTitle>
                      <NetworkSwitchButton className='text-white' netId={item.netId} chainName={getChainName(item.netId) || ''} />
                    </div>
                  )}
                </SwapProvider>
              )}
            </div>
          ))}
          <Image src={cloud} alt='cloud' className='absolute top-[-75px] right-0 hidden lg:block' />
        </div>
      )}
      {tabs.length > 0 && (
        <div className='my-4 px-8 pb-4 max-w-1440 mx-auto font-tektur'>
          <div className='mb-4'>
            <div className='sm:hidden'>
              <select id='tabs' name='tabs' className={styles.selectWrapper} onChange={handleTabSeclection}>
                {tabs.map(tab => (
                  <option key={tab}>{tab}</option>
                ))}
              </select>
            </div>
            <div className='hidden sm:block'>
              <div className='border-b border-primary-400'>
                <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                  {tabs.map((tab, i) => (
                    <div key={tab} className={tabWrapperClassName(i)} onClick={() => setSelectedTabIndex(i)}>
                      {tab}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          {selectedTabIndex === 0 && <MarkdownRender renderedText={projectInfoDetails} />}
          {selectedTabIndex === 1 && projectTeam && <MarkdownRender renderedText={projectTeam} />}
          {selectedTabIndex === 2 && tokenomics && <MarkdownRender renderedText={tokenomics} />}
        </div>
      )}
      {(body ?? []).map(blok => (
        <ComponentMapper blok={blok} key={blok._uid} />
      ))}
    </main>
  )
}

export default ProjectProfile
