import { useState, useEffect } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface UseFirestoreDocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFirestoreDocument<T = DocumentData>(
  collectionPath: string,
  documentId: string,
): UseFirestoreDocumentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!collectionPath || !documentId) return;

    const ref = doc(db, collectionPath, documentId);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        setData(
          snapshot.exists()
            ? ({ id: snapshot.id, ...snapshot.data() } as T)
            : null,
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [collectionPath, documentId]);

  return { data, loading, error };
}
