export type Country =
  | 'Colombia'
  | "Côte d'Ivoire"
  | 'Ethiopia'
  | 'India'
  | 'Kenya'
  | 'Laos'
  | 'Peru'
  | 'Senegal'
  | 'Tanzania'
  | 'Tunisia'
  | 'Vietnam'
  | 'Zimbabwe'

export type Landscape =
  | 'MEK-3S'
  | 'IND-CH'
  | 'SEN-FK'
  | 'KEN-NAT'
  | 'ZWE-MB'
  | 'CIV-NZ'
  | 'TUN-NW'
  | 'ETH-OG'
  | 'COL-NAT'
  | 'PER-NAT'
  | 'LAO-NAT'
  | 'VNM-NAT'
  | 'GLB-UNSPEC'

export type MflTheme =
  | 'Boundaries / admin units'
  | 'Land cover / land use'
  | 'Ecosystem condition'
  | 'Degradation / land health'
  | 'Water / hydrology'
  | 'Biodiversity / ecosystems'
  | 'Pressures / drivers'
  | 'Ecosystem services'
  | 'Hotspots / leverage points'
  | 'Scenarios / future risks'
  | 'Decision-support outputs'
  | 'Agrobiodiversity / crops'
  | 'Socio-economic / livelihoods'

export type DataType = 'Raster' | 'Vector' | 'Tabular' | 'Mixed'

export type AccessLevel = 'Open' | 'CGIAR-internal' | 'Restricted'

export type ReadinessStatus = 'Raw' | 'Processed' | 'Validated'

export interface Dataset {
  // Always present
  id: string
  title: string
  living_landscape: Landscape
  readiness_status: ReadinessStatus

  // Controlled-vocabulary fields — may be null for incomplete / flagged records
  country: Country | null
  mfl_theme: MflTheme | null
  data_type: DataType | null
  access_level: AccessLevel | null
  license: string | null

  // Optional descriptive fields
  description?: string | null
  formats?: string[]
  source?: string | null
  contact?: string | null
  spatial_resolution?: string | null
  temporal_coverage?: string | null
  download_url?: string | null
  metadata_url?: string | null
}
