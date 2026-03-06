import fs from "node:fs";
import Papa from "papaparse";
import { CsvAdapter } from "./adapters/csv-adapter";
import { persistImport } from "./shared";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run import:csv -- path/to/file.csv");

  const raw = fs.readFileSync(file, "utf-8");
  const parsed = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: true });

  const count = await persistImport("csv", new CsvAdapter(), parsed.data);
  console.log(`Imported ${count} records from CSV`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
