#!/bin/bash
# Link Testing Script for Bridgeworld.lol
# Tests all external links in the HTML files

echo "🔗 Testing Bridgeworld.lol links..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extract all URLs from HTML files
URLS=$(grep -roh 'https\?://[^"'"'"' ]*' *.html | sort -u)

TOTAL=0
SUCCESS=0
FAILED=0
SKIPPED=0

for url in $URLS; do
    TOTAL=$((TOTAL + 1))
    
    # Skip font URLs and known working services
    if [[ $url == *"fonts.googleapis.com"* ]] || [[ $url == *"fonts.gstatic.com"* ]]; then
        echo -e "${YELLOW}⏭️  SKIP:${NC} $url (font service)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    # Test the URL
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✅ OK${NC}   [$HTTP_CODE] $url"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} [$HTTP_CODE] $url"
        FAILED=$((FAILED + 1))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Results:"
echo "   Total:   $TOTAL"
echo -e "   ${GREEN}Success: $SUCCESS${NC}"
echo -e "   ${RED}Failed:  $FAILED${NC}"
echo -e "   ${YELLOW}Skipped: $SKIPPED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "⚠️  Some links failed. Check the URLs above."
    exit 1
else
    echo "✅ All tested links are working!"
    exit 0
fi
