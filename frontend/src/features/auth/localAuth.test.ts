import { describe, expect, it } from 'vitest'
import { login, logout, readAuthState, register, updateProfile, type AuthStorage } from './localAuth'

function memoryStorage(initial: Record<string, string> = {}): AuthStorage {
  const values = new Map(Object.entries(initial))
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value) },
    removeItem: key => { values.delete(key) },
  }
}

describe('local demo authentication', () => {
  it('registers an account with normalized email and stores only a password hash', async () => {
    const storage = memoryStorage()
    const user = await register({ email: '  Student@Example.com ', displayName: 'Алия', password: 'secret-123' }, storage)

    expect(user).toMatchObject({ email: 'student@example.com', displayName: 'Алия' })
    expect(storage.getItem('bilimjol.auth.accounts.v1')).not.toContain('secret-123')
    expect(storage.getItem('bilimjol.auth.session.v1')).toBe(user.id)
    expect(readAuthState(storage).users[0]).not.toHaveProperty('passwordHash')
    expect(readAuthState(storage).users[0]).not.toHaveProperty('passwordSalt')
  })

  it('rejects invalid input and duplicate emails regardless of case', async () => {
    const storage = memoryStorage()
    await expect(register({ email: 'bad-email', displayName: 'Алия', password: 'secret-123' }, storage))
      .rejects.toThrow('Укажи корректный email')
    await expect(register({ email: 'a@example.com', displayName: 'Алия', password: 'short' }, storage))
      .rejects.toThrow('Пароль должен содержать не менее 8 символов')
    await expect(register({ email: 'a@example.com', displayName: 'Алия', password: 'x'.repeat(129) }, storage))
      .rejects.toThrow('Пароль должен содержать не более 128 символов')
    await register({ email: 'A@example.com', displayName: 'Алия', password: 'secret-123' }, storage)
    await expect(register({ email: 'a@EXAMPLE.com', displayName: 'Алия 2', password: 'other-pass' }, storage))
      .rejects.toThrow('Этот email уже зарегистрирован в этом браузере')
  })

  it('logs in with the saved password and rejects an incorrect one', async () => {
    const storage = memoryStorage()
    await register({ email: 'a@example.com', displayName: 'Алия', password: 'secret-123' }, storage)

    const user = await login('A@EXAMPLE.COM', 'secret-123', storage)
    expect(user.email).toBe('a@example.com')
    await expect(login('a@example.com', 'wrong-password', storage)).rejects.toThrow('Неверный email или пароль')
  })

  it('restores the active profile, updates it, and clears the session on logout', async () => {
    const storage = memoryStorage()
    const user = await register({ email: 'a@example.com', displayName: 'Алия', password: 'secret-123' }, storage)

    expect(readAuthState(storage).user).toMatchObject({ id: user.id, displayName: 'Алия' })
    const updated = updateProfile(user.id, { displayName: 'Алия К.' }, storage)
    expect(updated.displayName).toBe('Алия К.')
    logout(storage)
    expect(readAuthState(storage).user).toBeNull()
  })

  it('recovers from malformed or stale local storage', () => {
    expect(readAuthState(memoryStorage({ 'bilimjol.auth.accounts.v1': '{bad' })).users).toEqual([])
    expect(readAuthState(memoryStorage({ 'bilimjol.auth.session.v1': 'missing' })).user).toBeNull()
  })
})
