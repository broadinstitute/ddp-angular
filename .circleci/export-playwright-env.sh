#!/usr/bin/env bash

mkdir -p playwright-env

export sitePwd=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.sitePassword")
echo "export SITE_PASSWORD=$sitePwd" >> playwright-env/envvars

#DSM
export dsmUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .userName")
export dsmUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .password")
export bspToken=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.bsp | .[] | select(.env==\"$ENV\") | .token")
echo "export DSM_USER_EMAIL=$dsmUser" >> playwright-env/envvars
echo "export DSM_USER_PASSWORD=$dsmUserPassword" >> playwright-env/envvars
echo "export BSP_TOKEN=$bspToken" >> playwright-env/envvars


# SINGULAR
export singularUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"singular\") | .userName")
export singularUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"singular\") | .password")
echo "export SINGULAR_USER_EMAIL=$singularUser" >> playwright-env/envvars
echo "export SINGULAR_USER_PASSWORD=$singularUserPassword" >> playwright-env/envvars

# RGP
export rgpUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"rgp\") | .userName")
export rgpUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"rgp\") | .password")
echo "export RGP_USER_PASSWORD=$rgpUserPassword" >> playwright-env/envvars
echo "export RGP_USER_EMAIL=$rgpUser" >> playwright-env/envvars

# Read Auth0 RGP client credentials
export rgpDomain=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"rgp\" and .env==\"$ENV\") | .domain")
export rgpAudience=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"rgp\" and .env==\"$ENV\") | .audience")
export rgpClientId=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"rgp\" and .env==\"$ENV\") | .clientId")
export rgpClientSecret=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"rgp\" and .env==\"$ENV\") | .clientSecret")
echo "export RGP_AUTH0_DOMAIN=$rgpDomain" >> playwright-env/envvars
echo "export RGP_AUTH0_AUDIENCE=$rgpAudience" >> playwright-env/envvars
echo "export RGP_AUTH0_CLIENT_ID=$rgpClientId" >> playwright-env/envvars
echo "export RGP_AUTH0_CLIENT_SECRET=$rgpClientSecret" >> playwright-env/envvars

# ANGIO
export angioUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"angio\") | .userName")
export angioUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"angio\") | .password")
echo "export ANGIO_USER_PASSWORD=$angioUserPassword" >> playwright-env/envvars
echo "export ANGIO_USER_EMAIL=$angioUser" >> playwright-env/envvars

# PANCAN
export pancanUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"pancan\") | .userName")
export pancanUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"pancan\") | .password")
echo "export PANCAN_USER_PASSWORD=$pancanUserPassword" >> playwright-env/envvars
echo "export PANCAN_USER_EMAIL=$pancanUser" >> playwright-env/envvars

# OSTEO
export osteoUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"osteo\") | .userName")
export osteoUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"osteo\") | .password")
echo "export OSTEO_USER_PASSWORD=$osteoUserPassword" >> playwright-env/envvars
echo "export OSTEO_USER_EMAIL=$osteoUser" >> playwright-env/envvars

# BRAIN
export brainUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"brain\") | .userName")
export brainUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"brain\") | .password")
echo "export BRAIN_USER_PASSWORD=$brainUserPassword" >> playwright-env/envvars
echo "export BRAIN_USER_EMAIL=$brainUser" >> playwright-env/envvars

# EMAIL TESTING
export refreshToken=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.email.refreshToken")
export emailClientId=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.email.clientId")
export emailClientSecret=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.email.clientSecret")
export emailRedirectUri=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.email.redirectUri")
export emailWaitTime=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.email.minWaitTime")
echo "export EMAIL_REFRESH_TOKEN=$refreshToken" >> playwright-env/envvars
echo "export EMAIL_CLIENT_ID=$emailClientId" >> playwright-env/envvars
echo "export EMAIL_CLIENT_SECRET=$emailClientSecret" >> playwright-env/envvars
echo "export EMAIL_REDIRECT_URL=$emailRedirectUri" >> playwright-env/envvars
echo "export MIN_EMAIL_WAIT_TIME=$emailWaitTime" >> playwright-env/envvars

# LMS
export lmsUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"lms\") | .userName")
export lmsUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"lms\") | .password")
echo "export LMS_USER_PASSWORD=$lmsUserPassword" >> playwright-env/envvars
echo "export LMS_USER_EMAIL=$lmsUser" >> playwright-env/envvars

# MBC
export mbcUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"mbc\") | .userName")
export mbcUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"mbc\") | .password")
echo "export MBC_USER_PASSWORD=$mbcUserPassword" >> playwright-env/envvars
echo "export MBC_USER_EMAIL=$mbcUser" >> playwright-env/envvars

# ATCP
export atcpUser=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"atcp\") | .userName")
export atcpUserPassword=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"atcp\") | .password")
echo "export ATCP_USER_EMAIL=$atcpUser" >> playwright-env/envvars
echo "export ATCP_USER_PASSWORD=$atcpUserPassword" >> playwright-env/envvars

# Read Auth0 ATCP client credentials
export atcpDomain=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"atcp\" and .env==\"$ENV\") | .domain")
export atcpAudience=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"atcp\" and .env==\"$ENV\") | .audience")
export atcpClientId=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"atcp\" and .env==\"$ENV\") | .clientId")
export atcpClientSecret=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.auth0 | .[] | select(.app==\"atcp\" and .env==\"$ENV\") | .clientSecret")
echo "export ATCP_AUTH0_DOMAIN=$atcpDomain" >> playwright-env/envvars
echo "export ATCP_AUTH0_AUDIENCE=$atcpAudience" >> playwright-env/envvars
echo "export ATCP_AUTH0_CLIENT_ID=$atcpClientId" >> playwright-env/envvars
echo "export ATCP_AUTH0_CLIENT_SECRET=$atcpClientSecret" >> playwright-env/envvars
