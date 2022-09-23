# CircleCI

`config.yml` defines the jobs and workflows of CircleCI.

## Scripts

This directory contains scripts used by `config.yml` to run jobs. More
general scripts should be located in `../_scripts` or in individual
package directories.


## Triggering manual jobs via CircleCI API

```sh
curl -u $CIRCLECI_API_TOKEN \
     -d build_parameters[CIRCLE_JOB]=$JOB_NAME \
     https://circleci.com/api/v1.1/project/gh/broadinstitute/ddp-angular/tree/$GITHUB_BRANCH
```

- `$CIRCLECI_API_TOKEN` is your personal API token from https://app.circleci.com/settings/user/tokens
- `$JOB_NAME` is the job to run from config.yml. (for example, `playwright-e2e-test`)
- `$GITHUB_BRANCH` is the branch name (for example, `develop`)

### Triggering workflow via `build-utils/run_ci.sh`

Must first set `CI_TOKEN` environment variable.
```sh
Example: ./run_ci.sh  run-tests singular $GITHUB_BRANCH

```

