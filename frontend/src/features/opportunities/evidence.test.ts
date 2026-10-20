import { describe, expect, it } from 'vitest'
import { withEvidenceSources } from './evidence'

describe('withEvidenceSources', () => {
  it('keeps approved evidence text and source metadata for display', () => {
    const result = withEvidenceSources(
      ['Confirmed requirement'],
      [{ text: 'Confirmed requirement', sourceUrl: 'https://example.edu/requirements', section: 'Eligibility' }],
    )

    expect(result).toEqual([
      { text: 'Confirmed requirement', sourceUrl: 'https://example.edu/requirements', section: 'Eligibility' },
    ])
  })

  it('falls back to plain text when an older API response has no source metadata', () => {
    expect(withEvidenceSources(['Confirmed document'], [])).toEqual([
      { text: 'Confirmed document', sourceUrl: null, section: null },
    ])
  })
})
