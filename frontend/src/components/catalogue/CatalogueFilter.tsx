import { useState, useMemo } from 'react'
import type { Dataset } from '../../utils/types'
import { filterDatasets, emptyFilters, type FilterState } from '../../utils/filterDatasets'
import { DatasetGrid } from './DatasetGrid'

interface Props {
  datasets: Dataset[]
  base: string
}

type FilterKey = keyof FilterState
type SortKey = 'default' | 'az' | 'za' | 'status'
type ViewMode = 'card' | 'list'

const FILTER_LABELS: Record<FilterKey, string> = {
  country:          'Country',
  living_landscape: 'Living Landscape',
  mfl_theme:        'Theme',
  readiness_status: 'Readiness Status',
  data_type:        'Data Type',
  access_level:     'Access Level',
  license:          'License',
}

const VISIBLE_FILTERS: FilterKey[] = ['country', 'living_landscape', 'mfl_theme', 'readiness_status', 'data_type', 'access_level']

function getOptions(datasets: Dataset[], key: FilterKey): string[] {
  const values = datasets.map((d) => d[key] as string).filter(Boolean)
  return [...new Set(values)].sort()
}

function sortDatasets(datasets: Dataset[], sort: SortKey): Dataset[] {
  const sorted = [...datasets]
  if (sort === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === 'za') sorted.sort((a, b) => b.title.localeCompare(a.title))
  else if (sort === 'status') {
    const order = ['Analytics-ready', 'Validated', 'Accepted', 'Under review', 'Registered only']
    sorted.sort((a, b) => order.indexOf(a.readiness_status) - order.indexOf(b.readiness_status))
  }
  return sorted
}

export function CatalogueFilter({ datasets, base }: Props) {
  // Initialise from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const initial = emptyFilters()
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const landscape = params.get('landscape')
      if (landscape) initial.living_landscape = [landscape]
      const country = params.get('country')
      if (country) initial.country = [country]
      const theme = params.get('theme')
      if (theme) initial.mfl_theme = [theme]
      const status = params.get('status')
      if (status) initial.readiness_status = [status]
    }
    return initial
  })

  const [searchText, setSearchText] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<FilterKey>>(new Set())

  // Filtered + searched + sorted datasets
  const filtered = useMemo(() => {
    let result = filterDatasets(datasets, filters)
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.source?.toLowerCase().includes(q) ||
        d.mfl_theme.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
      )
    }
    return sortDatasets(result, sortKey)
  }, [datasets, filters, searchText, sortKey])

  // Active filter chips
  const activeChips = useMemo(() =>
    Object.entries(filters).flatMap(([key, values]) =>
      (values as string[]).map((value) => ({ key: key as FilterKey, value }))
    ), [filters]
  )

  function toggle(key: FilterKey, value: string) {
    setFilters((prev) => {
      const current = prev[key] as string[]
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      }
    })
  }

  function removeChip(key: FilterKey, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((v) => v !== value),
    }))
  }

  function clearAll() {
    setFilters(emptyFilters())
    setSearchText('')
  }

  function toggleSection(key: FilterKey) {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const hasActiveFilters = activeChips.length > 0 || searchText.trim().length > 0

  return (
    <div className="catalogue-layout">
      {/* ── Filter panel ─────────────────────────────────── */}
      <aside className="filter-panel">
        {/* Mobile toggle */}
        <button
          className="filter-mobile-toggle"
          onClick={() => setMobileFiltersOpen((o) => !o)}
          aria-expanded={mobileFiltersOpen}
          aria-controls="filter-panel-body"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          {mobileFiltersOpen ? 'Hide filters' : 'Show filters'}
          {activeChips.length > 0 && (
            <span style={{ background: '#C89B3C', color: '#fff', borderRadius: '9999px', fontSize: '0.7rem', padding: '0 0.4rem', fontWeight: 700 }}>
              {activeChips.length}
            </span>
          )}
        </button>

        <div className={`filter-panel-collapsible${mobileFiltersOpen ? ' open' : ''}`} id="filter-panel-body">
          <div className="filter-panel-header">
            <p className="filter-panel-title">Filters</p>
            {hasActiveFilters && (
              <button className="filter-clear-btn" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>

          <div className="filter-panel-body">
            {VISIBLE_FILTERS.map((key) => {
              const options = getOptions(datasets, key)
              if (options.length === 0) return null
              const isCollapsed = collapsedSections.has(key)
              const activeCount = (filters[key] as string[]).length

              return (
                <fieldset key={key} className="filter-section">
                  <button
                    type="button"
                    className="filter-section-toggle"
                    onClick={() => toggleSection(key)}
                    aria-expanded={!isCollapsed}
                  >
                    <legend className="filter-section-label">
                      {FILTER_LABELS[key]}
                      {activeCount > 0 && (
                        <span style={{ marginLeft: '0.375rem', background: '#0B4F3A', color: '#fff', borderRadius: '9999px', fontSize: '0.65rem', padding: '0 0.35rem', fontWeight: 700 }}>
                          {activeCount}
                        </span>
                      )}
                    </legend>
                    <svg
                      className={`filter-section-chevron${isCollapsed ? '' : ' open'}`}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                  </button>

                  <div className={`filter-section-body${isCollapsed ? ' collapsed' : ''}`}>
                    <ul className="filter-checkbox-list">
                      {options.map((opt) => {
                        const inputId = `filter-${key}-${opt.replace(/\s+/g, '-').toLowerCase()}`
                        const count = datasets.filter((d) => d[key] === opt).length
                        return (
                          <li key={opt} className="filter-checkbox-item">
                            <input
                              type="checkbox"
                              id={inputId}
                              checked={(filters[key] as string[]).includes(opt)}
                              onChange={() => toggle(key, opt)}
                            />
                            <label htmlFor={inputId}>
                              {opt}
                              <span className="filter-count">{count}</span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </fieldset>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ── Results column ───────────────────────────────── */}
      <div className="catalogue-results">
        {/* Toolbar: search + sort + view toggle */}
        <div className="results-toolbar">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <label htmlFor="dataset-search" className="sr-only">Search datasets</label>
            <input
              type="search"
              id="dataset-search"
              className="search-input"
              placeholder="Search by title, theme, keyword…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search datasets by title, theme or keyword"
            />
          </div>

          <label htmlFor="sort-select" className="sr-only">Sort datasets</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Sort datasets"
          >
            <option value="default">Default order</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="status">By status</option>
          </select>

          <div className="view-toggle-group" role="group" aria-label="View mode">
            <button
              type="button"
              className={`view-toggle-btn${viewMode === 'card' ? ' active' : ''}`}
              onClick={() => setViewMode('card')}
              aria-pressed={viewMode === 'card'}
              aria-label="Card view"
              title="Card view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button
              type="button"
              className={`view-toggle-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              aria-label="List view"
              title="List view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="active-chips" role="list" aria-label="Active filters">
            {activeChips.map(({ key, value }) => (
              <span key={`${key}-${value}`} className="chip" role="listitem">
                {value}
                <button
                  className="chip-remove"
                  onClick={() => removeChip(key, value)}
                  aria-label={`Remove filter: ${value}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            ))}
            <button className="chip-clear-all" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="results-count">
          Showing <strong>{filtered.length}</strong> of {datasets.length} datasets
        </p>

        <DatasetGrid datasets={filtered} base={base} viewMode={viewMode} />
      </div>
    </div>
  )
}
