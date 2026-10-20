export interface AuthUser {
  id: string
  email: string
  displayName: string
  createdAt: string
}

interface StoredUser extends AuthUser {
  passwordSalt: string
  passwordHash: string
}

export interface AuthStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface AuthState {
  users: AuthUser[]
  user: AuthUser | null
}

const accountsKey = 'bilimjol.auth.accounts.v1'
const sessionKey = 'bilimjol.auth.session.v1'
const passwordIterations = 310_000
const encoder = new TextEncoder()

function browserStorage(): AuthStorage {
  return window.localStorage
}

function isStoredUser(value: unknown): value is StoredUser {
  if (!value || typeof value !== 'object') return false
  const user = value as Partial<StoredUser>
  return typeof user.id === 'string' && typeof user.email === 'string' &&
    typeof user.displayName === 'string' && typeof user.createdAt === 'string' &&
    typeof user.passwordSalt === 'string' && typeof user.passwordHash === 'string'
}

function readUsers(storage: AuthStorage): StoredUser[] {
  try {
    const raw = storage.getItem(accountsKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isStoredUser) ? parsed : []
  } catch {
    return []
  }
}

function toPublicUser({ passwordSalt: _salt, passwordHash: _hash, ...user }: StoredUser): AuthUser {
  return user
}

function encodeHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

function decodeHex(value: string): Uint8Array {
  if (value.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(value)) return new Uint8Array()
  return Uint8Array.from(value.match(/.{2}/g) ?? [], byte => Number.parseInt(byte, 16))
}

async function hashPassword(password: string, salt: Uint8Array, cryptoApi: Crypto): Promise<string> {
  const key = await cryptoApi.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBuffer = Uint8Array.from(salt).buffer as ArrayBuffer
  const bits = await cryptoApi.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBuffer, iterations: passwordIterations }, key, 256)
  return encodeHex(new Uint8Array(bits))
}

export function readAuthState(storage: AuthStorage = browserStorage()): AuthState {
  const users = readUsers(storage)
  const publicUsers = users.map(toPublicUser)
  try {
    const activeId = storage.getItem(sessionKey)
    const activeUser = users.find(user => user.id === activeId)
    return { users: publicUsers, user: activeUser ? toPublicUser(activeUser) : null }
  } catch {
    return { users: publicUsers, user: null }
  }
}

export async function register(
  input: { email: string; displayName: string; password: string },
  storage: AuthStorage = browserStorage(),
  cryptoApi: Crypto = crypto,
): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase()
  const displayName = input.displayName.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Укажи корректный email')
  if (displayName.length < 2 || displayName.length > 80) throw new Error('Имя должно содержать от 2 до 80 символов')
  if (input.password.length < 8) throw new Error('Пароль должен содержать не менее 8 символов')
  if (input.password.length > 128) throw new Error('Пароль должен содержать не более 128 символов')

  const users = readUsers(storage)
  if (users.some(user => user.email === email)) throw new Error('Этот email уже зарегистрирован в этом браузере')

  const salt = cryptoApi.getRandomValues(new Uint8Array(16))
  const user: StoredUser = {
    id: cryptoApi.randomUUID(),
    email,
    displayName,
    createdAt: new Date().toISOString(),
    passwordSalt: encodeHex(salt),
    passwordHash: await hashPassword(input.password, salt, cryptoApi),
  }
  storage.setItem(accountsKey, JSON.stringify([...users, user]))
  storage.setItem(sessionKey, user.id)
  return toPublicUser(user)
}

export async function login(
  emailInput: string,
  password: string,
  storage: AuthStorage = browserStorage(),
  cryptoApi: Crypto = crypto,
): Promise<AuthUser> {
  const email = emailInput.trim().toLowerCase()
  const storedUser = readUsers(storage).find(user => user.email === email)
  const salt = storedUser ? decodeHex(storedUser.passwordSalt) : new Uint8Array(16)
  const candidateHash = await hashPassword(password, salt, cryptoApi)
  if (!storedUser || candidateHash !== storedUser.passwordHash) throw new Error('Неверный email или пароль')
  storage.setItem(sessionKey, storedUser.id)
  return toPublicUser(storedUser)
}

export function logout(storage: AuthStorage = browserStorage()): void {
  storage.removeItem(sessionKey)
}

export function updateProfile(
  userId: string,
  updates: { displayName: string },
  storage: AuthStorage = browserStorage(),
): AuthUser {
  const displayName = updates.displayName.trim()
  if (displayName.length < 2 || displayName.length > 80) throw new Error('Имя должно содержать от 2 до 80 символов')
  const users = readUsers(storage)
  const index = users.findIndex(user => user.id === userId)
  if (index < 0) throw new Error('Аккаунт не найден в этом браузере')
  const updated = { ...users[index], displayName }
  users[index] = updated
  storage.setItem(accountsKey, JSON.stringify(users))
  return toPublicUser(updated)
}
