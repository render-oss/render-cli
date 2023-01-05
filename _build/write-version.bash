#! /bin/bash

ROOT=$(dirname "$0")
cd "$ROOT" || exit 6
cd .. || exit 7

SUFFIX="${1:-default}"

if [[ -d './.git' ]]; then
  VERSION="$(git describe --tags)"
else
  VERSION="nogit"
fi

echo "export const VERSION = '$VERSION-$SUFFIX' as const;"
