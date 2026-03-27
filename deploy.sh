#!/bin/bash

# ─────────────────────────────────────────────
#  ShotsByVishal — One Command Deploy Script
#  Usage: bash deploy.sh
# ─────────────────────────────────────────────

set -e

REPO="https://github.com/sridhargb26/shotsbyvishal-portfolio.git"
BRANCH="main"

echo ""
echo "🎞  ShotsByVishal Deploy Script"
echo "────────────────────────────────"

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing git..."
  git init
  git remote add origin $REPO
fi

# Check if remote already exists, if not add it
if ! git remote | grep -q "origin"; then
  git remote add origin $REPO
fi

# Ask for GitHub token
echo ""
echo "🔑 Enter your GitHub Personal Access Token:"
read -s TOKEN
echo ""

# Set remote URL with token
git remote set-url origin https://sridhargb26:$TOKEN@github.com/sridhargb26/shotsbyvishal-portfolio.git

# Stage all files
echo "📂 Staging all files..."
git add .

# Commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
git commit -m "🚀 Update — $TIMESTAMP" 2>/dev/null || echo "✅ Nothing new to commit"

# Push
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Code pushed to GitHub."
echo "🌐 View repo: https://github.com/sridhargb26/shotsbyvishal-portfolio"
echo ""
echo "🚀 If connected to Vercel, your site will auto-deploy in ~1 minute!"
echo ""
