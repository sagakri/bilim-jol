import axios from 'axios'
import type { Opportunity, OpportunityDetails } from '../features/opportunities/types'
import { resolveApiBaseUrl } from './apiMode'
import { findStaticOpportunity, getStaticCatalog } from './staticCatalog'

const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV)
const api = apiBaseUrl ? axios.create({ baseURL: apiBaseUrl, timeout: 10000 }) : null
const staticCatalogUrl = `${import.meta.env.BASE_URL}opportunities.json`

export async function getOpportunities(signal?: AbortSignal): Promise<Opportunity[]> {
  if (!api) return getStaticCatalog(staticCatalogUrl, fetch, signal)
  const { data } = await api.get<Opportunity[]>('/opportunities', { signal })
  return data
}

export async function getOpportunity(id: string, signal?: AbortSignal): Promise<OpportunityDetails> {
  if (!api) {
    const catalog = await getStaticCatalog(staticCatalogUrl, fetch, signal)
    return findStaticOpportunity(catalog, id)
  }

  const { data } = await api.get<OpportunityDetails>(`/opportunities/${encodeURIComponent(id)}`, { signal })
  return data
}
