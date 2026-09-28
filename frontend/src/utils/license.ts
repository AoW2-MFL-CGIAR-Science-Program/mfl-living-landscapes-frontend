// SPDX ids the catalog pipeline can write into `license` — a copy of
// SPDX_LICENSE_IDS in MOSAIC_catalog/mosaic_pipeline/transform.py (rule R3),
// built the same way. Any other value is the source's own wording, kept
// verbatim by the pipeline. Update both lists together when R3 changes.
const CC_VERSIONS = ['1.0', '2.0', '2.5', '3.0', '4.0']

export const SPDX_LICENSE_IDS: ReadonlySet<string> = new Set([
  ...['', '-SA', '-NC', '-NC-SA', '-NC-ND', '-ND'].flatMap((e) => CC_VERSIONS.map((v) => `CC-BY${e}-${v}`)),
  ...['', '-SA', '-NC', '-NC-SA', '-NC-ND'].map((e) => `CC-BY${e}-3.0-IGO`),
  'CC0-1.0', 'ODC-By-1.0', 'ODbL-1.0', 'PDDL-1.0',
])

// True when the value reads as a license name ("the CC-BY-4.0 license").
export function isSpdxLicense(license: string | null | undefined): boolean {
  return !!license && SPDX_LICENSE_IDS.has(license)
}
