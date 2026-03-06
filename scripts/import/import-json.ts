import fs from "node:fs";
import { JsonAdapter } from "./adapters/json-adapter";
import { persistImport } from "./shared";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run import:json -- path/to/file.json");

  const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
  const rows = Array.isArray(parsed) ? parsed : parsed.listings;

  const count = await persistImport("json", new JsonAdapter(), rows);
  console.log(`Imported ${count} records from JSON`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
