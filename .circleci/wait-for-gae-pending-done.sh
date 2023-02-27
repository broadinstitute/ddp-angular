#!/bin/bash

set -x

GCLOUD_PROJECT="broad-ddp-$ENVIRONMENT"
gcloud config set project "$GCLOUD_PROJECT"

DEBIAN_FRONTEND=noninteractive

WAITFORGAE() {
  PENDING=$(gcloud app operations list --format=json --pending)
  echo $PENDING
  PENDING_OPERATION_COUNT=$(echo "$PENDING" | jq '. | length')

  echo "$PENDING_OPERATION_COUNT pending operations"
  if [[ $PENDING_OPERATION_COUNT -gt 0 ]]; then
    ID=$(echo "$PENDING" | jq '.[0].id' | tr -d '"')=
    echo "waiting for GAE operation $ID to finish"
    gcloud app operations wait "$ID"
    # Sleep up to 30 seconds
    sleep $(((RANDOM % 30) + 1))
    WAITFORGAE
  fi
}

# Invoke function
WAITFORGAE
