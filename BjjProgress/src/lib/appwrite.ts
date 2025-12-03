import { Client, Account, Databases, ID, Query } from 'react-native-appwrite';
import 'react-native-url-polyfill/auto';

export const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '69283bd60018f7ae198f',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
  sparringCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID!,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform('com.hubertdomagala.bjjprogress');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
