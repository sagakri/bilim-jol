import { useEffect, useState } from 'react'
import { getOpportunities } from '../api/opportunitiesApi'
import { OpportunityCard } from '../components/OpportunityCard'
import type { Opportunity } from '../features/opportunities/types'
import { useDemoUserData } from '../features/userData/DemoUserDataContext'

export function FavoritesPage() {
  const { data } = useDemoUserData()
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

  const favorites = items.filter(item => data.favoriteIds.includes(item.id))

  return (
    <main className="personal-page">
      <span className="section-kicker">ТВОЙ СПИСОК</span>
      <h1>Избранное</h1>
      <p className="personal-intro">Сохранённые программы останутся здесь в этом браузере.</p>
      {loading && <div className="state-panel"><span className="loader" /> Загружаем избранное…</div>}
      {failed && !loading && <div className="state-panel error-panel"><strong>Не удалось загрузить каталог.</strong><span>Проверь, что API запущен, и обнови страницу.</span></div>}
      {!loading && !failed && favorites.length > 0 && <div className="opportunity-grid">{favorites.map(item => <OpportunityCard key={item.id} opportunity={item} />)}</div>}
      {!loading && !failed && favorites.length === 0 && <div className="state-panel empty-panel"><span className="empty-icon" aria-hidden="true">♡</span><strong>Пока ничего не сохранено</strong><span>Нажми «Сохранить» на карточке программы, чтобы добавить её сюда.</span></div>}
      <p className="demo-note">Избранное хранится только в этом браузере и пока не связано с учётной записью.</p>
    </main>
  )
}
