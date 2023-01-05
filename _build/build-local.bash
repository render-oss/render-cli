#! /bin/bash
# This script is a little easier than trying to do it
# all in a Makefile. It handles Deno-specific build arguments
# and dumps the compiled binary in `./out/render`.

SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

OS_IMPL=$(uname -s)
MACHINE=$(uname -m)

dispatch_build() {
  cd "$(dirname "$(dirname "$0")")" || exit 1

  MAKE_TARGET="build-$1-$2"

  export OUTDIR="$ROOT_DIR/bin"
  mkdir -p "$OUTDIR"
  export OUTFILE="render"

  [ -f "${OUTDIR}"/"${OUTFILE}" ] && rm "${OUTDIR}"/"${OUTFILE}"
  make "${MAKE_TARGET}"
}

case "$OS_IMPL" in
  "Linux")
    case "$MACHINE" in
      "x86_64")
        dispatch_build "linux" "x86_64"
      ;;
      
      *)
        echo "Unsupported ${OS_IMPL} implementation: ${MACHINE}"
        exit 1
      ;;
    esac
  ;;
  "Darwin")
      case "$MACHINE" in
      "x86_64")
        dispatch_build "macos" "x86_64"
      ;;

      "arm64")
        dispatch_build "macos" "aarch64"
      ;;
      
      *)
        echo "Unsupported ${OS_IMPL} implementation: ${MACHINE}"
        exit 1
      ;;
    esac
  ;;

  *)
    echo "Unsupported OS implementation: ${OS_IMPL}"
    exit 1
  ;;
esac
