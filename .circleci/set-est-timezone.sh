#!/usr/bin/env bash

rm /etc/timezone
rm /etc/localtime

TIMEZONE="America/New_York"      
export TZ="$TIMEZONE"
echo "$TIMEZONE" > /etc/timezone                     
cp "/usr/share/zoneinfo/${TIMEZONE}" /etc/localtime 
dpkg-reconfigure -f noninteractive tzdata
