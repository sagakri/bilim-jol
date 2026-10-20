import type { Opportunity, OpportunityFilters } from './types'

function matches(value: string | null | undefined, expected: string | undefined): boolean {
  return !expected || value?.toLocaleLowerCase('ru-RU') === expected.toLocaleLowerCase('ru-RU')
}

export function filterOpportunities(
  opportunities: readonly Opportunity[],
  filters: OpportunityFilters,
): Opportunity[] {
  const search = filters.search?.trim().toLocaleLowerCase('ru-RU')

  return opportunities.filter(opportunity => {
    const searchMatches = !search || [
      opportunity.title,
      opportunity.organization,
      opportunity.description,
      opportunity.country,
      opportunity.category,
      opportunity.field,
    ].some(value => value.toLocaleLowerCase('ru-RU').includes(search))

    const deadlineMatches = !filters.deadlineBefore || Boolean(
      opportunity.deadline && opportunity.deadline <= filters.deadlineBefore,
    )

    return searchMatches
      && matches(opportunity.country, filters.country)
      && (!filters.category || opportunity.category.split(',').some(category => matches(category.trim(), filters.category)))
      && matches(opportunity.educationLevel, filters.educationLevel)
      && matches(opportunity.field, filters.field)
      && matches(opportunity.financing, filters.financing)
      && matches(opportunity.language, filters.language)
      && deadlineMatches
  })
}
