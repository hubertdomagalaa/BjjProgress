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

console.log('DEBUG: DATABASE_ID:', process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID);
console.log('DEBUG: COLLECTION_ID:', process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID);
console.log('DEBUG: SPARRING_COLLECTION_ID:', process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID);

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('69283bd60018f7ae198f')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const TRAINING_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const SPARRING_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID;

async function setupCompetitionDB() {
  try {
    console.log('🏆 Setting up Competition DB...');

    // 0. Use IDs from Environment or Defaults (from screenshot)
    let trainingId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || 'training_logs';
    let sparringId = process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID || 'sparring_sessions';

    console.log(`ℹ️ Using Training ID: ${trainingId}`);
    console.log(`ℹ️ Using Sparring ID: ${sparringId}`);

    if (!DATABASE_ID) {
      throw new Error('Missing DATABASE_ID');
    }

    // 1. Add Attributes to Training Logs
    console.log('👉 Updating Training Logs Collection...');
    try { await databases.createStringAttribute(DATABASE_ID, trainingId, 'tournament_name', 100, false); console.log('✅ Created attribute: tournament_name'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute tournament_name already exists`); else console.error(`❌ Error creating attribute tournament_name:`, e.message); }
    try { await databases.createStringAttribute(DATABASE_ID, trainingId, 'weight_class', 50, false); console.log('✅ Created attribute: weight_class'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute weight_class already exists`); else console.error(`❌ Error creating attribute weight_class:`, e.message); }
    try { await databases.createStringAttribute(DATABASE_ID, trainingId, 'location', 100, false); console.log('✅ Created attribute: location'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute location already exists`); else console.error(`❌ Error creating attribute location:`, e.message); }
    // NEW: Competition Style (GI / NO-GI)
    try { await databases.createStringAttribute(DATABASE_ID, trainingId, 'competition_style', 20, false); console.log('✅ Created attribute: competition_style'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute competition_style already exists`); else console.error(`❌ Error creating attribute competition_style:`, e.message); }

    // 2. Add Attributes to Sparring (Matches)
    console.log('👉 Updating Sparring (Matches) Collection...');
    try { await databases.createBooleanAttribute(DATABASE_ID, sparringId, 'is_competition_match', false, false); console.log('✅ Created attribute: is_competition_match'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute is_competition_match already exists`); else console.error(`❌ Error creating attribute is_competition_match:`, e.message); }
    try { await databases.createEnumAttribute(DATABASE_ID, sparringId, 'result', ['win', 'loss', 'draw'], false); console.log('✅ Created attribute: result'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute result already exists`); else console.error(`❌ Error creating attribute result:`, e.message); }
    try { await databases.createEnumAttribute(DATABASE_ID, sparringId, 'method', ['submission', 'points', 'decision', 'dq'], false); console.log('✅ Created attribute: method'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute method already exists`); else console.error(`❌ Error creating attribute method:`, e.message); }
    try { await databases.createEnumAttribute(DATABASE_ID, sparringId, 'stage', ['final', 'semi_final', 'quarter_final', 'elimination', 'round_robin', 'bronze_match'], false); console.log('✅ Created attribute: stage'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute stage already exists`); else console.error(`❌ Error creating attribute stage:`, e.message); }
    try { await databases.createIntegerAttribute(DATABASE_ID, sparringId, 'points_my', false, 0, 1000, 0); console.log('✅ Created attribute: points_my'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute points_my already exists`); else console.error(`❌ Error creating attribute points_my:`, e.message); }
    try { await databases.createIntegerAttribute(DATABASE_ID, sparringId, 'points_opp', false, 0, 1000, 0); console.log('✅ Created attribute: points_opp'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute points_opp already exists`); else console.error(`❌ Error creating attribute points_opp:`, e.message); }
    // NEW: Submission Technique
    try { await databases.createStringAttribute(DATABASE_ID, sparringId, 'submission_technique', 100, false); console.log('✅ Created attribute: submission_technique'); } catch (e) { if (e.code === 409) console.log(`ℹ️ Attribute submission_technique already exists`); else console.error(`❌ Error creating attribute submission_technique:`, e.message); }

    console.log('🎉 Competition DB Setup Complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupCompetitionDB();
