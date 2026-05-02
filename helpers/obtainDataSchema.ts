import { documentService } from "./firebase/documentService";

const obtainDataSchema = async (snapshot: unknown): Promise<string[]> => {
  if (snapshot && typeof snapshot === "object" && "data" in snapshot) {
    const data = (snapshot as { data: () => unknown }).data();
    if (data && typeof data === "object") {
      if ("array" in data && Array.isArray(data.array)) {
        const objectKeysSet = new Set<string>();
        for (const item of data.array) {
          if (item && typeof item === "object") {
            objectKeysSet.add(Object.keys(item).sort().join(","));
          }
        }
        return Array.from(objectKeysSet);
      }
    }
  }
  throw new Error("Invalid snapshot format");
};

const obtainDataSchemaValueTypes = async (
  snapshot: unknown,
  fieldNames: string[],
) => {
  const fieldTypesMap: Record<string, Record<string, Set<string>>> = {};
  fieldNames.forEach((fieldsKeys) => {
    if (!fieldTypesMap[fieldsKeys]) {
      fieldTypesMap[fieldsKeys] = fieldsKeys.split(",").reduce(
        (acc, field) => {
          acc[field] = new Set<string>();
          return acc;
        },
        {} as Record<string, Set<string>>,
      );
    }
  });

  if (snapshot && typeof snapshot === "object" && "data" in snapshot) {
    const data = (snapshot as { data: () => unknown }).data();
    if (data && typeof data === "object") {
      if ("array" in data && Array.isArray(data.array)) {
        for (const item of data.array) {
          if (item && typeof item === "object") {
            const itemSchemaKey = Object.keys(item).sort().join(",");
            if (fieldTypesMap[itemSchemaKey]) {
              Object.entries(item).forEach(([key, value]) => {
                const valueType = typeof value;
                fieldTypesMap[itemSchemaKey][key].add(valueType);
              });
            }
          }
        }
      }
    }
  }
  return fieldTypesMap;
};

documentService.onDocumentSnapshot(
  (snapshot) => {
    obtainDataSchema(snapshot)
      .then((schema) => {
        obtainDataSchemaValueTypes(snapshot, schema).then((fieldTypesMap) => {
          console.log("Field types map:", fieldTypesMap);
        });
      })
      .catch((error) => {
        console.error("Error obtaining data schema:", error);
      });
  },
  (error) => {
    console.error("Error getting document:", error);
  },
);
