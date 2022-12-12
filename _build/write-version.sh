#! /bin/sh

if [ "$1" != '' ]
then
  SUFFIX="-$1"
fi

echo "export const VERSION = '$(git describe --tags)$SUFFIX' as const;"
