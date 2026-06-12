import type { Dataset } from './types'
import rawDatasets from '../../data/datasets.json'

// All data loading goes through this single function.
// Future: replace with API call (STAC, CKAN, etc.) by changing only this file.
export async function loadDatasets(): Promise<Dataset[]> {
  return rawDatasets as Dataset[]
}
