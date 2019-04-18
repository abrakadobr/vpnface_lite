#!/bin/bash

if [ $# -ne 1 ]; then
  echo "usage: revoke.sh <cert-name-base>";
  exit 1
fi

{
  sleep 3
  echo kill $1
  sleep 3
  echo exit
} | telnet localhost #MPORT
