#!/usr/bin/env python3
"""Build frontend/data/landscape_outlines.json from the canonical MOSAIC
landscape delineations.

Reads MOSAIC_catalog/boundaries/<CODE>.geojson (one Feature per landscape,
EPSG:4326; skips the combined landscapes.geojson) and emits one SVG path
string per code in the locator map's equirectangular projection:

    x = lon + 180
    y = 90 - lat        (rounded to 2 decimals)

All rings of all polygons are concatenated into a single path with M/L/Z
subpaths (render with fill-rule="evenodd" so interior rings read as holes).
Rings are subsampled to at most MAX_RING_POINTS vertices — the locator map
is small, so the fidelity loss is invisible — keeping the JSON well under
the ~150 KB budget for a build-time import.

Usage:
    python3 scripts/build_map_outlines.py [path/to/MOSAIC_catalog]

The catalog path defaults to the sibling repo layout used in
MOSAIC_development/ (../../MOSAIC_catalog relative to this repo).
"""

import json
import math
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CATALOG = REPO_ROOT.parent.parent / "MOSAIC_catalog"
OUT_PATH = REPO_ROOT / "frontend" / "data" / "landscape_outlines.json"

MAX_RING_POINTS = 150  # per ring, after subsampling


def project(lon: float, lat: float) -> tuple[float, float]:
    """Equirectangular projection matching data/world_land_path.json."""
    return round(lon + 180, 2), round(90 - lat, 2)


def subsample(ring: list) -> list:
    """Keep every Nth vertex so the ring stays under MAX_RING_POINTS."""
    if len(ring) <= MAX_RING_POINTS:
        return ring
    step = math.ceil(len(ring) / MAX_RING_POINTS)
    kept = ring[::step]
    # Preserve the last distinct vertex so the closed shape isn't clipped.
    if kept[-1] != ring[-1]:
        kept.append(ring[-1])
    return kept


def ring_to_path(ring: list) -> str:
    """One closed M/L/Z subpath; consecutive duplicates (after rounding) dropped."""
    pts = []
    for lon, lat in subsample(ring):
        p = project(lon, lat)
        if not pts or p != pts[-1]:
            pts.append(p)
    # GeoJSON rings repeat the first vertex at the end; Z closes the path.
    if len(pts) > 1 and pts[-1] == pts[0]:
        pts.pop()
    if len(pts) < 3:
        return ""
    head = f"M{pts[0][0]} {pts[0][1]}"
    body = "".join(f"L{x} {y}" for x, y in pts[1:])
    return head + body + "Z"


def geometry_to_path(geometry: dict) -> str:
    gtype = geometry["type"]
    if gtype == "Polygon":
        polygons = [geometry["coordinates"]]
    elif gtype == "MultiPolygon":
        polygons = geometry["coordinates"]
    else:
        raise ValueError(f"Unsupported geometry type: {gtype}")
    return "".join(
        ring_to_path(ring) for polygon in polygons for ring in polygon
    )


def main() -> int:
    catalog = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CATALOG
    boundaries = catalog / "boundaries"
    if not boundaries.is_dir():
        print(f"Boundaries folder not found: {boundaries}")
        return 1

    outlines: dict[str, str] = {}
    for path in sorted(boundaries.glob("*.geojson")):
        if path.name == "landscapes.geojson":  # combined file — skip
            continue
        feature = json.loads(path.read_text(encoding="utf-8"))
        if feature.get("type") == "FeatureCollection":
            feature = feature["features"][0]
        code = feature.get("properties", {}).get("code", path.stem)
        d = geometry_to_path(feature["geometry"])
        if not d:
            print(f"Warning: empty path for {code}, skipped")
            continue
        outlines[code] = d

    out = {
        "_meta": {
            "note": (
                "Canonical MOSAIC living-landscape boundaries, simplified for the "
                "catalogue locator map. Derived from MOSAIC_catalog/boundaries/"
                "<CODE>.geojson (approved delineations, 2026-07-21; EPSG:4326). "
                "Each value is an SVG path in the locator projection "
                "x = lon + 180, y = 90 - lat, rounded to 2 decimals; rings "
                f"subsampled to <= {MAX_RING_POINTS} vertices. Render with "
                "fill-rule='evenodd'. Regenerate with "
                "scripts/build_map_outlines.py."
            ),
            "projection": "equirectangular: x = lon + 180, y = 90 - lat",
            "max_ring_points": MAX_RING_POINTS,
        },
        "outlines": outlines,
    }

    OUT_PATH.write_text(
        json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"Wrote {len(outlines)} outlines to {OUT_PATH} ({size_kb:.1f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
