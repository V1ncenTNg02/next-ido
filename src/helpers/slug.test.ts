import { removePagesPath } from './slug'

describe('removePagesPath', () => {
  it('returns path with pages/ removed', () => {
    const result = removePagesPath('pages/my-page')
    expect(result).toBe('my-page')
  })
})
