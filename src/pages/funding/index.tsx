import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

import ComponentMapper from '../../components/ComponentMapper'
import Layout from '../../components/Layout/Layout'
import StoryblokBridge from '../../components/StoryblokBridge'
import config from '../../configs'
import { getGlobalData } from '../../context/GlobalData/remote'
import { sanitizeProps } from '../../helpers/next-props'
import { SBStandard, Story } from '../../storyblok/models'
import { getPageBySlug } from '../../storyblok/remote'

interface Props {
  story: Story<SBStandard>
  preview: boolean
}

const Funding: React.FC<Props> = ({ story, preview }) => {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Next IDO | Funding</title>
      </Head>
      {preview ? <StoryblokBridge blok={story.content} /> : <ComponentMapper blok={story.content} />}
    </Layout>
  )
}

export default Funding

export const getStaticProps: GetStaticProps = async context => {
  const story = await getPageBySlug('/funding', context.locale, context.preview)

  if (!story) {
    return {
      props: {
        notFound: true
      }
    }
  }

  return {
    props: sanitizeProps({
      globalData: await getGlobalData(context.locale),
      story,
      preview: !!context.preview
    }),
    revalidate: config.revalidateISRTime
  }
}
