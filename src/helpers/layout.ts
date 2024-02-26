import { SBLayoutType } from '../storyblok/models'

export const isCentreLayout = (layout?: SBLayoutType): boolean => layout === 'center'

export const isLeftLayout = (layout?: SBLayoutType): boolean => layout === 'left'

export const isRightLayout = (layout?: SBLayoutType): boolean => layout === 'right'
