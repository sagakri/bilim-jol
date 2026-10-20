import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (isRegister) await register({ email, displayName, password })
      else await login(email, password)
      navigate('/profile', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось выполнить действие. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <span className="section-kicker">АККАУНТ BILIMJOL</span>
        <h1 id="auth-title">{isRegister ? 'Создать аккаунт' : 'С возвращением'}</h1>
        <p className="auth-intro">{isRegister ? 'Сохрани свой образовательный маршрут в одном месте.' : 'Войди в демо-профиль BilimJol.'}</p>
        <div className="auth-demo-notice" role="note">
          Демо-режим: аккаунт хранится только в этом браузере. Не используй настоящий пароль от почты или других сервисов.
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && <label>Имя
            <input autoComplete="name" maxLength={80} minLength={2} onChange={event => setDisplayName(event.target.value)} required value={displayName} />
          </label>}
          <label>Email
            <input autoComplete="email" onChange={event => setEmail(event.target.value)} required type="email" value={email} />
          </label>
          <label>Пароль
            <input autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} onChange={event => setPassword(event.target.value)} required type="password" value={password} />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Подожди…' : isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
        <p className="auth-switch">{isRegister ? 'Уже есть аккаунт?' : 'Впервые здесь?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Войти' : 'Создать аккаунт'}</Link>
        </p>
      </section>
    </main>
  )
}
