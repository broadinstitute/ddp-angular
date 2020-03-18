###To create GCP role with permissions to deploy Angular app to GAE:
`gcloud iam roles create --project GCP_PROJECT_NAME 'DDP_CI_CD' --file DDPCICDRole.yaml` 

where `GCP_PROJECT_NAME` could be `broad-ddp-dev` , `broad-ddp-test` etc. 
