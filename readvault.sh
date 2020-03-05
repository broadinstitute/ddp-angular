#!/usr/bin/env bash
if [ "$1" == "" ]  ||  [ "$2" == "" ];
then
	echo "USAGE: readvault.sh vaultkey propertypath"
	echo "EXAMPLE: readvault.sh secret/pepper/dev/v1/conf .data.gcp.serviceKey.token_uri"
	exit 1
fi
vault read -format=json $1 | jq -r $2
