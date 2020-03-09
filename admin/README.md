###To create GCP role with permissions to deploy Angular app to GAE:
`gcloud iam roles create --project GCP_PROJECT_NAME 'DDP_Angular_App_Deployer' --file DDPAngularAppDeployerRole.yaml` 

where `GCP_PROJECT_NAME` could be `broad-ddp-dev` , `broad-ddp-test` etc. 
