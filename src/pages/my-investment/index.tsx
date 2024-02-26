import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

import { mergeProjectData } from '../api/projects'
import ComponentMapper from '../../components/ComponentMapper'
import Investments from '../../components/Investments'
import Layout from '../../components/Layout/Layout'
import StoryblokBridge from '../../components/StoryblokBridge'
import config from '../../configs'
import { getGlobalData } from '../../context/GlobalData/remote'
import { sanitizeProps } from '../../helpers'
import { getAllProjects } from '../../models/project'
import { Contract } from '../../models/types'
import { SBProjectProfile } from '../../storyblok/models'
import { SBStandard, Story } from '../../storyblok/models'
import { getAllProjectsData, getPageBySlug, getStoriesInFolder } from '../../storyblok/remote'

interface Props {
  story: Story<SBStandard>
  preview: boolean
  contracts: Contract[]
}
const MyInvestment: React.FC<Props> = ({ story, preview, contracts }) => {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Next IDO | My Investment</title>
      </Head>
      <Investments contracts={contracts} />
      {preview ? <StoryblokBridge blok={story.content} /> : <ComponentMapper blok={story.content} />}
    </Layout>
  )
}

export default MyInvestment

export const getStaticProps: GetStaticProps = async context => {
  const story = await getPageBySlug('/my-investment', context.locale, context.preview)
  const projectData = await getAllProjectsData(context.locale)
  const projectStories = await getStoriesInFolder<SBProjectProfile>(config.projectSlug, 100)
  const projects = mergeProjectData(projectData, projectStories)

  const contracts = await getAllProjects()

  if (!projects || !story) {
    return {
      props: {
        notFound: true
      }
    }
  }

  return {
    props: sanitizeProps({
      globalData: await getGlobalData(context.locale),
      preview: !!context.preview,
      projects,
      contracts,
      story
    }),
    revalidate: config.revalidateISRTime
  }
}
