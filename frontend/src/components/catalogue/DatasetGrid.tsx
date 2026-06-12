import type { Dataset } from '../../utils/types'
import { DatasetCard } from './DatasetCard'

interface Props {
  datasets: Dataset[]
  base: string
  viewMode?: 'card' | 'list'
}

export function DatasetGrid({ datasets, base, viewMode = 'card' }: Props) {
  if (datasets.length === 0) {
    return (
      <div className="dataset-grid">
        <div className="empty-state">
          <h3>No datasets match your filters</h3>
          <p>Try removing some filters or clearing all filters to see all available datasets.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`dataset-grid${viewMode === 'list' ? ' list-view' : ''}`}>
      {datasets.map((d) => (
        <DatasetCard key={d.id} dataset={d} base={base} />
      ))}
    </div>
  )
}
