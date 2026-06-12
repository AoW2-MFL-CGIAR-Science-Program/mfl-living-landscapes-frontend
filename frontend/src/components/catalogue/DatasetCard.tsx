import type { Dataset } from '../../utils/types'

const STATUS_BADGE: Record<string, string> = {
  'Registered only': 'badge badge-registered',
  'Under review':    'badge badge-review',
  'Accepted':        'badge badge-accepted',
  'Validated':       'badge badge-validated',
  'Analytics-ready': 'badge badge-analytics',
}

const ACCESS_BADGE: Record<string, string> = {
  'Open':       'badge badge-open',
  'Restricted': 'badge badge-restricted',
  'Internal':   'badge badge-internal',
}

const TYPE_BADGE: Record<string, string> = {
  'Raster':       'badge badge-raster',
  'Vector':       'badge badge-vector',
  'Tabular':      'badge badge-tabular',
  'Time series':  'badge badge-timeseries',
  'Model output': 'badge badge-model',
  'Survey data':  'badge badge-survey',
}

const THEME_THUMB: Record<string, string> = {
  'Biodiversity / ecosystems':  'dataset-card-thumb--biodiversity',
  'Land cover / land use':      'dataset-card-thumb--landcover',
  'Water / hydrology':          'dataset-card-thumb--water',
  'Degradation / land health':  'dataset-card-thumb--soil',
  'Ecosystem condition':        'dataset-card-thumb--biodiversity',
  'Socio-economic / livelihoods': 'dataset-card-thumb--socio',
}

interface Props {
  dataset: Dataset
  base: string
}

export function DatasetCard({ dataset, base }: Props) {
  const detailUrl = `${base}/catalogue/${dataset.id}`
  const thumbClass = THEME_THUMB[dataset.mfl_theme] ?? 'dataset-card-thumb--default'

  return (
    <article
      className="dataset-card dataset-card--clickable"
      onClick={() => { window.location.href = detailUrl }}
    >
      {/* Colour-coded top strip by theme */}
      <div className={`dataset-card-thumb ${thumbClass}`} aria-hidden="true" />

      <div className="dataset-card-body">
        {/* Badges */}
        <div className="dataset-card-badges">
          <span className={STATUS_BADGE[dataset.readiness_status] ?? 'badge badge-registered'}>
            {dataset.readiness_status}
          </span>
          <span className={ACCESS_BADGE[dataset.access_level] ?? 'badge badge-internal'}>
            {dataset.access_level}
          </span>
          <span className={TYPE_BADGE[dataset.data_type] ?? 'badge badge-tabular'}>
            {dataset.data_type}
          </span>
        </div>

        {/* Title */}
        <h3 className="dataset-card-title">{dataset.title}</h3>

        {/* Description */}
        {dataset.description && (
          <p className="dataset-card-description">{dataset.description}</p>
        )}

        {/* Metadata pills */}
        <div className="dataset-card-meta">
          <span className="meta-pill">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {dataset.country}
          </span>
          <span className="meta-pill">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
            </svg>
            {dataset.living_landscape}
          </span>
          <span className="meta-pill">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            {dataset.mfl_theme}
          </span>
          {dataset.temporal_coverage && (
            <span className="meta-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {dataset.temporal_coverage}
            </span>
          )}
          {dataset.source && (
            <span className="meta-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {dataset.source}
            </span>
          )}
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="dataset-card-footer">
        <a
          href={detailUrl}
          className="card-link-primary"
          onClick={(e) => e.stopPropagation()}
        >
          View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </a>
        {dataset.access_level === 'Open' && dataset.download_url && (
          <a
            href={dataset.download_url}
            className="card-link-download"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Download ${dataset.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </a>
        )}
      </div>
    </article>
  )
}
