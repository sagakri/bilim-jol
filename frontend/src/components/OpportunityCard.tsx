import { Link } from 'react-router-dom'
import type { Opportunity } from '../features/opportunities/types'
import { useDemoUserData } from '../features/userData/DemoUserDataContext'

interface OpportunityCardProps {
  opportunity: Opportunity
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { data, toggleFavorite } = useDemoUserData()
  const saved = data.favoriteIds.includes(opportunity.id)
  const deadline = opportunity.deadline
    ? dateFormatter.format(new Date(`${opportunity.deadline}T12:00:00`))
    : 'Срок не указан'

  return (
    <article className="opportunity-card">
      <div className="card-topline">
        <span className="program-type">{opportunity.category}</span>
        {opportunity.isDemo && <span className="demo-pill">Пример</span>}
        {!opportunity.isDemo && !opportunity.isVerified && <span className="review-pill">{opportunity.verificationStatus}</span>}
      </div>
      <Link className="card-title" to={`/opportunities/${encodeURIComponent(opportunity.id)}`}>
        {opportunity.title}
      </Link>
      <p className="card-organization">{opportunity.organization}</p>
      <div className="card-tags">
        <span><span aria-hidden="true">⌖</span> {opportunity.country}</span>
        <span><span aria-hidden="true">◉</span> {opportunity.educationLevel}</span>
      </div>
      <div className="card-meta">
        <div>
          <span className="meta-label">Финансирование</span>
          <span className="meta-value funding-value">{opportunity.financing}</span>
        </div>
        <div>
          <span className="meta-label">Дедлайн</span>
          <span className="meta-value">{deadline}</span>
        </div>
      </div>
      <div className="card-actions">
        <Link className="button button-primary" to={`/opportunities/${encodeURIComponent(opportunity.id)}`}>
          Подробнее <span aria-hidden="true">↗</span>
        </Link>
        <button
          className={`save-button${saved ? ' is-saved' : ''}`}
          type="button"
          aria-pressed={saved}
          onClick={() => toggleFavorite(opportunity.id)}
        >
          <span aria-hidden="true">{saved ? '♥' : '♡'}</span> {saved ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>
    </article>
  )
}
