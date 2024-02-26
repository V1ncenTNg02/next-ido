import { ComponentType, WebsiteComponent } from '../../storyblok/models'

export interface Home {
  heroPanel?: WebsiteComponent[]
  body: WebsiteComponent<ComponentType>[]
}
