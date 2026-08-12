# YG Find a government employee
App and service to find the contact information of a person who works for a Government of Yukon organization

## Development

Before starting the API server, you need to create the appropriate .env file which can be done by running `cp src/api/.env src/api/.env.development`. You must then set the appropriate values

Before starting the WEB server, you need to create the appropriate .env file which can be done by running `cp src/web/.env.sample src/web/.env.development`. You must then set the appropriate value

To develop within this environment, you must have Node.js and NPM installed on your development machine. Open two terminal windows and open one to `/src/api` and `src/web` respectively. Both the API back-end and the web front-end can be started with: `npm run start:dev`.

Once both are running, open your browser and navigate to http://localhost:8080 to view the application.

## Understanding the environment variables

Environment variables should never be checked into the repository! 

- API_PORT=(the port the API will be listening on (doesn't have to match the docker port))
- FRONTEND_URL=(the URL of the service, from browser.)
- SMTP_SERVER= (The host of your outgoing SMTP server.)
- SMTP_PORT=(SMTP Port)
- EMAIL_FROM=(The e-mail address that all e-mails will be from.)
- NAME_FROM= (The name that all e-mails will be from.)
- EMAIL_SUBJECT= (The  e-mail subject.)
- EMAIL_TO= (The e-mail address that all e-mails will be to.)
- SMTP_PASS= (The password of the service)
- DIVISIONSJSON= (URL of the API to get the information of the divisions)
- EMPLOYEEJSON= (URL of the API to get the information of the employees)
- EMPLOYEEDETAILJSON= (API URL to get employee details)
- ESRI_KEY= (Key for esri)
- REMOVE_DEPARTMENTS= (list of departments to be omitted in the home, separated by ',', example: 'Yukon Hospital Corporation,Workers Safety and Compensation Board')

## Building the container image

`docker-compose -f docker-compose.production.yml up --build -d`

## Running the container in test or production

By default, the container will run in development mode, but following the step above, you can create the appropriate environment files for the instance you are targetting. Depending, the application will look for either `src/api/.env.test` or `src/api/.env.production`. To tell the API which instance to use, add the environment variable `NODE_ENV` to the docker run command like below.


`docker run -p 8080:3000 -e NODE_ENV=production --restart=on-failure Find-employee"`

## Deploying to test / production

The app runs in Kubernetes (VMware Tanzu), deployed via ArgoCD from Gitea-hosted manifests. A change has to move through several systems in sequence before it's actually live:

1. **GitHub (this repo)** — source and CI.
2. **GHCR** (`ghcr.io/ytgov/employee-directory`) — built images, published by the "Docker" GitHub Actions workflow (`.github/workflows/docker-publish.yml`). Note there is a second, similarly-named workflow, "Docker Image CI" (`docker-image.yml`), which only runs `docker build` as a sanity check and never publishes anywhere — don't confuse the two.
3. **Harbor** (`harbor.ynet.gov.yk.ca`) — internal registry mirror, set up as a pull-through cache in front of GHCR. It has no tags of its own; it fetches an image from GHCR the first time that tag is requested, so a brand-new tag won't show up in Harbor until something (e.g. the cluster) actually asks for it.
4. **Gitea** (internal, `gitea.ynet.gov.yk.ca`) — holds the Kubernetes manifests (Deployment/Service/Ingress) declaring which image tag should run in each cluster.
5. **ArgoCD** (`argocd.ynet.gov.yk.ca`) — watches the Gitea repos and applies manifest changes to the cluster. A push to Gitea alone does not appear to deploy anything automatically — the corresponding ArgoCD Application still needs a manual Sync.

### Steps to deploy a new version

1. Merge the change into the `test` branch (see note below).
2. Tag the merge commit with a semantic version matching `v*.*.*`, and push the tag:
   ```
   git tag -a v1.2.1 <commit> -m "v1.2.1"
   git push origin v1.2.1
   ```
   The tag push triggers the "Docker" workflow, which builds and publishes `ghcr.io/ytgov/employee-directory:<version>`. Optionally create a matching GitHub Release (`gh release create <version> --generate-notes`) for changelog purposes — this is documentation only and has no effect on the build or deploy.
3. In the appropriate Gitea repo (see Environments below), update the `image:` line in the deployment manifest to `harbor.ynet.gov.yk.ca/yg-github/ytgov/employee-directory:<version>`, and push. Harbor pulls the new image through from GHCR automatically on first request — no separate Harbor step is needed.
4. In ArgoCD, open the corresponding Application and click **Sync** to apply the change to the cluster.
5. Verify the new version is live, e.g. `curl -I <url>` and check that the `Last-Modified` header changed, or confirm the change is visible in the app itself.

### Environments

| | Test | Production |
|---|---|---|
| URL | https://test.find-employee.ynet.gov.yk.ca | https://find-employee.service.yukon.ca |
| Gitea repo | `yg/ict-cluster`, `employee directory/deployment.yaml` | `yg/dmz-cluster`, `employee directory/manifests/deployment.yaml` (via `kustomization.yaml`) |
| ArgoCD Application | `employee-directory-dev` | `employee-directory-prd` |

The test environment's Kubernetes objects (Deployment/Service names, etc.) are labelled `employee-directory-prd` — a legacy naming mismatch that hasn't been cleaned up. The ArgoCD Application itself is correctly named `employee-directory-dev`; don't assume "prd" in an object name inside `ict-cluster` means it's production.

### `test` branch is currently the deployment source

As of 2026-08, **both the test and production environments are running builds from the `test` branch**, not `main`. `main`/`prod` are missing 31 commits' worth of real application changes that only ever landed on `test` (employee search, API failure caching, error banners, health-check endpoint, translation fixes). Until that's reconciled, treat `test` as the effective source branch when cutting a release — a tag pushed on `main` alone would not reflect what's actually different about the app.