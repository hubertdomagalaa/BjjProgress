require('dotenv').config();
const { Client, Users } = require('node-appwrite');

// Initialize Appwrite Admin Client
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69283bd60018f7ae198f') // Project ID from index.js
  .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

const email = process.argv[2];

if (!email) {
  console.log('\n❌ Please provide an email address.');
  console.log('Usage: node grant_pro.js user@example.com\n');
  process.exit(1);
}

async function grantLifetimePro() {
  try {
    console.log(`\n🔍 Searching for user: ${email}...`);
    
    // Find user by email
    const userList = await users.list([
      `email=${email}` // Using query syntax directly supported by some SDK versions or fallback
    ]);
    
    // Note: node-appwrite list() usually takes queries array. 
    // If exact match fails, we'll try to iterate.
    // Let's try the standard Query way if possible, but for simplicity in this script:
    // We will just list and filter if needed, but 'list' usually returns all or paginated.
    // Better approach with newer SDK:
    // const { Query } = require('node-appwrite');
    // await users.list([Query.equal('email', email)]);
    
    // Re-initializing with Query if available in the installed version
    // But to be safe and dependency-free, let's just use the basic list and find.
    
    const allUsers = await users.list();
    const user = allUsers.users.find(u => u.email === email);

    if (!user) {
      console.log('❌ User not found! Make sure you registered in the app first.');
      return;
    }

    console.log(`✅ Found user: ${user.$id} (${user.name})`);
    console.log('🔄 Granting LIFETIME PRO status...');

    // Update Preferences
    await users.updatePrefs(user.$id, {
      ...user.prefs,
      subscription_tier: 'pro',
      subscription_status: 'lifetime',
      subscription_end_date: '2099-12-31T23:59:59.999Z',
      subscription_renewal_date: '2099-12-31T23:59:59.999Z',
      is_lifetime: true
    });

    console.log('\n🎉 SUCCESS! User now has LIFETIME PRO access.');
    console.log('📅 Expires: Dec 31, 2099');
    console.log('👉 Restart the app to see changes.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

grantLifetimePro();
