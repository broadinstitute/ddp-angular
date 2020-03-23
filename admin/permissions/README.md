## Managing custom roles and permissions

Here's a grab bag of utilities for creating and managing various permissions and roles.

### Set the project and service account

Let's keep our environments consistent by scripting permissions and ACL changes as much as possible.  In general we 
use service accounts that are unique to each project, so at various points you'll want to change the GCP project
and the service account when using these scripts.

`GCP_PROJECT` can be either `broad-ddp-dev` , `broad-ddp-test`, `broad-ddp-staging`, or `broad-ddp-prod` 

`SERVICE_ACCOUNT` is the "email" address for the service account, which can be read via `vaultcli read secret/pepper/[dev | test | staging | prod]/v1/conf -r .gcp.serviceKey.client_email`

```
export GCP_PROJECT=...
export SERVICE_ACCOUNT=...

```

### Create GCP role with permissions to deploy Angular app to GAE.
```
gcloud iam roles create --project ${GCP_PROJECT} 'DDP_CI_CD' --file DDPCICDRole.yaml
```

### Update GCP role with permissions to deploy Angular app to GAE.

```
gcloud iam roles update --project ${GCP_PROJECT} 'DDP_CI_CD' --file DDPCICDRole.yaml
```

### Grant the service account full access to various GAE buckets
```
gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:roles/storage.admin gs://staging.${GCP_PROJECT}.appspot.com
gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:roles/storage.admin gs://us.artifacts.${GCP_PROJECT}.appspot.com
gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:roles/storage.admin gs://${GCP_PROJECT}.appspot.com
```


