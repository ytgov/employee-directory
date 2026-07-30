# Mock data server

Dependency-free stand-in for the real `DIVISIONSJSON`/`EMPLOYEEJSON` upstream endpoints,
for local development when the internal Yukon government network isn't reachable.
`server.js` uses only Node's built-in `http` module.

Authored by Dave Rogers <dave.rogers@yukon.ca>, eServices for Citizens

## Setup

`divisions.json` and `employees.json` are gitignored and are not committed to the repo.
Place your own copies in this directory before starting the server.
`server.js` loads both files once at startup via `fs.readFileSync`.
The server will fail to start if either file is missing.

Expected shape (matching the real upstream responses):
- `divisions.json` — `{ "divisions": [...] }`
- `employees.json` — `{ "employees": [...] }`

## Endpoints

- `GET /divisions?department=X`: exact match on `department`
- `GET /employees?department=X&division=Y&keyword=Z`: exact match on
  `department`/`division`; 
  case-insensitive substring match on `keyword` against
  `full_name`/`first_name`/`last_name`/`email`

## Dependents in development

This module is wired in only through `docker-compose.development.yml`.
Nothing outside that compose file references it:

- `api`: `depends_on: mock`.
  The `DIVISIONSJSON`/`EMPLOYEEJSON` environment variables are overridden in the compose
  file to `http://mock:4000/divisions` and `http://mock:4000/employees`, so whatever
  those two keys are set to in `.env.development` is ignored for this stack.
- `web`: `depends_on: api`.
  It has no direct dependency on `mock`, but its `api` calls will fail to return data
  unless `mock` is also up.

## Not used in production

The root `Dockerfile` (production/GHCR image) only `COPY`s `src/api` and `src/web`.
Nothing under `src/mock` is reachable from the published image regardless of this
directory's contents.
