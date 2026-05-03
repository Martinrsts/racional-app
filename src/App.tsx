import { useFirestoreDocument } from "./hooks/useFirestoreDocument";
import { Chart } from "./components/Chart";
import { collectionName, documentId } from "./firebase/config";
import Header from "./components/Header";
import StatusMessage from "./components/StatusMessage";

export default function App() {
  const { data, loading, error } = useFirestoreDocument(
    collectionName,
    documentId,
  );

  return (
    <div className="h-full flex flex-col bg-slate-100">
      <Header />
      <main className="flex-1 min-h-0 overflow-hidden p-6">
        {loading && <StatusMessage text="Loading portfolio data…" />}
        {error && <StatusMessage text={`Error: ${error.message}`} isError />}
        {!loading && !error && <Chart data={data ? data.array : []} />}
      </main>
    </div>
  );
}
