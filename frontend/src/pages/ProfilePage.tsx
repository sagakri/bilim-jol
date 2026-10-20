import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [message, setMessage] = useState('')

  if (!user) return <Navigate to="/login" replace />

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      updateProfile(displayName)
      setMessage('Имя профиля обновлено.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Не удалось сохранить профиль.')
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card profile-card" aria-labelledby="profile-title">
        <span className="section-kicker">ТВОЙ МАРШРУТ</span>
        <h1 id="profile-title">Мой профиль</h1>
        <div className="profile-email"><span className="profile-avatar" aria-hidden="true">{user.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{user.displayName}</strong><span>{user.email}</span></div></div>
        <form className="auth-form" onSubmit={saveProfile}>
          <label>Имя в профиле
            <input autoComplete="name" maxLength={80} minLength={2} onChange={event => setDisplayName(event.target.value)} required value={displayName} />
          </label>
          {message && <p className="profile-message" role="status">{message}</p>}
          <button className="button button-primary auth-submit" type="submit">Сохранить изменения</button>
        </form>
        <div className="profile-links">
          <Link className="button button-soft" to="/favorites">Моё избранное</Link>
          <Link className="button button-soft" to="/dashboard/deadlines">Мои дедлайны</Link>
        </div>
        <p className="profile-demo-note">Это локальный демо-профиль. Выйдя из этого браузера или очистив его данные, ты потеряешь доступ к аккаунту.</p>
        <button className="text-button profile-logout" onClick={logout} type="button">Выйти из аккаунта</button>
      </section>
    </main>
  )
}
