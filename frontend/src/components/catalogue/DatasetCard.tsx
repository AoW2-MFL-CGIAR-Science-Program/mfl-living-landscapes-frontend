import type { Dataset } from '../../utils/types'
import { DatasetThumbnail } from './DatasetThumbnail'

const STATUS_BADGE: Record<string, string> = {
  'Raw':       'badge badge-raw',
  'Processed': 'badge badge-processed',
  'Validated': 'badge badge-validated',
}

const STATUS_TOOLTIP: Record<string, string> = {
  'Raw':       'Metadata registered; dataset not yet reviewed.',
  'Processed': 'Dataset prepared, harmonized or structured for use.',
  'Validated': 'Metadata and spatial information checked by the MOSAIC team.',
}

const TYPE_BADGE: Record<string, string> = {
  'Raster':  'badge badge-raster',
  'Vector':  'badge badge-vector',
  'Tabular': 'badge badge-tabular',
  'Mixed':   'badge badge-mixed',
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
function MapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
function LeafIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
function BankIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
  )
}

interface Props {
  dataset: Dataset
  base: string
}

export function DatasetCard({ dataset, base }: Props) {
  const detailUrl = `${base}/catalogue/${dataset.id}`
  const isOpen = dataset.access_level === 'Open' && !!dataset.download_url
  const formats = dataset.formats ?? []

  return (
    <article className="ds-card">
      {/* Thumbnail */}
      <div className="ds-card-thumb">
        <DatasetThumbnail id={dataset.id} theme={dataset.mfl_theme ?? ''} />
      </div>

      {/* Main content */}
      <div className="ds-card-main">
        <h3 className="ds-card-title">
          {/* Stretched-link: the title is the real anchor; ::after overlay makes
              the whole card clickable while keeping new-tab / keyboard behaviour. */}
          <a href={detailUrl} className="ds-card-title-link">{dataset.title}</a>
        </h3>

        <div className="ds-card-badges">
          <span
            className={STATUS_BADGE[dataset.readiness_status] ?? 'badge badge-raw'}
            title={STATUS_TOOLTIP[dataset.readiness_status]}
          >
            {dataset.readiness_status}
          </span>
          {dataset.data_type && (
            <span className={TYPE_BADGE[dataset.data_type] ?? 'badge badge-tabular'}>
              {dataset.data_type}
            </span>
          )}
          {dataset.spatial_resolution && dataset.spatial_resolution !== 'N/A' && (
            <span className="badge badge-resolution">{dataset.spatial_resolution}</span>
          )}
          {dataset.temporal_coverage && (
            <span className="badge badge-year">{dataset.temporal_coverage}</span>
          )}
        </div>

        {dataset.description && (
          <p className="ds-card-desc">{dataset.description}</p>
        )}

        <div className="ds-card-meta">
          {dataset.country && <span className="ds-meta-item"><GlobeIcon />{dataset.country}</span>}
          <span className="ds-meta-item"><MapIcon />{dataset.living_landscape}</span>
          {dataset.mfl_theme && <span className="ds-meta-item"><LeafIcon />{dataset.mfl_theme}</span>}
          {dataset.source && <span className="ds-meta-item"><BankIcon />{dataset.source}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="ds-card-actions">
        <a
          href={detailUrl}
          className="ds-view-btn"
        >
          View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        {/* MOSAIC connects to sources rather than re-hosting: only show a
            source link when the record carries a real external download_url. */}
        {dataset.download_url && (
          <a
            href={dataset.download_url}
            className="ds-download"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Go to source for ${dataset.title}`}
          >
            <span className="ds-download-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {isOpen ? 'Go to source' : 'Source link'}
            </span>
            {formats.length > 0 && <span className="ds-formats">{formats.join(', ')}</span>}
          </a>
        )}
      </div>
    </article>
  )
}
