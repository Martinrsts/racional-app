import { useFirestoreDocument } from "./hooks/useFirestoreDocument";
import { Chart } from "./components/Chart";
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
      <Chart data={data ? data.array : []} />
    </main>
  );
}
