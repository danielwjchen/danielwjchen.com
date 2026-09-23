#!/usr/bin/env bash
#
# Starts the site dev server under the Node version pinned by the root .nvmrc.
#
# WHY: the project builds with webpack 4 + webpack-dev-server 3, whose `spdy`
# dependency calls process.binding('http_parser') — removed in modern Node.
# `npm run develop` therefore only works on the legacy Node the project pins
# (v8.17.0). The Playwright *runner* runs on a modern node; only this dev
# server subprocess needs the legacy node, so we select it explicitly rather
# than relying on whatever `node` is first on PATH.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(tr -d '[:space:]' < "$ROOT/.nvmrc")"
NVM_ROOT="${NVM_DIR:-/usr/local/nvm}"
NODE_BIN_DIR="$NVM_ROOT/versions/node/$VERSION/bin"

if [ ! -x "$NODE_BIN_DIR/node" ]; then
  echo "[start-dev-server] node $VERSION not found at $NODE_BIN_DIR" >&2
  echo "[start-dev-server] Set NVM_DIR to your nvm root, or start the dev server" >&2
  echo "                  manually with the pinned node on PATH, e.g.:" >&2
  echo "    PATH=<path-to-node-$VERSION>/bin:\$PATH npm --prefix \"$ROOT\" run develop" >&2
  exit 1
fi

export PATH="$NODE_BIN_DIR:$PATH"
cd "$ROOT"
exec npm run develop
