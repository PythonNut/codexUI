import type { WebSearchData } from '../types/codex'

export function areWebSearchDataEqual(first?: WebSearchData, second?: WebSearchData): boolean {
  if (!first && !second) return true
  if (!first || !second) return false
  return (
    first.status === second.status &&
    first.query === second.query &&
    areWebSearchActionsEqual(first.action, second.action)
  )
}

export function buildWebSearchSummaryLines(webSearch: WebSearchData | null | undefined): string[] {
  if (!webSearch) return []
  const action = webSearch.action
  if (!action) {
    return webSearch.query.length > 0 ? [webSearch.query] : ['Web search']
  }

  if (action.type === 'search') {
    const query = action.query?.trim() || webSearch.query
    if (action.queries && action.queries.length > 0) {
      return action.queries
    }
    return [query || webSearch.query || 'search query']
  }

  if (action.type === 'openPage') {
    return [`Open page: ${action.url || webSearch.query || 'target page'}`]
  }

  if (action.type === 'findInPage') {
    const target = action.url || webSearch.query || 'target page'
    const pattern = action.pattern ? ` for "${action.pattern}"` : ''
    return [`Find${pattern} in ${target}`]
  }

  return ['Other web action']
}

export function webSearchStatusLabel(status: WebSearchData['status']): 'Searching' | 'Completed' {
  return status === 'inProgress' ? 'Searching' : 'Completed'
}

function areWebSearchActionsEqual(
  first: WebSearchData['action'] | null | undefined,
  second: WebSearchData['action'] | null | undefined,
): boolean {
  if (!first && !second) return true
  if (!first || !second) return false
  if (first.type === 'search' && second.type === 'search') {
    const firstQueries = first.queries ?? []
    const secondQueries = second.queries ?? []
    if (first.query !== second.query) return false
    if (firstQueries.length !== secondQueries.length) return false
    return firstQueries.every((entry, index) => entry === secondQueries[index])
  }
  if (first.type === 'openPage' && second.type === 'openPage') {
    return first.url === second.url
  }
  if (first.type === 'findInPage' && second.type === 'findInPage') {
    return first.url === second.url && first.pattern === second.pattern
  }
  if (first.type !== second.type) return false
  return true
}
