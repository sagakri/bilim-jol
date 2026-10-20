import { useEffect, useMemo, useState } from 'react'
import { getOpportunities } from '../api/opportunitiesApi'
import { FilterPanel } from '../components/FilterPanel'
import { OpportunityCard } from '../components/OpportunityCard'
import { filterOpportunities } from '../features/opportunities/filterOpportunities'
import type { Opportunity, OpportunityFilters } from '../features/opportunities/types'

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filters, setFilters] = useState<OpportunityFilters>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)
    getOpportunities(controller.signal)
      .then(setOpportunities)
      .catch(() => { if (!controller.signal.aborted) setError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])

  const visible = useMemo(() => filterOpportunities(opportunities, filters), [opportunities, filters])
  const hasLiveRecords = opportunities.some(opportunity => !opportunity.isDemo)

  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-content">
          <span className="hero-eyebrow"><span className="eyebrow-dot" /> ТВОЙ МАРШРУТ НАЧИНАЕТСЯ ЗДЕСЬ</span>
          <h1>Большие возможности<br /><span>начинаются с пути.</span></h1>
          <p>Стипендии, гранты и программы для учёбы —<br className="desktop-break" /> собрали в одном месте для тебя.</p>
          <a className="hero-button" href="#catalog">Исследовать каталог <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-glow hero-orbit orbit-one" />
        <div className="hero-glow hero-orbit orbit-two" />
        <div className="hero-stat"><strong>{opportunities.length || '—'}</strong><span>возможности<br />в каталоге</span></div>
      </section>

      <main id="catalog" className="catalog-shell">
        <FilterPanel opportunities={opportunities} filters={filters} onChange={setFilters} onReset={() => setFilters({})} />
        <section className="results-section" aria-labelledby="results-title">
          <div className="results-heading">
            <div>
              <span className="section-kicker">КАТАЛОГ BILIMJOL</span>
              <h2 id="results-title">Возможности для тебя <span className="result-count">{loading ? '…' : visible.length}</span></h2>
            </div>
            <span className="sort-caption">Сначала ближайшие дедлайны <span aria-hidden="true">⌄</span></span>
          </div>
          {loading && <div className="state-panel"><span className="loader" /> Загружаем каталог…</div>}
          {error && !loading && (
            <div className="state-panel error-panel">
              <strong>Не удалось загрузить каталог.</strong>
              <span>Проверь, что API запущен, и попробуй ещё раз.</span>
              <button className="button button-primary" type="button" onClick={() => setReload(value => value + 1)}>Повторить</button>
            </div>
          )}
          {!loading && !error && visible.length > 0 && (
            <div className="opportunity-grid">{visible.map(opportunity => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div>
          )}
          {!loading && !error && visible.length === 0 && (
            <div className="state-panel empty-panel">
              <span className="empty-icon" aria-hidden="true">⌕</span>
              <strong>Ничего не нашлось</strong>
              <span>Попробуй изменить запрос или сбросить фильтры.</span>
              <button className="button button-soft" type="button" onClick={() => setFilters({})}>Сбросить фильтры</button>
            </div>
          )}
        </section>
        <section className="demo-note" id="about">
          <span className="note-icon" aria-hidden="true">i</span>
          <p>{hasLiveRecords
            ? <><strong>Источник каталога — JolTap.</strong> Статус проверки каждой записи указан отдельно; поля без подтверждённых данных оставлены пустыми.</>
            : <><strong>Это демо-версия BilimJol.</strong> Программы показаны для знакомства с интерфейсом и пока не являются проверенными предложениями.</>}</p>
        </section>
      </main>
    </>
  )
}
