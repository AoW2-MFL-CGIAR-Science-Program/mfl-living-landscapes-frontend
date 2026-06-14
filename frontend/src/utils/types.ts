export type Country =
  | 'Kenya'
  | 'Ethiopia'
  | 'India'
  | 'Colombia'
  | 'Myanmar'
  | 'Vietnam'
  | 'Laos'
  | 'Cambodia'
  | 'Thailand'

export type Landscape =
  | 'KEN-LV'
  | 'KEN-MT'
  | 'ETH-GT'
  | 'ETH-BL'
  | 'IND-WG'
  | 'IND-EP'
  | 'COL-AM'
  | 'MEK-LM'

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

export type DataType =
  | 'Raster'
  | 'Vector'
  | 'Tabular'
  | 'Time series'
  | 'Model output'
  | 'Survey data'

export type AccessLevel = 'Open' | 'Restricted' | 'Internal'

export type ReadinessStatus =
  | 'Registered only'
  | 'Under review'
  | 'Accepted'
  | 'Validated'
  | 'Analytics-ready'

export interface Dataset {
  // Required fields
  id: string
  title: string
  country: Country
  living_landscape: Landscape
  mfl_theme: MflTheme
  data_type: DataType
  access_level: AccessLevel
  license: string
  readiness_status: ReadinessStatus

  // Optional fields
  description?: string
  formats?: string[]
  source?: string
  contact?: string
  spatial_resolution?: string
  temporal_coverage?: string
  download_url?: string
  metadata_url?: string
}
