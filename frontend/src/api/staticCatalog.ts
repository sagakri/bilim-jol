import type { Opportunity, OpportunityDetails } from '../features/opportunities/types'

export type StaticCatalogFetch = (input: string, init?: { signal?: AbortSignal }) => Promise<{
  ok: boolean
  json: () => Promise<unknown>
}>

export async function getStaticCatalog(url: string, fetcher: StaticCatalogFetch, signal?: AbortSignal): Promise<OpportunityDetails[]> {
  const response = await fetcher(url, { signal })
  if (!response.ok) throw new Error('Не удалось загрузить статический каталог')
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new Error('Некорректный статический каталог')
  return data as OpportunityDetails[]
}

export function findStaticOpportunity(catalog: Opportunity[], id: string): OpportunityDetails {
  const opportunity = catalog.find(item => item.id === id)
  if (!opportunity) throw new Error('Программа не найдена')
  return opportunity as OpportunityDetails
}
