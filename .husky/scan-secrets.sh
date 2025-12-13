#!/bin/sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${YELLOW}Running secret scan...${NC}"

# 1. Block specific filenames
# Loop through staged files
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo "${GREEN}No staged files to scan.${NC}"
    exit 0
fi

# Forbidden file list
for FILE in $STAGED_FILES; do
    BASENAME=$(basename "$FILE")
    case "$BASENAME" in
        .env|.env.local|.env.production|.env.development|.DS_Store|id_rsa|id_rsa.pub)
            echo "${RED}ERROR: Attempting to commit forbidden file: $FILE${NC}"
            echo "Please remove this file from git (git rm --cached $FILE) and add it to .gitignore."
            exit 1
            ;;
    esac
done

# 2. Scan content for patterns using git grep on all staged files
PROBLEMS=0

check_pattern() {
    # Handle optional flags like -e
    local OPT=""
    if [ "$1" = "-e" ]; then
        OPT="-e"
        shift
    fi
    PATTERN=$1
    DESC=$2

    # We grep all staged files (--cached)
    # Use -e explicit pattern flag if provided or implied
    if [ -n "$OPT" ]; then
         MATCHES=$(git grep -E -I -n --cached -e "$PATTERN")
    else
         MATCHES=$(git grep -E -I -n --cached "$PATTERN")
    fi


    if [ ! -z "$MATCHES" ]; then
        echo "${RED}POSSIBLE SECRET FOUND ($DESC):${NC}"
        echo "$MATCHES"
        PROBLEMS=1
    fi
}

# AWS Patterns
check_pattern "(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}" "AWS Access Key"

# Private Keys
check_pattern -e "-----BEGIN [A-Z ]+ PRIVATE KEY-----" "Private Key"


# Stripe
check_pattern "sk_live_[0-9a-zA-Z]{24}" "Stripe Secret Key"

# OpenAI
check_pattern "sk-[a-zA-Z0-9]{48}" "OpenAI API Key"

# Google (AIza)
check_pattern "AIza[0-9A-Za-z_-]{35}" "Google API Key"

if [ $PROBLEMS -eq 1 ]; then
    echo ""
    echo "${RED}*** COMMIT REJECTED ***${NC}"
    echo "Potential secrets were found in your commit."
    exit 1
fi

echo "${GREEN}Secret scan passed.${NC}"
exit 0
