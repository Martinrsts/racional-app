declare const process: {
  env: Record<string, string | undefined>;
};

export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY as string,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL as string,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.VITE_FIREBASE_APP_ID as string,
};

export const collectionName = "investmentEvolutions";
export const documentId = "user1";
