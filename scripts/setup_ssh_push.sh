#!/usr/bin/env bash
set -euo pipefail

REPO_SSH="git@github.com:konzooo/track-yo-lifts-pro.git"
BRANCH="main"
EMAIL="kons_k@hotmail.de"

# 1) Ensure SSH key exists
SSH_KEY="$HOME/.ssh/id_ed25519"
if [ ! -f "$SSH_KEY" ]; then
  mkdir -p "$HOME/.ssh"
  ssh-keygen -t ed25519 -C "$EMAIL" -f "$SSH_KEY" -N ""
  echo "Public key created at $SSH_KEY.pub. Add it to GitHub: https://github.com/settings/keys"
fi

# 2) Start ssh-agent and add key
if ! pgrep -u "$USER" ssh-agent >/dev/null 2>&1; then
  eval "$(ssh-agent -s)"
fi
if ! ssh-add -l >/dev/null 2>&1; then
  ssh-add "$SSH_KEY"
fi

# 3) Ensure remote is SSH
git remote set-url origin "$REPO_SSH" 2>/dev/null || git remote add origin "$REPO_SSH"

# 4) Push to GitHub
git fetch origin >/dev/null 2>&1 || true
git push -u origin "$BRANCH"

