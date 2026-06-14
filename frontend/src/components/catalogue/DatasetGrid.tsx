import type { Dataset } from '../../utils/types'
import { DatasetCard } from './DatasetCard'

interface Props {
  datasets: Dataset[]
  base: string
  viewMode?: 'card' | 'list'
}

export function DatasetGrid({ datasets, base, viewMode = 'list' }: Props) {
  if (datasets.length === 0) {
    return (
      <div className="empty-state">
        <h3>No datasets match your filters</h3>
        <p>Try removing some filters or clearing all filters to see all available datasets.</p>
      </div>
    )
  }

  return (
    <div className={`ds-results ${viewMode === 'card' ? 'ds-results--grid' : 'ds-results--list'}`}>
      {datasets.map((d) => (
        <DatasetCard key={d.id} dataset={d} base={base} />
      ))}
    </div>
  )
}
