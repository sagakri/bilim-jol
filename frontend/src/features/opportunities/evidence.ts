export interface OpportunityEvidence {
  text: string
  sourceUrl: string | null
  section: string | null
}

export function withEvidenceSources(
  texts: string[],
  evidence?: OpportunityEvidence[] | null,
): OpportunityEvidence[] {
  if (evidence?.length) return evidence
  return texts.map(text => ({ text, sourceUrl: null, section: null }))
}
