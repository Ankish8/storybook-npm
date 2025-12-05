#!/bin/bash
set -e

echo "=== Claude Code Plugins Setup Script ==="
echo "This will install Claude Code plugins (skills, hooks, commands, agents)."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo "Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed.${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is required but not installed.${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}git is required but not installed.${NC}"; exit 1; }
echo -e "${GREEN}Prerequisites OK${NC}"

# Install Claude Code
echo ""
echo "Installing Claude Code..."
if ! command -v claude &> /dev/null; then
    npm install -g @anthropic-ai/claude-code
    echo -e "${GREEN}Claude Code installed${NC}"
else
    echo -e "${YELLOW}Claude Code already installed${NC}"
fi

# Add plugins marketplace
echo ""
echo "Adding official plugins marketplace..."
claude plugins:add https://github.com/anthropics/claude-code.git || true

# Install marketplace plugins
echo ""
echo "Installing marketplace plugins..."
claude plugins:install frontend-design || true
claude plugins:install hookify || true
claude plugins:install plugin-dev || true
echo -e "${GREEN}Marketplace plugins installed${NC}"

# Clone storybook-npm repo
echo ""
echo "Setting up storybook-npm repository..."
REPO_DIR="$HOME/Downloads/Code/npm/storybook-npm"
if [ ! -d "$REPO_DIR" ]; then
    mkdir -p "$HOME/Downloads/Code/npm"
    git clone https://github.com/Ankish8/storybook-npm.git "$REPO_DIR"
    cd "$REPO_DIR" && npm install
    echo -e "${GREEN}Repository cloned and dependencies installed${NC}"
else
    echo -e "${YELLOW}Repository already exists at $REPO_DIR${NC}"
    cd "$REPO_DIR" && git pull && npm install
fi

# Install local plugin
echo ""
echo "Installing local plugin (myoperator-publish)..."
claude plugins:install-local "$REPO_DIR" || true
echo -e "${GREEN}Local plugin installed${NC}"

# Verification
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Verifying installation..."
claude --version
echo ""
echo "Installed plugins:"
claude plugins:list 2>/dev/null || echo "(run 'claude plugins:list' to see plugins)"
echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "What's installed:"
echo "  - frontend-design (skill for UI/UX implementation)"
echo "  - hookify (create custom hooks from conversation)"
echo "  - plugin-dev (plugin development toolkit)"
echo "  - myoperator-publish (local: pre-push validation hook)"
echo ""
echo "Run 'claude' to start using Claude Code with your plugins!"
