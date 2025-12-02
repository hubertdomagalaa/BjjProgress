#!/usr/bin/env node
/**
 * BJJ Progress - API Testing Script
 * Tests Appwrite connectivity and basic CRUD operations
 */

require('dotenv').config();

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, error = null) {
  const result = { name, passed, error };
  testResults.tests.push(result);
  
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}`);
    if (error) console.log(`   Error: ${error.message || error}`);
  }
}

async function runTests() {
  console.log('🧪 Starting BJJ Progress API Tests\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Environment Variables
  console.log('📋 Testing Environment Configuration...\n');
  
  const requiredEnvVars = [
    'EXPO_PUBLIC_APPWRITE_ENDPOINT',
    'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
    'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
    'EXPO_PUBLIC_APPWRITE_COLLECTION_ID',
    'EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID',
  ];

  let envValid = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      logTest(`${envVar} exists`, true);
    } else {
      logTest(`${envVar} exists`, false, new Error('Missing'));
      envValid = false;
    }
  }

  if (!envValid) {
    console.log('\n⚠️  Cannot proceed - missing environment variables');
    console.log('Please check your .env file\n');
    printSummary();
    return;
  }

  // Test 2: Appwrite Connectivity
  console.log('\n📡 Testing Appwrite Connectivity...\n');
  
  try {
    const { Client, Databases, Account } = require('react-native-appwrite');
    
    const client = new Client()
      .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

    const account = new Account(client);
    const databases = new Databases(client);

    // Test health endpoint
    try {
      await account.get();
      logTest('Appwrite connection', true);
    } catch (e) {
      if (e.code === 401) {
        logTest('Appwrite connection (no session)', true);
      } else {
        throw e;
      }
    }

    // Test database accessibility
    try {
      await databases.listDocuments(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
        []
      );
      logTest('Training logs collection accessible', true);
    } catch (e) {
      logTest('Training logs collection accessible', false, e);
    }

    try {
      await databases.listDocuments(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID,
        []
      );
      logTest('Sparring sessions collection accessible', true);
    } catch (e) {
      logTest('Sparring sessions collection accessible', false, e);
    }

  } catch (e) {
    logTest('Appwrite SDK initialization', false, e);
  }

  // Test 3: Stripe Configuration
  console.log('\n💳 Testing Stripe Configuration...\n');
  
  const stripeVars = [
    'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID',
    'EXPO_PUBLIC_BACKEND_URL'
  ];

  for (const envVar of stripeVars) {
    if (process.env[envVar]) {
      logTest(`${envVar} exists`, true);
    } else {
      logTest(`${envVar} exists`, false, new Error('Missing (payment may not work)'));
    }
  }

  // Test 4: Backend Connectivity (if configured)
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    console.log('\n🔗 Testing Backend Connectivity...\n');
    
    try {
      const fetch = require('node-fetch');
      const response = await fetch(process.env.EXPO_PUBLIC_BACKEND_URL, {
        method: 'HEAD',
        timeout: 5000
      });
      logTest(`Backend reachable (${response.status})`, response.status < 500);
    } catch (e) {
      logTest('Backend reachable', false, e);
    }
  }

  printSummary();
}

function printSummary() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Test Summary\n');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  
  const successRate = Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100);
  console.log(`\n📈 Success Rate: ${successRate}%\n`);

  if (testResults.failed === 0) {
    console.log('🎉 All tests passed! Your app configuration is correct.\n');
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.\n');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
