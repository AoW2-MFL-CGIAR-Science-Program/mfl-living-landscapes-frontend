import type { Dataset } from '../../utils/types'

const STATUS_CLASS: Record<string, string> = {
  'Registered only': 'badge-registered',
  'Under review': 'badge-review',
  'Accepted': 'badge-accepted',
  'Validated': 'badge-validated',
  'Analytics-ready': 'badge-analytics',
}

const ACCESS_CLASS: Record<string, string> = {
  'Open': 'badge-open',
  'Restricted': 'badge-restricted',
  'Internal': 'badge-internal',
}

interface Props {
  dataset: Dataset
  base: string
}

export function DatasetCard({ dataset, base }: Props) {
  return (
    <article className="dataset-card">
      <div className="dataset-card-badges">
        <span className={`badge ${STATUS_CLASS[dataset.readiness_status] ?? ''}`}>
          {dataset.readiness_status}
        </span>
        <span className={`badge ${ACCESS_CLASS[dataset.access_level] ?? ''}`}>
          {dataset.access_level}
        </span>
      </div>

      <h3 className="dataset-card-title">{dataset.title}</h3>

      <div className="dataset-card-meta">
        <span><strong>Country:</strong> {dataset.country}</span>
        <span><strong>Landscape:</strong> {dataset.living_landscape}</span>
        <span><strong>Theme:</strong> {dataset.mfl_theme}</span>
        <span>
          <strong>Type:</strong> {dataset.data_type}
          {dataset.spatial_resolution && ` · ${dataset.spatial_resolution}`}
          {dataset.temporal_coverage && ` · ${dataset.temporal_coverage}`}
        </span>
        {dataset.source && <span><strong>Source:</strong> {dataset.source}</span>}
      </div>

      <a href={`${base}/catalogue/${dataset.id}`} className="dataset-card-link">
        View details &rarr;
      </a>
    </article>
  )
}
