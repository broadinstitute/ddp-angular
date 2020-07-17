## How to build ATCP app frontend
### Step 1: Prepare Auth0 scripts and styles
Build Auth0 scripts:

`npm run ng build ddp-atcp-auth`

Compress styles:
`./node_modules/.bin/sass ./projects/ddp-atcp/src/auth0/auth0-styles/main.scss ./projects/ddp-atcp/src/auth0/compiled/auth0-styles/main.css --style compressed`

### Step 2: Build ATCP app

`npm run ng build ddp-atcp`


## **!! IMPORTANT**
* Do not forget to compile Auth0 scripts and styles after each modification (Step 1).
Otherwise your changes will not be applied.

* Commit compiled Auth0 scripts and styles to GIT.

