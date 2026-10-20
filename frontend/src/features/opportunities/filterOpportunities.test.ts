import { describe, expect, it } from 'vitest'
import type { Opportunity } from './types'
import { filterOpportunities } from './filterOpportunities'

const opportunities: Opportunity[] = [
  {
    id: 'school',
    title: 'Демо: летняя школа по программированию',
    organization: 'BilimJol Demo Lab',
    description: 'Пример программы',
    country: 'Кыргызстан',
    category: 'Летняя школа',
    field: 'Информатика',
    educationLevel: 'Школьник',
    financing: 'Частичное',
    deadline: '2026-11-20',
    language: 'Русский',
    officialUrl: 'https://example.org/demo',
    isVerified: false,
    isDemo: true,
    verificationStatus: 'Демонстрационная запись',
  },
  {
    id: 'masters',
    title: 'Демо: стипендия на магистратуру',
    organization: 'BilimJol Demo Lab',
    description: 'Другой пример',
    country: 'Европа',
    category: 'Стипендия',
    field: 'Социальные науки',
    educationLevel: 'Магистратура',
    financing: 'Полное',
    deadline: '2027-01-15',
    language: 'Английский',
    officialUrl: 'https://example.org/demo-2',
    isVerified: false,
    isDemo: true,
    verificationStatus: 'Демонстрационная запись',
  },
]

describe('filterOpportunities', () => {
  it('returns all entries when no filter is selected', () => {
    expect(filterOpportunities(opportunities, {})).toEqual(opportunities)
  })

  it('matches search without case sensitivity across title and organization', () => {
    expect(filterOpportunities(opportunities, { search: 'ПРОГРАММИРОВАНИЮ' }).map(item => item.id)).toEqual(['school'])
    expect(filterOpportunities(opportunities, { search: 'bilimjol demo lab' })).toHaveLength(2)
  })

  it('combines country, category, education, field, financing, language and deadline filters', () => {
    const result = filterOpportunities(opportunities, {
      country: 'Кыргызстан',
      category: 'Летняя школа',
      educationLevel: 'Школьник',
      field: 'Информатика',
      financing: 'Частичное',
      language: 'Русский',
      deadlineBefore: '2026-12-01',
    })

    expect(result.map(item => item.id)).toEqual(['school'])
  })

  it('does not mutate the source list', () => {
    const originalIds = opportunities.map(item => item.id)
    filterOpportunities(opportunities, { category: 'Стипендия' })
    expect(opportunities.map(item => item.id)).toEqual(originalIds)
  })

  it('matches a selected category within a multi-category record', () => {
    const multiCategory = { ...opportunities[0], category: 'Стипендия, Грант' }
    expect(filterOpportunities([multiCategory], { category: 'Грант' })).toEqual([multiCategory])
  })
})
