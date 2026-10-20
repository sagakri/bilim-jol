import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from './apiMode'

describe('resolveApiBaseUrl', () => {
  it('uses configured API in development and production', () => {
    expect(resolveApiBaseUrl('https://api.example.test', true)).toBe('https://api.example.test')
    expect(resolveApiBaseUrl('https://api.example.test', false)).toBe('https://api.example.test')
  })

  it('defaults to local API in development and static data in production', () => {
    expect(resolveApiBaseUrl(undefined, true)).toBe('http://localhost:5184/api')
    expect(resolveApiBaseUrl(undefined, false)).toBeNull()
  })

  it('treats a blank API URL as unconfigured', () => {
    expect(resolveApiBaseUrl('  ', false)).toBeNull()
  })
})
