import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOpportunity } from '../api/opportunitiesApi'
import type { OpportunityDetails } from '../features/opportunities/types'
import { useDemoUserData } from '../features/userData/DemoUserDataContext'
import { withEvidenceSources } from '../features/opportunities/evidence'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export function OpportunityDetailsPage() {
  const { id = '' } = useParams()
  const { data, toggleDeadline, setChecklistItem } = useDemoUserData()
  const [opportunity, setOpportunity] = useState<OpportunityDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setFailed(false)
    getOpportunity(id, controller.signal)
      .then(setOpportunity)
      .catch(() => { if (!controller.signal.aborted) setFailed(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id])

  if (loading) return <main className="details-shell"><div className="state-panel"><span className="loader" /> Загружаем программу…</div></main>
  if (failed || !opportunity) return (
    <main className="details-shell">
      <Link className="back-link" to="/opportunities">← К каталогу</Link>
      <div className="state-panel error-panel"><strong>Не удалось открыть программу.</strong><span>Запись не найдена или API недоступен.</span></div>
    </main>
  )

  const requirements = withEvidenceSources(opportunity.requirements, opportunity.requirementEvidence)
  const requiredDocuments = withEvidenceSources(opportunity.requiredDocuments, opportunity.requiredDocumentEvidence)

  return (
    <main className="details-shell">
      <Link className="back-link" to="/opportunities">← Все возможности</Link>
      <article className="details-card">
        <div className="details-topline">
          <span className="program-type">{opportunity.category}</span>
          {opportunity.isDemo && <span className="demo-pill">Демонстрационная запись</span>}
          {opportunity.isVerified && <span className="verified-pill">Проверено</span>}
          {!opportunity.isDemo && !opportunity.isVerified && <span className="review-pill">{opportunity.verificationStatus}</span>}
        </div>
        <h1>{opportunity.title}</h1>
        <p className="details-organization">{opportunity.organization} <span>·</span> {opportunity.country}</p>
        <p className="details-description">{opportunity.description}</p>
        <div className="details-facts">
          <div><span>Финансирование</span><strong>{opportunity.financing}</strong></div>
          <div><span>Дедлайн</span><strong>{opportunity.deadline ? dateFormatter.format(new Date(`${opportunity.deadline}T12:00:00`)) : 'Не указан'}</strong></div>
          <div><span>Уровень</span><strong>{opportunity.educationLevel}</strong></div>
          <div><span>Направление</span><strong>{opportunity.field}</strong></div>
          <div><span>Язык</span><strong>{opportunity.language}{opportunity.minimumLanguageLevel ? ` · ${opportunity.minimumLanguageLevel}` : ''}</strong></div>
          {opportunity.minimumCourse && <div><span>Минимальный курс</span><strong>{opportunity.minimumCourse}</strong></div>}
          {opportunity.minimumGpa && <div><span>Минимальный GPA</span><strong>{opportunity.minimumGpa}</strong></div>}
        </div>
        <div className="personal-actions">
          <button className={`button ${data.trackedDeadlineIds.includes(opportunity.id) ? 'button-soft' : 'button-primary'}`} type="button" aria-pressed={data.trackedDeadlineIds.includes(opportunity.id)} onClick={() => toggleDeadline(opportunity.id)}>
            {data.trackedDeadlineIds.includes(opportunity.id) ? 'Не следить за дедлайном' : 'Следить за дедлайном'}
          </button>
          <Link className="button button-soft" to="/dashboard/deadlines">Мои дедлайны</Link>
        </div>
        <div className="details-columns">
          <section>
            <h2>Требования</h2>
            {requirements.length > 0
              ? <ul>{requirements.map((item, index) => <li key={`${item.text}-${index}`}>
                  {item.text}{item.sourceUrl && <EvidenceSourceLink item={item} type="требования" />}
                </li>)}</ul>
              : <p className="unavailable-copy">Подтверждённые требования пока не указаны.</p>}
          </section>
          <section>
            <h2>Необходимые документы</h2>
            {requiredDocuments.length > 0 ? <ul className="document-list">{requiredDocuments.map((item, index) => {
              const checked = Boolean(data.checklist[opportunity.id]?.[item.text])
              return <li key={`${item.text}-${index}`}>
                <label className="document-check-row"><input type="checkbox" checked={checked} onChange={event => setChecklistItem(opportunity.id, item.text, event.target.checked)} /><span>{item.text}</span></label>
                {item.sourceUrl && <EvidenceSourceLink item={item} type="документа" />}
              </li>
            })}</ul> : <p className="unavailable-copy">Подтверждённый список документов пока не указан.</p>}
            {requiredDocuments.length > 0 && <p className="checklist-caption">Отмечай документы, которые уже подготовил. Список сохраняется в этом браузере.</p>}
          </section>
        </div>
        {opportunity.officialUrl && <a className="button button-primary official-link" href={opportunity.officialUrl} target="_blank" rel="noreferrer">
          Открыть официальный источник <span aria-hidden="true">↗</span>
        </a>}
        <p className="source-caption">Статус проверки показывает состояние записи в базе. Перед подачей сверяй актуальные условия по официальному источнику.</p>
      </article>
    </main>
  )
}

function EvidenceSourceLink({ item, type }: { item: { sourceUrl: string | null; section: string | null }; type: string }) {
  if (!item.sourceUrl) return null
  const label = item.section ? `Источник: ${item.section}` : 'Официальный источник'
  return <a className="evidence-source" href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Источник ${type}: ${label}`}>
    {label} ↗
  </a>
}
