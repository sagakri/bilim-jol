import { describe, expect, it } from 'vitest'
import { emptyDemoUserData, readDemoUserData, toggleDeadline, toggleFavorite, updateChecklistItem, writeDemoUserData, type StoragePort } from './demoUserData'

function memoryStorage(initial?: string): StoragePort {
  let value = initial ?? null
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next },
    read: () => value,
  } as StoragePort & { read: () => string | null }
}

describe('demo user data', () => {
  it('returns an empty state when no browser data exists', () => {
    expect(readDemoUserData(memoryStorage())).toEqual(emptyDemoUserData)
  })

  it('recovers from invalid or outdated stored JSON', () => {
    expect(readDemoUserData(memoryStorage('{oops'))).toEqual(emptyDemoUserData)
    expect(readDemoUserData(memoryStorage('{"favorites":"wrong"}'))).toEqual(emptyDemoUserData)
  })

  it('toggles favorites and tracked deadlines without duplicates', () => {
    const withFavorite = toggleFavorite(emptyDemoUserData, 'program-a')
    expect(toggleFavorite(withFavorite, 'program-a')).toEqual(emptyDemoUserData)
    expect(toggleDeadline(withFavorite, 'program-a').trackedDeadlineIds).toEqual(['program-a'])
  })

  it('tracks checklist completion per program and document', () => {
    const updated = updateChecklistItem(emptyDemoUserData, 'program-a', 'Паспорт', true)
    expect(updated.checklist).toEqual({ 'program-a': { 'Паспорт': true } })
    expect(updateChecklistItem(updated, 'program-a', 'Паспорт', false).checklist['program-a']['Паспорт']).toBe(false)
  })

  it('persists and restores user data', () => {
    const storage = memoryStorage()
    const data = { ...emptyDemoUserData, favoriteIds: ['program-a'] }
    writeDemoUserData(data, storage)
    expect(readDemoUserData(storage)).toEqual(data)
  })
})
