#!/usr/bin/env bash
#
# Starts the site dev server under the Node version pinned by the root .nvmrc.
#
# WHY: the Playwright runner and the dev server both need a modern Node, but the
# dev server must run the pinned version rather than whatever `node` is first
# on PATH, so this script selects it explicitly from the nvm install.
#
# .nvmrc may hold a major version (e.g. "24") or an exact one (e.g. "v24.21.0");
# a major version resolves to the newest matching installed release.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(tr -d '[:space:]' < "$ROOT/.nvmrc")"
NVM_ROOT="${NVM_DIR:-/usr/local/nvm}"
VERSION="${VERSION#v}"

NODE_BIN_DIR=""
if [ -x "$NVM_ROOT/versions/node/v$VERSION/bin/node" ]; then
  NODE_BIN_DIR="$NVM_ROOT/versions/node/v$VERSION/bin"
else
  BEST="$(ls -d "$NVM_ROOT/versions/node/v$VERSION".* 2>/dev/null | sort -V | tail -n 1 || true)"
  if [ -n "$BEST" ] && [ -x "$BEST/bin/node" ]; then
    NODE_BIN_DIR="$BEST/bin"
  fi
fi

if [ -z "$NODE_BIN_DIR" ]; then
  echo "[start-dev-server] node $VERSION not found under $NVM_ROOT/versions/node" >&2
  echo "[start-dev-server] Install it with nvm (e.g. 'nvm install $VERSION'), or" >&2
  echo "                  set NVM_DIR to your nvm root." >&2
  exit 1
fi

export PATH="$NODE_BIN_DIR:$PATH"
cd "$ROOT"
exec npm run develop
