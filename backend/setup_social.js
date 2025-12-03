const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config();

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69283bd60018f7ae198f')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const FRIENDS_COLLECTION_ID = 'friends';

async function setupSocialDB() {
  try {
    console.log('🏗️ Setting up Social DB...');

    // 1. Create Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        FRIENDS_COLLECTION_ID,
        'Friends',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log('✅ Created friends collection');
    } catch (e) {
      if (e.code === 409) console.log('ℹ️ Friends collection already exists');
      else throw e;
    }

    // 2. Create Attributes
    const attributes = [
      { key: 'user_id_1', type: 'string', size: 36, required: true },
      { key: 'user_id_2', type: 'string', size: 36, required: true },
      { key: 'status', type: 'string', size: 20, required: true }, // pending, accepted, blocked
    ];

    for (const attr of attributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          FRIENDS_COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`✅ Created attribute: ${attr.key}`);
      } catch (e) {
        if (e.code === 409) console.log(`ℹ️ Attribute ${attr.key} already exists`);
        else console.error(`❌ Error creating attribute ${attr.key}:`, e.message);
      }
    }

    // 3. Create Indexes
    try {
      await databases.createIndex(
        DATABASE_ID,
        FRIENDS_COLLECTION_ID,
        'idx_user_1',
        'key',
        ['user_id_1'],
        ['ASC']
      );
      console.log('✅ Created index: idx_user_1');
    } catch (e) {
      if (e.code === 409) console.log('ℹ️ Index idx_user_1 already exists');
    }

    try {
      await databases.createIndex(
        DATABASE_ID,
        FRIENDS_COLLECTION_ID,
        'idx_user_2',
        'key',
        ['user_id_2'],
        ['ASC']
      );
      console.log('✅ Created index: idx_user_2');
    } catch (e) {
      if (e.code === 409) console.log('ℹ️ Index idx_user_2 already exists');
    }

    console.log('🎉 Social DB Setup Complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupSocialDB();
