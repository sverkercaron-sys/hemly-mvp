import { ListingIntegrationAdapter, ExternalListing } from "@/api/integrations/types";

export class CsvAdapter implements ListingIntegrationAdapter {
  source = "csv" as const;

  async pullListings(input: unknown): Promise<ExternalListing[]> {
    const rows = Array.isArray(input) ? input : [];
    return rows.map((row: any) => ({
      externalId: String(row.external_id ?? row.id),
      title: String(row.title ?? "Untitled"),
      description: String(row.description ?? ""),
      price: Number(row.price ?? 0),
      monthlyFee: Number(row.monthly_fee ?? 0),
      operatingCost: Number(row.operating_cost ?? 0),
      size: Number(row.size ?? 0),
      rooms: Number(row.rooms ?? 0),
      propertyType: (row.property_type ?? "apartment") as ExternalListing["propertyType"],
      address: String(row.address ?? ""),
      city: String(row.city ?? ""),
      area: String(row.area ?? ""),
      latitude: Number(row.latitude ?? 59.33),
      longitude: Number(row.longitude ?? 18.06),
      images: String(row.images ?? "")
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean)
    }));
  }
}
