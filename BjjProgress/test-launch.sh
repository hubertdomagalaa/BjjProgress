#!/bin/bash

# BJJ Progress - Pre-Launch Testing Script
# This script tests ALL critical functionality before app store deployment

echo "🚀 BJJ Progress Pre-Launch Test Suite"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0.32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
WARNINGS=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

test_warning() {
    echo -e "${YELLOW}⚠️  WARNING${NC}: $1"
    ((WARNINGS++))
}

echo "📋 PHASE 1: Environment Variables Check"
echo "----------------------------------------"

# Check frontend .env
if [ -f ".env" ]; then
    test_result 0 "Frontend .env file exists"
    
    # Check each required variable
    if grep -q "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env; then
        if grep "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env | grep -q "pk_"; then
            test_result 0 "Stripe publishable key found"
        else
            test_result 1 "Stripe publishable key missing or invalid"
        fi
    else
        test_result 1 "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY not set"
    fi
    
    if grep -q "EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=" .env; then
        if grep "EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=" .env | grep -q "price_"; then
            test_result 0 "Stripe price ID found"
        else
            test_result 1 "Stripe price ID missing or invalid"
        fi
    else
        test_result 1 "EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID not set"
    fi
    
    if grep -q "EXPO_PUBLIC_BACKEND_URL=" .env; then
        BACKEND_URL=$(grep "EXPO_PUBLIC_BACKEND_URL=" .env | cut -d '=' -f2)
        echo "Backend URL: $BACKEND_URL"
        test_result 0 "Backend URL found"
    else
        test_result 1 "EXPO_PUBLIC_BACKEND_URL not set"
    fi
else
    test_result 1 "Frontend .env file not found"
fi

echo ""
echo "📋 PHASE 2: Backend Connectivity Test"
echo "--------------------------------------"

# Test backend is alive
if [ ! -z "$BACKEND_URL" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        test_result 0 "Backend is reachable ($HTTP_CODE)"
        
        # Get backend response
        RESPONSE=$(curl -s "$BACKEND_URL/")
        echo "Backend says: $RESPONSE"
    else
        test_result 1 "Backend not reachable (HTTP $HTTP_CODE)"
        test_warning "Deploy backend to Vercel first!"
    fi
else
    test_result 1 "Cannot test backend - URL not set"
fi

echo ""
echo "📋 PHASE 3: Dependencies Check"
echo "-------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    test_result 0 "node_modules directory exists"
else
    test_result 1 "node_modules not found - run 'npm install'"
fi

# Check critical packages
if [ -f "package.json" ]; then
    if grep -q "@stripe/stripe-react-native" package.json; then
        test_result 0 "Stripe SDK installed"
    else
        test_result 1 "Stripe SDK not installed"
    fi
    
    if grep -q "expo-haptics" package.json; then
        test_result 0 "Haptics installed"
    else
        test_warning "Haptics package not found"
    fi
fi

echo ""
echo "📋 PHASE 4: Build Configuration"
echo "--------------------------------"

# Check app.json for required fields
if [ -f "app.json" ]; then
    test_result 0 "app.json exists"
    
    # Check for bundle ID (iOS)
    if grep -q "bundleIdentifier" app.json; then
        BUNDLE_ID=$(grep "bundleIdentifier" app.json | cut -d '"' -f4)
        echo "iOS Bundle ID: $BUNDLE_ID"
        test_result 0 "iOS Bundle ID configured"
    else
        test_result 1 "iOS Bundle ID not set"
    fi
    
    # Check for package name (Android)
    if grep -q "package" app.json; then
        PACKAGE=$(grep "package" app.json | head -1 | cut -d '"' -f4)
        echo "Android Package: $PACKAGE"
        test_result 0 "Android package configured"
    else
        test_result 1 "Android package not set"
    fi
else
    test_result 1 "app.json not found"
fi

echo ""
echo "📋 PHASE 5: Payment Flow Readiness"
echo "------------------------------------"

# Check PaywallScreen exists
if [ -f "src/screens/PaywallScreen.tsx" ]; then
    test_result 0 "PaywallScreen component exists"
    
    # Check if it's using correct backend URL
    if grep -q "EXPO_PUBLIC_BACKEND_URL" src/screens/PaywallScreen.tsx; then
        test_result 0 "PaywallScreen uses environment variable"
    else
        test_warning "PaywallScreen might have hardcoded URL"
    fi
else
    test_result 1 "PaywallScreen not found"
fi

# Check AuthContext has trial logic
if [ -f "src/context/AuthContext.tsx" ]; then
    if grep -q "7 days" src/context/AuthContext.tsx || grep -q "7-day" src/context/AuthContext.tsx; then
        test_result 0 "7-day trial configured in AuthContext"
    else
        test_warning "Trial duration might not be 7 days"
    fi
fi

echo ""
echo "📊 TEST SUMMARY"
echo "==============="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CRITICAL TESTS PASSED!${NC}"
    echo ""
    echo "📱 Next Steps:"
    echo "1. Test payment manually in app (use test card: 4242 4242 4242 4242)"
    echo "2. Verify webhook works in Stripe Dashboard"
    echo "3. Build for iOS: eas build --platform ios"
    echo "4. Build for Android: eas build --platform android"
    echo "5. Submit to App Store & Google Play"
    echo ""
    echo "💰 Ready to launch and start earning!"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "🔧 Fix the failed tests before deploying!"
    echo "Check the errors above and resolve them."
    exit 1
fi
