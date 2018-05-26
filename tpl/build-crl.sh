#!/bin/sh

# revoke a certificate, regenerate CRL,
# and verify revocation

if [ -z "$KEY_DIR" ]; then
  echo 'Please source the vars script first (i.e. "source ./vars")'
  exit 1
fi

CRL="crl.pem"

cd "$KEY_DIR"
# set defaults
export KEY_CN=""
export KEY_OU=""
export KEY_NAME=""
# required due to hack in openssl.cnf that supports Subject Alternative Names
export KEY_ALTNAMES=""
# generate a new CRL -- try to be compatible with
# intermediate PKIs
$OPENSSL ca -gencrl -out "$CRL" -config "$KEY_CONFIG"
