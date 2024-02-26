import { ComponentType, WebsiteComponent } from '../../storyblok/models'

export interface Standard {
  heroPanel?: WebsiteComponent[]
  body?: WebsiteComponent<ComponentType>[]
}
