import { useState } from 'react'
import type { Dataset } from '../../utils/types'
import { filterDatasets, emptyFilters, type FilterState } from '../../utils/filterDatasets'
import { DatasetGrid } from './DatasetGrid'

interface Props {
  datasets: Dataset[]
  base: string
}

type FilterKey = keyof FilterState

const DEFAULT_FILTERS: FilterKey[] = ['country', 'living_landscape', 'mfl_theme', 'readiness_status']
const EXPANDED_FILTERS: FilterKey[] = ['data_type', 'access_level', 'license']

const FILTER_LABELS: Record<FilterKey, string> = {
  country: 'Country',
  living_landscape: 'Living Landscape',
  mfl_theme: 'Theme',
  readiness_status: 'Readiness Status',
  data_type: 'Data Type',
  access_level: 'Access Level',
  license: 'License',
}

function getOptions(datasets: Dataset[], key: FilterKey): string[] {
  const values = datasets.map((d) => d[key] as string).filter(Boolean)
  return [...new Set(values)].sort()
}

export function CatalogueFilter({ datasets, base }: Props) {
  // Leer filtros desde URL params al cargar (ej: ?landscape=KEN-LV)
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
  const [expanded, setExpanded] = useState(false)

  const filtered = filterDatasets(datasets, filters)

  const activeChips: { key: FilterKey; value: string }[] = Object.entries(filters).flatMap(
    ([key, values]) => (values as string[]).map((value) => ({ key: key as FilterKey, value }))
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
  }

  const visibleFilters = expanded ? [...DEFAULT_FILTERS, ...EXPANDED_FILTERS] : DEFAULT_FILTERS

  return (
    <div className="catalogue-layout">
      {/* Filter panel */}
      <aside className="filter-panel">
        <h2>Filters</h2>

        {visibleFilters.map((key) => {
          const options = getOptions(datasets, key)
          if (options.length === 0) return null
          return (
            <fieldset key={key} className="filter-group">
              <legend className="filter-group-label">{FILTER_LABELS[key]}</legend>
              <ul className="filter-checkbox-list">
                {options.map((opt) => {
                  const inputId = `filter-${key}-${opt.replace(/\s+/g, '-').toLowerCase()}`
                  return (
                    <li key={opt} className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        id={inputId}
                        checked={(filters[key] as string[]).includes(opt)}
                        onChange={() => toggle(key, opt)}
                      />
                      <label htmlFor={inputId}>{opt}</label>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
          )
        })}

        <button className="filter-more-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded ? '- Fewer filters' : '+ More filters'}
        </button>
      </aside>

      {/* Results */}
      <div>
        {activeChips.length > 0 && (
          <div className="active-filters">
            {activeChips.map(({ key, value }) => (
              <span key={`${key}-${value}`} className="filter-chip">
                {FILTER_LABELS[key]}: {value}
                <button className="filter-chip-remove" onClick={() => removeChip(key, value)} aria-label={`Remove filter ${value}`}>
                  &times;
                </button>
              </span>
            ))}
            <button className="filter-clear-all" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        <p className="results-count">
          Showing {filtered.length} of {datasets.length} datasets
        </p>

        <DatasetGrid datasets={filtered} base={base} />
      </div>
    </div>
  )
}
