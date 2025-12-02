// Quick script to grant PRO subscription via Appwrite API
const { Client, Account } = require('node-appwrite');

const client = new Client();



client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('692851cd0017043e0d61')
  .setKey(process.env.APPWRITE_API_KEY || 'PASTE_YOUR_APPWRITE_API_KEY_HERE');

const account = new Account(client);

async function grantPRO(userId) {
  try {
    console.log(`🔄 Granting PRO to user: ${userId}...`);
    
    // Update user preferences with PRO subscription
    const result = await account.updatePrefs(userId, {
      subscription_tier: 'pro',
      subscription_status: 'active',
      subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      trial_end_date: null // Clear trial
    });
    
    console.log('✅ PRO subscription granted!');
    console.log('User prefs updated:', result.prefs);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Your user ID
const USER_ID = '692e5bd54d25ab3bf17'; // hubertdomagala@gmail.com

grantPRO(USER_ID);
