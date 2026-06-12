import type { Dataset } from './types'

export interface FilterState {
  country: string[]
  living_landscape: string[]
  mfl_theme: string[]
  readiness_status: string[]
  data_type: string[]
  access_level: string[]
  license: string[]
}

export function filterDatasets(datasets: Dataset[], filters: FilterState): Dataset[] {
  return datasets.filter((d) => {
    if (filters.country.length > 0 && !filters.country.includes(d.country)) return false
    if (filters.living_landscape.length > 0 && !filters.living_landscape.includes(d.living_landscape)) return false
    if (filters.mfl_theme.length > 0 && !filters.mfl_theme.includes(d.mfl_theme)) return false
    if (filters.readiness_status.length > 0 && !filters.readiness_status.includes(d.readiness_status)) return false
    if (filters.data_type.length > 0 && !filters.data_type.includes(d.data_type)) return false
    if (filters.access_level.length > 0 && !filters.access_level.includes(d.access_level)) return false
    if (filters.license.length > 0 && !filters.license.includes(d.license)) return false
    return true
  })
}

export function emptyFilters(): FilterState {
  return {
    country: [],
    living_landscape: [],
    mfl_theme: [],
    readiness_status: [],
    data_type: [],
    access_level: [],
    license: [],
  }
}
