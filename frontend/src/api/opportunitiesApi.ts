import axios from 'axios'
import type { Opportunity, OpportunityDetails } from '../features/opportunities/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5184/api',
  timeout: 10000,
})

export async function getOpportunities(signal?: AbortSignal): Promise<Opportunity[]> {
  const { data } = await api.get<Opportunity[]>('/opportunities', { signal })
  return data
}

export async function getOpportunity(id: string, signal?: AbortSignal): Promise<OpportunityDetails> {
  const { data } = await api.get<OpportunityDetails>(`/opportunities/${encodeURIComponent(id)}`, { signal })
  return data
}
