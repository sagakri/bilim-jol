import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptyDemoUserData, readDemoUserData, toggleDeadline, toggleFavorite, updateChecklistItem, writeDemoUserData, type DemoUserData } from './demoUserData'

interface DemoUserDataContextValue {
  data: DemoUserData
  toggleFavorite: (id: string) => void
  toggleDeadline: (id: string) => void
  setChecklistItem: (id: string, document: string, done: boolean) => void
}

const DemoUserDataContext = createContext<DemoUserDataContextValue | null>(null)

export function DemoUserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoUserData>(() => {
    if (typeof window === 'undefined') return emptyDemoUserData
    return readDemoUserData()
  })

  useEffect(() => writeDemoUserData(data), [data])

  const value = useMemo<DemoUserDataContextValue>(() => ({
    data,
    toggleFavorite: id => setData(current => toggleFavorite(current, id)),
    toggleDeadline: id => setData(current => toggleDeadline(current, id)),
    setChecklistItem: (id, document, done) => setData(current => updateChecklistItem(current, id, document, done)),
  }), [data])

  return <DemoUserDataContext.Provider value={value}>{children}</DemoUserDataContext.Provider>
}

export function useDemoUserData(): DemoUserDataContextValue {
  const context = useContext(DemoUserDataContext)
  if (!context) throw new Error('useDemoUserData должен использоваться внутри DemoUserDataProvider')
  return context
}
