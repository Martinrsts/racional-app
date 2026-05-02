import { useFirestoreDocument } from "./hooks/useFirestoreDocument";
import { D3Chart } from "./components/D3Chart";
import { collectionName, documentId } from "./firebase/config";

export default function App() {
  const { data, loading, error } = useFirestoreDocument(
    collectionName,
    documentId,
  );

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main>
      <D3Chart data={data} />
    </main>
  );
}
