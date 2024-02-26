import { Project } from './model'
import { SBProject, Story } from '../../storyblok/models'

export const mapProject = (project: Story<SBProject> | null): Project => {
  if (!project) throw new Error('Failed to map null/undefined project')
  const { content } = project

  return {
    projectLogo: content.project_logo,
    projectName: content.project_name,
    projectSummary: content.project_summary,
    socialLinks: {
      website: content.website,
      twitter: content.twitter,
      telegram: content.telegram,
      discord: content.discord,
      instagram: content.telegram,
      youtube: content.youtube
    },
    whitelistAddress: content.whitelist_addresses ? JSON.parse(content.whitelist_addresses) : [],
    projectTeam: content.project_team,
    projectInfoDetails: content.project_info_details,
    tokenomics: content.tokenomics
  }
}
