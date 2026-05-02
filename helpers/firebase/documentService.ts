import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { collectionName, documentId } from "./config";

export const documentService = {
  onDocumentSnapshot: async (
    callback: (snapshot: unknown) => void,
    onError: (error: unknown) => void,
  ) => {
    let unsubscribe = () => {};
    try {
      const ref = doc(db, collectionName, documentId);

      unsubscribe = onSnapshot(ref, callback, (error) => {
        console.error("Error getting document:", error);
        onError(error);
      });
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    } finally {
      return unsubscribe;
    }
  },
};
