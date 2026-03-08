import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    transactionsCollectionId: import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID,
    budgetsCollectionId: import.meta.env.VITE_APPWRITE_BUDGETS_COLLECTION_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
};

console.log('Appwrite Config:', {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    transactionsId: import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID,
});

export default client;