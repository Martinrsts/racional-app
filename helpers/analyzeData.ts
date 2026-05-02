import { documentService } from "./firebase/documentService";

interface AttributeMetrics {
  range: number | null;
  mean: number | null;
  distinctCount: number;
}

type PortfolioMetrics = Record<string, AttributeMetrics>;

const extractArray = (snapshot: unknown): Record<string, unknown>[] => {
  if (snapshot && typeof snapshot === "object" && "data" in snapshot) {
    const data = (snapshot as { data: () => unknown }).data();
    if (
      data &&
      typeof data === "object" &&
      "array" in data &&
      Array.isArray((data as { array: unknown }).array)
    ) {
      return (data as { array: Record<string, unknown>[] }).array;
    }
  }
  throw new Error("Invalid snapshot format");
};

const computeAttributeMetrics = (values: unknown[]): AttributeMetrics => {
  const numericValues = values.filter(
    (v): v is number => typeof v === "number",
  );
  const distinctCount = new Set(values.map((v) => JSON.stringify(v))).size;

  if (numericValues.length === 0) {
    return { range: null, mean: null, distinctCount };
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const mean =
    numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;

  return { range: max - min, mean, distinctCount };
};

const analyzeData = (snapshot: unknown): PortfolioMetrics => {
  const items = extractArray(snapshot);

  const attributeKeys = new Set(items.flatMap((item) => Object.keys(item)));

  const metrics: PortfolioMetrics = {};
  for (const attr of attributeKeys) {
    const values = items.map((item) => item[attr]);
    metrics[attr] = computeAttributeMetrics(values);
  }

  return metrics;
};

documentService.onDocumentSnapshot(
  (snapshot) => {
    const analysis = analyzeData(snapshot);
    console.log("Analysis:", analysis);
  },
  (error) => {
    console.error("Error getting document:", error);
  },
);
