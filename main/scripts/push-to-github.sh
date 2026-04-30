#!/usr/bin/env bash
# push-to-github.sh
# Pushes the Fieldspend repo to the external GitHub remote.
# Usage: bash scripts/push-to-github.sh

set -e

REMOTE_NAME="github"
REMOTE_URL="https://github.com/thedivine1/Fieldspend.git"
BRANCH="main"
COMMIT_MSG="fix: update onboarding text to 5 receipts free + open beta till 31st July 26, change support email to touchport.llp@gmail.com, remove caffeine.ai attribution from settings"

echo "➤  Checking git remote..."
if git remote get-url "$REMOTE_NAME" &>/dev/null; then
  echo "    Remote '$REMOTE_NAME' already exists — updating URL."
  git remote set-url "$REMOTE_NAME" "$REMOTE_URL"
else
  echo "    Adding remote '$REMOTE_NAME' → $REMOTE_URL"
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
fi

echo "➤  Staging all changes..."
git add -A

echo "➤  Committing..."
if git diff --cached --quiet; then
  echo "    Nothing new to commit — working tree clean."
else
  git commit -m "$COMMIT_MSG"
fi

echo "➤  Pushing to GitHub ($REMOTE_NAME/$BRANCH)..."
git push "$REMOTE_NAME" "$BRANCH" --force

echo "✅  Done! Code pushed to https://github.com/thedivine1/Fieldspend"
