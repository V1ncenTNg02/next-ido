import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

import ComponentMapper from '../../components/ComponentMapper'
import Layout from '../../components/Layout/Layout'
import StoryblokBridge from '../../components/StoryblokBridge'
import config from '../../configs'
import { getGlobalData } from '../../context/GlobalData/remote'
import { ProjectDataContext } from '../../context/ProjectData/context'
import { mapProject } from '../../context/ProjectData/data'
import { Project } from '../../context/ProjectData/model'
import { sanitizeProps } from '../../helpers'
import { Contract } from '../../models/types'
import { getAllProjects } from '../../services/project'
import { getDynamicPageIds } from '../../storyblok/helpers'
import { Story, Template } from '../../storyblok/models'
import { getAllProjectsData, getPageBySlug } from '../../storyblok/remote'

interface Props {
  story: Story<Template>
  preview: boolean
  projectData: Project
  contracts: Contract[]
}

const ProjectPage: React.FC<Props> = ({ preview, story, projectData, contracts }) => {
  const integratedProjectData = { ...projectData, contracts }
  return (
    <Layout preview={preview}>
      <Head>
        <title>{`Next IDO | ${story.name}`}</title>
      </Head>
      <ProjectDataContext.Provider value={integratedProjectData}>
        {preview ? <StoryblokBridge blok={story.content} /> : <ComponentMapper blok={story.content} />}
      </ProjectDataContext.Provider>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async context => {
  if (!context.params?.id) throw new Error('Missing id')
  const id = context.params?.id as string

  const sanitizedPath = `projects/${id}`

  const story = await getPageBySlug(sanitizedPath, context.locale, context.preview)
  const allProjectData = await getAllProjectsData(context.locale)
  const projectSlug = id ?? ''
  const projectDataStory = allProjectData.find(p => p.slug === projectSlug)

  const contracts = await getAllProjects(id)

  if (!story || !projectDataStory) {
    return {
      notFound: true
    }
  }

  return {
    props: sanitizeProps({
      globalData: await getGlobalData(context.locale),
      projectData: mapProject(projectDataStory),
      story,
      contracts,
      preview: !!context.preview
    }),
    revalidate: config.revalidateISRTime
  }
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await getDynamicPageIds(config.projectSlug),
  fallback: 'blocking'
})

export default ProjectPage
