import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

import { mergeProjectData } from '../api/projects'
import Layout from '../../components/Layout/Layout'
import PoolCreationForm from '../../components/PoolCreationForm'
import config from '../../configs'
import { getGlobalData } from '../../context/GlobalData/remote'
import { sanitizeProps } from '../../helpers'
import { SBProjectProfile } from '../../storyblok/models'
import { getAllProjectsData, getStoriesInFolder } from '../../storyblok/remote'
import { ProjectDetails } from '../../templates/ProjectProfile/model'

interface Props {
  preview: boolean
  projects: ProjectDetails[]
}

const createPool: React.FC<Props> = ({ preview, projects }) => {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Next IDO | Funding</title>
      </Head>
      <PoolCreationForm projects={projects} />
    </Layout>
  )
}

export default createPool

export const getStaticProps: GetStaticProps = async context => {
  const projectData = await getAllProjectsData(context.locale)
  const projectStories = await getStoriesInFolder<SBProjectProfile>(config.projectSlug, 100)
  const projects = mergeProjectData(projectData, projectStories)

  if (!projects) {
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
      projects
    }),
    revalidate: config.revalidateISRTime
  }
}
