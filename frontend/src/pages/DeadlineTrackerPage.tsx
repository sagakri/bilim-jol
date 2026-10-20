import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOpportunities } from '../api/opportunitiesApi'
import type { Opportunity } from '../features/opportunities/types'
import { useDemoUserData } from '../features/userData/DemoUserDataContext'

const formatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

function daysUntil(date: string, today: Date): number {
  const target = new Date(`${date}T00:00:00`)
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.ceil((target.getTime() - start.getTime()) / 86_400_000)
}

export function DeadlineTrackerPage() {
  const { data, toggleDeadline } = useDemoUserData()
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getOpportunities(controller.signal)
      .then(setItems)
      .catch(() => { if (!controller.signal.aborted) setFailed(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  const tracked = useMemo(() => items
    .filter(item => data.trackedDeadlineIds.includes(item.id))
    .sort((a, b) => (a.deadline ?? '9999-12-31').localeCompare(b.deadline ?? '9999-12-31')),
  [items, data.trackedDeadlineIds])

  return (
    <main className="personal-page">
      <span className="section-kicker">ПЛАНИРУЙ ВОВРЕМЯ</span>
      <h1>Мои дедлайны</h1>
      <p className="personal-intro">Следи за датами подачи и готовь документы заранее.</p>
      {loading && <div className="state-panel"><span className="loader" /> Загружаем дедлайны…</div>}
      {failed && !loading && <div className="state-panel error-panel"><strong>Не удалось загрузить каталог.</strong><span>Проверь, что API запущен, и обнови страницу.</span></div>}
      {!loading && !failed && tracked.length > 0 && (
        <div className="deadline-list">
          {tracked.map(item => {
            const remaining = item.deadline ? daysUntil(item.deadline, new Date()) : null
            return (
              <article className="deadline-card" key={item.id}>
                <div className="deadline-card-copy">
                  <span className="program-type">{item.category}</span>
                  <Link to={`/opportunities/${encodeURIComponent(item.id)}`} className="deadline-title">{item.title}</Link>
                  <span className="deadline-date">{item.deadline ? formatter.format(new Date(`${item.deadline}T12:00:00`)) : 'Срок не указан'}</span>
                </div>
                <div className={`deadline-status${remaining !== null && remaining < 0 ? ' is-expired' : ''}`}>
                  {remaining === null ? 'Дата не указана' : remaining < 0 ? `Срок прошёл ${Math.abs(remaining)} дн. назад` : remaining === 0 ? 'Дедлайн сегодня' : `Осталось ${remaining} дн.`}
                </div>
                <button className="remove-tracker" type="button" onClick={() => toggleDeadline(item.id)}>Убрать</button>
              </article>
            )
          })}
        </div>
      )}
      {!loading && !failed && tracked.length === 0 && <div className="state-panel empty-panel"><span className="empty-icon" aria-hidden="true">◷</span><strong>Дедлайны пока не добавлены</strong><span>Открой программу и нажми «Следить за дедлайном».</span><Link className="button button-primary" to="/opportunities">Открыть каталог</Link></div>}
      <p className="demo-note">Напоминания пока показываются в приложении. Уведомления и синхронизация появятся после подключения учётных записей.</p>
    </main>
  )
}
