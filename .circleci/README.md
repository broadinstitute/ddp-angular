# CircleCI

`config.yml` defines the CircleCI jobs and workflows.

## Scripts

`run_ci.sh` is used to run workflows. It's located in `../build-utils` directory.


## Triggering a job via CircleCI API

```sh
curl -u $CI_TOKEN \
     -d build_parameters[CIRCLE_JOB]=$JOB_NAME \
     https://circleci.com/api/v1.1/project/gh/broadinstitute/ddp-angular/tree/$GITHUB_BRANCH
```

- `$CI_TOKEN` is your personal API token from https://app.circleci.com/settings/user/tokens
- `$JOB_NAME` is the job to run from config.yml. (for example, `playwright-e2e-test`)
- `$GITHUB_BRANCH` is the branch name (for example, `develop`)

## Triggering workflow via `./run_ci.sh`

```sh
Example: 

# Must first set personal `CI_TOKEN` in `$HOME/.circleci-token` file
vi $HOME/.circleci-token

# Run CI api-run-tests-workflow workflow for Singular project on your branch
./run_ci.sh  run-tests singular $GITHUB_BRANCH

```

