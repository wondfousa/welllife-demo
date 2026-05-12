#!/usr/bin/env bash
# ============================================================
# sync-and-build.sh
# Mac-side helper: pull latest code, install deps, sync Capacitor,
# update CocoaPods, and optionally open Xcode / Android Studio.
#
# Usage:
#   ./scripts/sync-and-build.sh             # pull + install + sync (no open)
#   ./scripts/sync-and-build.sh ios         # ...then open Xcode
#   ./scripts/sync-and-build.sh android     # ...then open Android Studio
#   ./scripts/sync-and-build.sh both        # open both
#
# Run from the project root:
#   cd ~/Developer/welllife-care
#   ./scripts/sync-and-build.sh ios
# ============================================================

set -e   # exit on any error

# ---- Colors for readable output ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # no color

log()  { echo -e "${BLUE}▶${NC} ${BOLD}$1${NC}"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
err()  { echo -e "${RED}✗${NC} $1"; }

# ---- Sanity checks ----
if [ ! -f "capacitor.config.json" ]; then
  err "capacitor.config.json not found. Run this script from the project root."
  exit 1
fi

PLATFORM="${1:-none}"   # default: don't open anything

# ============================================================
# Step 1: pull latest from git
# ============================================================
log "Pulling latest changes from git..."
if git diff-index --quiet HEAD --; then
  git pull --ff-only
  ok "Repo is up to date."
else
  warn "You have uncommitted local changes. Stashing them temporarily."
  git stash push -u -m "sync-and-build auto-stash $(date +%s)"
  git pull --ff-only
  warn "Reapplying your stashed changes..."
  git stash pop || warn "Stash pop had conflicts — resolve manually."
fi

# ============================================================
# Step 2: install npm dependencies if package.json changed
# ============================================================
log "Checking npm dependencies..."
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  log "Installing npm packages..."
  npm install
  ok "npm dependencies installed."
else
  ok "npm dependencies already up to date."
fi

# ============================================================
# Step 3: Capacitor sync (copies www/ into ios/ and android/)
# ============================================================
log "Running Capacitor sync..."
npx cap sync
ok "Capacitor sync complete."

# ============================================================
# Step 4: CocoaPods for iOS
# ============================================================
if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "both" ]; then
  if [ -d "ios/App" ]; then
    log "Updating CocoaPods for iOS..."
    cd ios/App

    if ! command -v pod &> /dev/null; then
      err "CocoaPods not installed. Run: sudo gem install cocoapods  (or: brew install cocoapods)"
      exit 1
    fi

    pod install
    cd ../..
    ok "CocoaPods up to date."
  else
    warn "ios/App not found, skipping pod install."
  fi
fi

# ============================================================
# Step 5: open IDEs
# ============================================================
case "$PLATFORM" in
  ios)
    log "Opening Xcode..."
    npx cap open ios
    ;;
  android)
    log "Opening Android Studio..."
    npx cap open android
    ;;
  both)
    log "Opening Xcode and Android Studio..."
    npx cap open ios
    npx cap open android
    ;;
  none)
    ok "Done. Run again with 'ios', 'android', or 'both' to open an IDE."
    ;;
  *)
    warn "Unknown platform: $PLATFORM (use ios / android / both)"
    ;;
esac

echo ""
ok "${BOLD}All set.${NC} Next steps:"
echo "  • iOS:     in Xcode → Product → Archive → Distribute → App Store Connect"
echo "  • Android: in Android Studio → Build → Generate Signed Bundle / APK"
