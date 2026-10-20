import type { Opportunity, OpportunityFilters } from '../features/opportunities/types'

interface FilterPanelProps {
  opportunities: readonly Opportunity[]
  filters: OpportunityFilters
  onChange: (filters: OpportunityFilters) => void
  onReset: () => void
}

const filterFields = [
  ['country', 'Страна', 'Все страны'],
  ['category', 'Тип программы', 'Все типы'],
  ['educationLevel', 'Для кого', 'Любой уровень'],
  ['field', 'Направление', 'Все направления'],
  ['financing', 'Финансирование', 'Любое'],
  ['language', 'Язык', 'Любой язык'],
] as const

export function FilterPanel({ opportunities, filters, onChange, onReset }: FilterPanelProps) {
  function valuesFor(key: typeof filterFields[number][0]) {
    const values = key === 'category'
      ? opportunities.flatMap(item => item.category.split(',').map(category => category.trim()))
      : opportunities.map(item => item[key])
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ru'))
  }

  return (
    <section className="filter-panel" aria-label="Фильтры каталога">
      <div className="filter-heading">
        <div>
          <span className="section-kicker">ПО ТВОИМ УСЛОВИЯМ</span>
          <h2>Подбери возможность</h2>
        </div>
        <button className="text-button" type="button" onClick={onReset}>Сбросить</button>
      </div>
      <label className="search-field">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <span className="sr-only">Поиск по каталогу</span>
        <input
          type="search"
          placeholder="Название, страна или направление"
          value={filters.search ?? ''}
          onChange={event => onChange({ ...filters, search: event.target.value })}
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="filter-grid">
        {filterFields.map(([key, label, placeholder]) => (
          <label className="field-control" key={key}>
            <span>{label}</span>
            <select value={filters[key] ?? ''} onChange={event => onChange({ ...filters, [key]: event.target.value })}>
              <option value="">{placeholder}</option>
              {valuesFor(key).map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        ))}
        <label className="field-control">
          <span>Дедлайн до</span>
          <input
            type="date"
            value={filters.deadlineBefore ?? ''}
            onChange={event => onChange({ ...filters, deadlineBefore: event.target.value })}
          />
        </label>
      </div>
    </section>
  )
}
