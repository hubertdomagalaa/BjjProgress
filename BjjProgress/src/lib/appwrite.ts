import { Client, Account, Databases, ID, Query } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
  sparringCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform('com.hubertdomagala.bjjprogress');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
