export interface DemoUserData {
  favoriteIds: string[]
  trackedDeadlineIds: string[]
  checklist: Record<string, Record<string, boolean>>
}

export interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const emptyDemoUserData: DemoUserData = {
  favoriteIds: [],
  trackedDeadlineIds: [],
  checklist: {},
}

const storageKey = 'bilimjol.demo-user-data.v1'

function isDemoUserData(value: unknown): value is DemoUserData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<DemoUserData>
  if (!Array.isArray(candidate.favoriteIds) || !candidate.favoriteIds.every(id => typeof id === 'string')) return false
  if (!Array.isArray(candidate.trackedDeadlineIds) || !candidate.trackedDeadlineIds.every(id => typeof id === 'string')) return false
  if (!candidate.checklist || typeof candidate.checklist !== 'object' || Array.isArray(candidate.checklist)) return false
  return Object.values(candidate.checklist).every(items =>
    !!items && typeof items === 'object' && !Array.isArray(items) &&
    Object.values(items).every(done => typeof done === 'boolean'),
  )
}

export function readDemoUserData(storage: StoragePort = window.localStorage): DemoUserData {
  try {
    const raw = storage.getItem(storageKey)
    if (!raw) return emptyDemoUserData
    const parsed: unknown = JSON.parse(raw)
    return isDemoUserData(parsed) ? parsed : emptyDemoUserData
  } catch {
    return emptyDemoUserData
  }
}

export function writeDemoUserData(data: DemoUserData, storage: StoragePort = window.localStorage): void {
  try {
    storage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}

function toggle(items: string[], id: string): string[] {
  return items.includes(id) ? items.filter(item => item !== id) : [...items, id]
}

export function toggleFavorite(data: DemoUserData, id: string): DemoUserData {
  return { ...data, favoriteIds: toggle(data.favoriteIds, id) }
}

export function toggleDeadline(data: DemoUserData, id: string): DemoUserData {
  return { ...data, trackedDeadlineIds: toggle(data.trackedDeadlineIds, id) }
}

export function updateChecklistItem(data: DemoUserData, id: string, document: string, done: boolean): DemoUserData {
  return {
    ...data,
    checklist: {
      ...data.checklist,
      [id]: { ...data.checklist[id], [document]: done },
    },
  }
}
