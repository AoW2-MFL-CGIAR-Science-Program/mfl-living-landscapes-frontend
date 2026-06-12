#!/usr/bin/env python3
"""Validate frontend/data/datasets.json against MFL metadata rules."""

import json
import sys
from pathlib import Path

REQUIRED_FIELDS = [
    "id", "title", "country", "living_landscape", "mfl_theme",
    "data_type", "access_level", "license", "readiness_status"
]

VALID_COUNTRIES = [
    "Kenya", "Ethiopia", "India", "Colombia",
    "Myanmar", "Vietnam", "Laos", "Cambodia", "Thailand"
]

VALID_LANDSCAPES = [
    "KEN-LV", "KEN-MT", "ETH-GT", "ETH-BL",
    "IND-WG", "IND-EP", "COL-AM", "MEK-LM"
]

VALID_MFL_THEMES = [
    "Boundaries / admin units",
    "Land cover / land use",
    "Ecosystem condition",
    "Degradation / land health",
    "Water / hydrology",
    "Biodiversity / ecosystems",
    "Pressures / drivers",
    "Ecosystem services",
    "Hotspots / leverage points",
    "Scenarios / future risks",
    "Decision-support outputs",
    "Agrobiodiversity / crops",
    "Socio-economic / livelihoods"
]

VALID_DATA_TYPES = [
    "Raster", "Vector", "Tabular", "Time series", "Model output", "Survey data"
]

VALID_ACCESS = ["Open", "Restricted", "Internal"]

VALID_READINESS = [
    "Registered only", "Under review", "Accepted", "Validated", "Analytics-ready"
]

RECORD_COUNT_WARNING = 300


def validate(path: str) -> list[str]:
    errors = []

    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"JSON parse error: {e}"]
    except FileNotFoundError:
        return [f"File not found: {path}"]

    if not isinstance(data, list):
        return ["Top-level value must be a JSON array"]

    if len(data) >= RECORD_COUNT_WARNING:
        print(
            f"Warning: {len(data)} records in datasets.json. "
            f"Consider planning pagination for performance above {RECORD_COUNT_WARNING} records."
        )

    seen_ids: set[str] = set()

    for i, entry in enumerate(data):
        prefix = f"Entry {i} (id={entry.get('id', 'MISSING')})"

        # Required fields
        for field in REQUIRED_FIELDS:
            if field not in entry or entry[field] == "" or entry[field] is None:
                errors.append(f"{prefix}: missing required field '{field}'")

        # Unique IDs
        eid = entry.get("id")
        if eid:
            if eid in seen_ids:
                errors.append(f"{prefix}: duplicate id '{eid}'")
            seen_ids.add(eid)

        # download_url required when Open
        if entry.get("access_level") == "Open":
            if not entry.get("download_url"):
                errors.append(
                    f"{prefix}: access_level is Open but download_url is missing"
                )

        # Controlled vocabularies
        if entry.get("country") and entry["country"] not in VALID_COUNTRIES:
            errors.append(f"{prefix}: invalid country '{entry['country']}'")

        if entry.get("living_landscape") and entry["living_landscape"] not in VALID_LANDSCAPES:
            errors.append(
                f"{prefix}: invalid living_landscape '{entry['living_landscape']}'"
            )

        if entry.get("mfl_theme") and entry["mfl_theme"] not in VALID_MFL_THEMES:
            errors.append(f"{prefix}: invalid mfl_theme '{entry['mfl_theme']}'")

        if entry.get("data_type") and entry["data_type"] not in VALID_DATA_TYPES:
            errors.append(f"{prefix}: invalid data_type '{entry['data_type']}'")

        if entry.get("access_level") and entry["access_level"] not in VALID_ACCESS:
            errors.append(f"{prefix}: invalid access_level '{entry['access_level']}'")

        if entry.get("readiness_status") and entry["readiness_status"] not in VALID_READINESS:
            errors.append(
                f"{prefix}: invalid readiness_status '{entry['readiness_status']}'"
            )

    return errors


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validate_datasets.py <path/to/datasets.json>")
        sys.exit(1)

    errors = validate(sys.argv[1])

    if errors:
        print(f"Validation FAILED -- {len(errors)} error(s):\n")
        for e in errors:
            print(f"  x {e}")
        sys.exit(1)
    else:
        print("Validation PASSED -- datasets.json is valid.")
        sys.exit(0)
