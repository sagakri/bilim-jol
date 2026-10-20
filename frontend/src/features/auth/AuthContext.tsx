import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { login as loginLocal, logout as logoutLocal, readAuthState, register as registerLocal, updateProfile as updateLocalProfile, type AuthUser } from './localAuth'

interface AuthContextValue {
  user: AuthUser | null
  register: (input: { email: string; displayName: string; password: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (displayName: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === 'undefined' ? null : readAuthState().user,
  )

  const value = useMemo<AuthContextValue>(() => ({
    user,
    register: async input => { setUser(await registerLocal(input)) },
    login: async (email, password) => { setUser(await loginLocal(email, password)) },
    logout: () => { logoutLocal(); setUser(null) },
    updateProfile: displayName => {
      if (user) setUser(updateLocalProfile(user.id, { displayName }))
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider')
  return context
}
