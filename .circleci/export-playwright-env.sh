#!/usr/bin/env bash

mkdir -p playwright-env

export sitePwd=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.sitePassword")
echo "export SITE_PASSWORD=$sitePwd" >> playwright-env/envvars

# DSM
export bspToken=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.bsp | .[] | select(.env==\"$ENV\") | .token")
echo "export BSP_TOKEN=$bspToken" >> playwright-env/envvars

export dsmUser1=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[0] | .userName")
export dsmUser1Password=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[0] | .password")
echo "export DSM_USER1_EMAIL=$dsmUser1" >> playwright-env/envvars
echo "export DSM_USER1_PASSWORD=$dsmUser1Password" >> playwright-env/envvars

# Additional DSM User (DSM permission testing)
export dsmUser2=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[1] | .userName")
export dsmUser2Password=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[1] | .password")
echo "export DSM_USER2_PASSWORD=$dsmUser2Password" >> playwright-env/envvars
echo "export DSM_USER2_EMAIL=$dsmUser2" >> playwright-env/envvars

# Additional DSM User (DSM general testing)
export dsmUser3=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[2] | .userName")
export dsmUser3Password=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[2] | .password")
echo "export DSM_USER3_PASSWORD=$dsmUser3Password" >> playwright-env/envvars
echo "export DSM_USER3_EMAIL=$dsmUser3" >> playwright-env/envvars

# Additional DSM User (DSM general testing)
export dsmUser4=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[3] | .userName")
export dsmUser4Password=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[3] | .password")
echo "export DSM_USER4_PASSWORD=$dsmUser4Password" >> playwright-env/envvars
echo "export DSM_USER4_EMAIL=$dsmUser4" >> playwright-env/envvars

# Additional DSM User (mr-view-permission.spec)
export dsmUser5=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[4] | .userName")
export dsmUser5Password=$(vault read --format=json secret/pepper/test/v1/e2e | jq -r ".data.users | .[] | select(.app==\"dsm\") | .users[4] | .password")
echo "export DSM_USER5_PASSWORD=$dsmUser5Password" >> playwright-env/envvars
echo "export DSM_USER5_EMAIL=$dsmUser5" >> playwright-env/envvars


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
