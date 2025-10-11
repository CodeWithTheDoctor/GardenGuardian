#!/bin/bash

# GardenGuardian AI - Git History Security Cleanup Script
# This script removes exposed API keys from git history

echo "🔐 GardenGuardian AI - Git History Security Cleanup"
echo "=================================================="
echo ""
echo "⚠️  WARNING: This will rewrite your git history!"
echo "⚠️  Make sure you have backups and coordinate with any collaborators!"
echo ""

# Check if BFG Repo-Cleaner is installed
if ! command -v bfg &> /dev/null; then
    echo "❌ BFG Repo-Cleaner not found. Installing..."
    
    # Check if Java is installed (required for BFG)
    if ! command -v java &> /dev/null; then
        echo "❌ Java not found. Please install Java first:"
        echo "   macOS: brew install openjdk"
        echo "   Ubuntu: sudo apt install openjdk-11-jdk"
        exit 1
    fi
    
    # Download BFG Repo-Cleaner
    echo "📥 Downloading BFG Repo-Cleaner..."
    curl -L -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
    echo "✅ BFG downloaded"
fi

echo ""
echo "🧹 Starting git history cleanup..."

# Create a file with the exposed API keys to remove
cat > keys-to-remove.txt << 'EOF'
[REDACTED_API_KEY]
EOF

# Run BFG to remove the keys
if command -v bfg &> /dev/null; then
    bfg --replace-text keys-to-remove.txt
else
    java -jar bfg.jar --replace-text keys-to-remove.txt
fi

# Clean up
rm keys-to-remove.txt

echo ""
echo "🧹 Cleaning up git repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Git history cleanup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Force push to remote: git push --force-with-lease origin main"
echo "2. Regenerate your compromised API keys"
echo "3. Update your .env.local file with new keys"
echo ""
echo "⚠️  IMPORTANT:"
echo "- All collaborators will need to re-clone the repository"
echo "- Any forks will still contain the old history"
echo "- Consider making the repository private temporarily"
