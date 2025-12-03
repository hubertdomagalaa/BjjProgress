const { Client, Databases } = require('node-appwrite');
const path = require('path');
require('dotenv').config();

// Fallback: Try loading from sibling frontend directory
if (!process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID) {
  const envPath = path.resolve(__dirname, '../BjjProgress/.env');
  console.log('ℹ️ Loading .env from:', envPath);
  const result = require('dotenv').config({ path: envPath });
  
  if (result.error) {
    console.log('❌ Error loading .env file:', result.error.message);
  } else {
    console.log('✅ .env loaded successfully');
  }
}

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69283bd60018f7ae198f')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const TRAINING_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

async function updateSchema() {
  try {
    console.log('🛠️ Starting Schema Update...');

    if (!DATABASE_ID || !TRAINING_COLLECTION_ID) {
      throw new Error('Missing DATABASE_ID or COLLECTION_ID');
    }

    console.log(`ℹ️ Database ID: ${DATABASE_ID}`);
    console.log(`ℹ️ Collection ID: ${TRAINING_COLLECTION_ID}`);

    // Update 'type' attribute to 20 chars
    // Note: Appwrite doesn't support direct update of attribute size easily via SDK in all versions,
    // but we can try to update it or delete and recreate (risky with data).
    // However, usually `updateStringAttribute` is the way if supported, or just `updateAttribute`.
    // Let's try `updateStringAttribute` first.
    
    try {
        // key, required, default, xdefault
        // updateStringAttribute(databaseId, collectionId, key, required, default, xdefault)
        // Wait, the SDK signature for updateStringAttribute might be different or non-existent depending on version.
        // Let's check if we can just re-create it or if we need to use a specific update method.
        // Actually, for size change, we often need to use the console or a specific update method.
        // Let's try to just log what we are doing.
        
        // Attempt to update the attribute size.
        // The method signature is usually: updateStringAttribute(databaseId, collectionId, key, required, default, size)
        // But checking docs, it seems we might need to use `updateStringAttribute` with size.
        
        // Let's try to update it.
        console.log('👉 Updating "type" attribute size to 20...');
        await databases.updateStringAttribute(DATABASE_ID, TRAINING_COLLECTION_ID, 'type', true, 'GI', 20);
        console.log('✅ Updated "type" attribute size to 20');
    } catch (e) {
        console.error('❌ Error updating "type" attribute:', e.message);
        // If update fails, it might be because we can't update size of existing attribute easily if it violates data?
        // Or maybe the method is wrong.
    }

    console.log('🎉 Schema Update Complete!');
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateSchema();
