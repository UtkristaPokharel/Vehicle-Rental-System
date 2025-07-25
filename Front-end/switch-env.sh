#!/bin/bash

# Environment Switcher Script for Vehicle Rental System
# Usage: ./switch-env.sh [dev|prod]

CONFIG_FILE="src/config/api.js"
DEV_URL="http://localhost:3001"
PROD_URL="https://vehicle-rental-system-rjvj.onrender.com"

if [ "$1" = "dev" ]; then
    echo "Switching to development environment..."
    sed -i '' "s|export const API_BASE_URL = '.*';|export const API_BASE_URL = '$DEV_URL';|" $CONFIG_FILE
    echo "✅ API_BASE_URL set to: $DEV_URL"
elif [ "$1" = "prod" ]; then
    echo "Switching to production environment..."
    sed -i '' "s|export const API_BASE_URL = '.*';|export const API_BASE_URL = '$PROD_URL';|" $CONFIG_FILE
    echo "✅ API_BASE_URL set to: $PROD_URL"
else
    echo "Usage: ./switch-env.sh [dev|prod]"
    echo ""
    echo "Current configuration:"
    grep "API_BASE_URL" $CONFIG_FILE
fi
