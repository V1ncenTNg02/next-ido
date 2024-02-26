import { sanitizeProps } from './next-props'

describe('sanitizeProps', () => {
  it('should remove undefined values', () => {
    const result = sanitizeProps({ foo: undefined })
    expect(result.hasOwnProperty('foo')).toBe(false)
  })

  it('should not remove null', () => {
    const result = sanitizeProps({ foo: null })
    expect(result.hasOwnProperty('foo')).toBe(true)
  })

  it('should not replace defined values', () => {
    const result = sanitizeProps({ foo: 123 })
    expect(result.hasOwnProperty('foo')).toBe(true)
  })
})
