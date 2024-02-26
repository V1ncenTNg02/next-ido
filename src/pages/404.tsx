import { t } from 'i18next'
import { NextPage } from 'next'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import styles from './errorPage.module.css'

import Layout from '../components/Layout/Layout'
import { StyledButton } from '../components/StyledButton/StyledButton'
import { Body, SubHeader } from '../components/Typography/Typography'
import config from '../configs'
import GlobalDataProvider from '../context/GlobalData/GlobalDataProvider'
import { GlobalData } from '../context/GlobalData/model'
import { getGlobalData } from '../context/GlobalData/remote'
import { sanitizeProps } from '../helpers'

interface Props {
  globalData: GlobalData
  preview: boolean
}

const Custom404: NextPage<Props> = ({ globalData }) => {
  return (
    <GlobalDataProvider globalData={globalData}>
      <Layout preview={false}>
        <Head>
          <title>Next IDO | Page Not Found</title>
        </Head>
        <main className={styles.container}>
          <SubHeader className='text-primary'>{t('404')}</SubHeader>
          <Link href='/' passHref>
            <StyledButton className='w-[150px]' colorTheme='theme-2' size='small'>
              <Body className='text-primary'>{t('home-button')}</Body>
            </StyledButton>
          </Link>
        </main>
      </Layout>
    </GlobalDataProvider>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  const globalData = await getGlobalData(context.locale)

  return {
    props: sanitizeProps({
      globalData,
      preview: !!context.preview
    }),
    revalidate: config.revalidateISRTime
  }
}

export default Custom404
