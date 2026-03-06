import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";
import { XmlAdapter } from "./adapters/xml-adapter";
import { persistImport } from "./shared";

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run import:xml -- path/to/file.xml");

  const raw = fs.readFileSync(file, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(raw);

  const rows = parsed?.listings?.listing ?? [];
  const normalizedRows = Array.isArray(rows) ? rows : [rows];

  const count = await persistImport("xml", new XmlAdapter(), normalizedRows);
  console.log(`Imported ${count} records from XML`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
