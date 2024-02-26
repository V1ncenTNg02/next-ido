import StoryblokClient from 'storyblok-js-client'

import config from '../../configs'

const Storyblok = new StoryblokClient({
  accessToken: config.storyblokApiKey
})

const StoryblokManagement = new StoryblokClient({
  oauthToken: config.storyblokOAuthToken
})

export { Storyblok, StoryblokManagement }
