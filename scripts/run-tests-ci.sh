#!/usr/bin/env bash
# CI entrypoint: PLATFORM + SUITE + ENV (from GitHub Actions, Jenkins, or local shell).
set -euo pipefail

PLATFORM=""
SUITE=""
RETRIES="${RETRIES:-0}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --platform=*)
      PLATFORM="${1#*=}"
      shift
      ;;
    --platform)
      PLATFORM="${2:-}"
      shift 2
      ;;
    --project=*)
      PLATFORM="${1#*=}"
      shift
      ;;
    --project)
      PLATFORM="${2:-}"
      shift 2
      ;;
    --suite=*)
      SUITE="${1#*=}"
      shift
      ;;
    --suite)
      SUITE="${2:-}"
      shift 2
      ;;
    --retries=*)
      RETRIES="${1#*=}"
      shift
      ;;
    --retries)
      RETRIES="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$PLATFORM" || -z "$SUITE" ]]; then
  echo "Usage: $0 --platform <b2b|greenpan|b2c|webform> --suite <smoke|regression|e2e> [--retries <n>]" >&2
  exit 1
fi

export ENV="${ENV:-dev}"

PLATFORM_DIR="tests/${PLATFORM}"
SUITE_DIR="${PLATFORM_DIR}/${SUITE}"
ARGS=(--project="${PLATFORM}" --retries="${RETRIES}")

if [[ -d "$SUITE_DIR" ]]; then
  ARGS+=("$SUITE_DIR")
elif [[ -d "$PLATFORM_DIR" ]]; then
  ARGS+=("$PLATFORM_DIR")
  ARGS+=(--grep "@${SUITE}")
else
  ARGS+=(--grep "@${SUITE}")
fi

exec npx playwright test "${ARGS[@]}"
