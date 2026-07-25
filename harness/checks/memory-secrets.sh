#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

[ -d .memsearch/memory ] || exit 0
SECRET_PATTERN='-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{20,}'
if grep -EnR --include='*.md' -- "$SECRET_PATTERN" .memsearch/memory; then
  echo "Potential secret found in shared memory. Remove and rotate it before committing."
  exit 1
fi
