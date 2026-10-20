export interface Opportunity {
  id: string
  title: string
  organization: string
  description: string
  country: string
  category: string
  field: string
  educationLevel: string
  financing: string
  deadline: string | null
  language: string
  minimumLanguageLevel?: string | null
  minimumGpa?: string | null
  minimumCourse?: number | null
  officialUrl: string
  isVerified: boolean
  isDemo: boolean
  verificationStatus: string
}

export interface OpportunityDetails extends Opportunity {
  requirements: string[]
  requiredDocuments: string[]
  requirementEvidence?: OpportunityEvidence[]
  requiredDocumentEvidence?: OpportunityEvidence[]
}

export interface OpportunityEvidence {
  text: string
  sourceUrl: string | null
  section: string | null
}

export interface OpportunityFilters {
  search?: string
  country?: string
  category?: string
  educationLevel?: string
  field?: string
  financing?: string
  language?: string
  deadlineBefore?: string
}
