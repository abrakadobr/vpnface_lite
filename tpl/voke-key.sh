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
NLINE=`grep -n "/CN=$1/" $KEYS_INDEX`
LINE=`grep "/CN=$1/" $KEYS_INDEX`
LINE_NUM=`echo $NLINE | cut -f1 -d:`
COLS_NUM=`echo $LINE | awk -F' ' '{print NF;}'`

echo $COLS_NUM

if [[ $COLS_NUM -eq 6 ]] && [[ $LINE == R* ]]; then
  COL2=`echo $NLINE | awk '{print $2}'`
  COL4=`echo $NLINE | awk '{print $4}'`
  COL5=`echo $NLINE | awk '{print $5}'`
  COL6=`echo $NLINE | awk '{print $6}'`
  echo -e "V\t$COL2\t\t$COL4\t$COL5\t$COL6" >> $KEYS_INDEX
  sed -i "${LINE_NUM}d" $KEYS_INDEX
  ./build-crl
  echo "Certificate unrevoked successfully."
  exit 0;
elif [[ $COLS_NUM -eq 5 ]] && [[ $LINE == V* ]]; then
  echo "Certificate is already unrevoked and active"
  exit 0;
else
  echo "Error; Key index file may be corrupted."
  exit 1;
fi
