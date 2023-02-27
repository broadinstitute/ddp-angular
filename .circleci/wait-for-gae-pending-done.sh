#!/bin/bash
# https://gist.github.com/RayBB/0b442641ad740701ef5c96f5f9ef9dd9
set -x

GCLOUD_PROJECT="broad-ddp-$ENVIRONMENT"
gcloud config set project "$GCLOUD_PROJECT"

WAIT_FOR_GAE() {
  PENDING=$(gcloud app operations list --format=json --pending)
  PENDING_OPERATION_COUNT=$(echo "$PENDING" | jq '. | length')

  echo "$PENDING_OPERATION_COUNT pending operations"
  if [[ $PENDING_OPERATION_COUNT -gt 0 ]]; then
    ID=$(echo "$PENDING" | jq '.[0].id' | tr -d '"')=
    echo "waiting for GAE operation $ID to finish"
    gcloud app operations wait "$ID"
    # Sleep up to 30 seconds
    sleep $(((RANDOM % 30) + 1))
    WAIT_FOR_GAE
  fi
}

# Invoke function
WAIT_FOR_GAE
