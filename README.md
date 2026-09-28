# MOSAIC website

The public website of MOSAIC, the open geospatial data network for living landscapes: a catalogue of spatial datasets from CGIAR centres working across the Multifunctional Landscapes (MFL) Science Programme Living Landscapes.

**Live site:** https://mosaic-mfl.github.io/website/

[![Deploy to GitHub Pages](https://github.com/MOSAIC-mfl/website/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/MOSAIC-mfl/website/actions/workflows/deploy-pages.yml)
[![Validate Dataset Metadata](https://github.com/MOSAIC-mfl/website/actions/workflows/validate-data.yml/badge.svg)](https://github.com/MOSAIC-mfl/website/actions/workflows/validate-data.yml)

---

## Contents

- [Local development](#local-development)
- [Repository structure](#repository-structure)
- [Updating the dataset catalogue](#updating-the-dataset-catalogue)
- [Contributing](#contributing)
- [Branch strategy](#branch-strategy)
- [Deployment](#deployment)
- [License](#license)

---

## Local development

**Prerequisites:** Node 20 LTS, npm

```bash
# 1. Clone the repository
git clone https://github.com/MOSAIC-mfl/website.git
cd website

# 2. Install dependencies
cd frontend
npm install

# 3. Start the development server
npm run dev
# → http://localhost:4321/website

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview

# 6. Run linting and type checks
npm run lint
npm run typecheck
```

Use `nvm use` in the repository root to switch to the pinned Node version (20).

---

## Repository structure

```
website/
├── .github/
│   ├── workflows/          # CI/CD workflows (deploy, lint, validate)
│   ├── ISSUE_TEMPLATE/     # Bug, feature, dataset, content issue templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml      # Weekly grouped dependency updates
├── scripts/
│   └── validate_datasets.py  # Metadata validation script
├── frontend/
│   ├── src/
│   │   ├── components/     # Astro + React components
│   │   ├── layouts/        # BaseLayout, DocLayout
│   │   ├── pages/          # All 10 site pages
│   │   ├── styles/         # Global CSS, variables, catalogue styles
│   │   └── utils/          # TypeScript interfaces and data utilities
│   ├── data/
│   │   ├── datasets.json   # Primary metadata source — edit to update catalogue
│   │   ├── landscapes.json # Living Landscape codes
│   │   ├── themes.json     # MFL theme labels
│   │   └── metadata_schema.json
│   ├── public/             # Static assets
│   ├── astro.config.mjs
│   └── package.json
└── .nvmrc                  # Node 20
```

---

## Updating the dataset catalogue

The catalogue is driven by `frontend/data/datasets.json`. To add or update a dataset:

1. Create a branch: `git checkout -b data/add-dataset-name`
2. Edit `frontend/data/datasets.json`
3. Validate locally: `python3 scripts/validate_datasets.py frontend/data/datasets.json`
4. Open a pull request — the `validate-data.yml` workflow runs automatically
5. If validation passes, merge — the site rebuilds and deploys within ~5 minutes

For non-technical contributors, open a [Dataset Catalogue Update issue](https://github.com/MOSAIC-mfl/website/issues/new?template=dataset_update.yml) and the MOSAIC team will handle the pull request.

### Dataset ID format

`{LANDSCAPE}_{THEME-CODE}_{YEAR}_{SOURCE}_{VERSION}`

Example: `KEN-LV_LC_2023_ILRI_v1`

---

## Contributing

For code or content changes:
1. Fork or create a feature branch from `main`
2. Make your changes
3. Ensure `npm run build`, `npm run lint`, and `npm run typecheck` all pass
4. Open a pull request using the PR template

All PRs require at least one review before merging to `main`. See the [Upload Guidelines](https://mosaic-mfl.github.io/website/contribute) for how to add a dataset.

---

## Branch strategy

| Branch | Purpose | Protected |
|---|---|---|
| `main` | Production — always deployable | Yes |
| `feature/*` | New features or pages | No |
| `fix/*` | Bug fixes | No |
| `data/*` | Dataset or metadata updates | No |
| `hotfix/*` | Urgent production fixes | No |

Delete branches after merge.

---

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via the `deploy-pages.yml` workflow.

**One-time setup (repository admin):** In Settings > Pages, set Source to **GitHub Actions**.

**Deployment time:** ~3–5 minutes from push to live.

**Rollback:** Re-run a previous successful workflow from the Actions tab.

---

## License

Site code and documentation: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Individual datasets have their own licenses — see each dataset entry in the catalogue.
