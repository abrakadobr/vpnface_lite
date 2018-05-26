#!/bin/bash

if [ $# -ne 1 ]; then
  echo "usage: voke-key <cert-name-base>";
  exit 1
fi
if [ -z "$KEY_DIR" ]; then
  echo 'Please source the vars script first (i.e. "source ./vars")'
  exit 1
fi

KEYS_INDEX=$KEY_DIR/index.txt
LINE=`grep "/CN=$1/" $KEYS_INDEX`
COLS_NUM=`echo $LINE | awk -F' ' '{print NF;}'`

echo $COLS_NUM

if [[ $COLS_NUM -eq 5 ]] && [[ $LINE == V* ]]; then

  ./revoke-full $1
  {
    sleep 3
    echo kill $1
    sleep 3
    echo exit
  } | telnet localhost #MPORT
  echo "Certificate revoked successfully."
  exit 0;
elif [[ $COLS_NUM -eq 6 ]] && [[ $LINE == R* ]]; then
  echo "Client certificate is already revoked."
  exit 0;
else
  echo "Error; Key index file may be corrupted."
  exit 1;
fi
