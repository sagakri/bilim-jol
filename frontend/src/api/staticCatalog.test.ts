import { describe, expect, it, vi } from 'vitest'
import { findStaticOpportunity, getStaticCatalog } from './staticCatalog'
import type { OpportunityDetails } from '../features/opportunities/types'

const opportunity: OpportunityDetails = {
  id: 'demo::one',
  title: 'Демонстрационная программа',
  organization: 'BilimJol',
  description: 'Для проверки интерфейса',
  country: 'Кыргызстан',
  category: 'Стипендия',
  field: 'Общее',
  educationLevel: 'Студент',
  financing: 'Не указано',
  deadline: null,
  language: 'Не указано',
  officialUrl: 'https://example.org',
  isVerified: false,
  isDemo: true,
  verificationStatus: 'Демонстрационная запись',
  requirements: [],
  requiredDocuments: [],
}

describe('static catalog', () => {
  it('loads a catalog from the provided URL', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => [opportunity] })
    await expect(getStaticCatalog('/bilim-jol/opportunities.json', fetcher)).resolves.toEqual([opportunity])
    expect(fetcher).toHaveBeenCalledWith('/bilim-jol/opportunities.json', { signal: undefined })
  })

  it('rejects HTTP and invalid catalog responses', async () => {
    await expect(getStaticCatalog('/opportunities.json', vi.fn().mockResolvedValue({ ok: false })))
      .rejects.toThrow('Не удалось загрузить статический каталог')
    await expect(getStaticCatalog('/opportunities.json', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })))
      .rejects.toThrow('Некорректный статический каталог')
  })

  it('finds details by id and reports a missing program', () => {
    expect(findStaticOpportunity([opportunity], 'demo::one')).toEqual(opportunity)
    expect(() => findStaticOpportunity([opportunity], 'missing')).toThrow('Программа не найдена')
  })
})
