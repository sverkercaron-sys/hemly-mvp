import { ListingIntegrationAdapter, ExternalListing } from "@/api/integrations/types";

export class JsonAdapter implements ListingIntegrationAdapter {
  source = "json" as const;

  async pullListings(input: unknown): Promise<ExternalListing[]> {
    const rows = Array.isArray(input) ? input : [];
    return rows.map((row: any) => ({
      externalId: String(row.externalId ?? row.id),
      title: String(row.title ?? "Untitled"),
      description: String(row.description ?? ""),
      price: Number(row.price ?? 0),
      monthlyFee: Number(row.monthlyFee ?? row.monthly_fee ?? 0),
      size: Number(row.size ?? 0),
      rooms: Number(row.rooms ?? 0),
      propertyType: (row.propertyType ?? row.property_type ?? "apartment") as ExternalListing["propertyType"],
      address: String(row.address ?? ""),
      city: String(row.city ?? ""),
      area: String(row.area ?? ""),
      latitude: Number(row.latitude ?? 59.33),
      longitude: Number(row.longitude ?? 18.06),
      images: Array.isArray(row.images) ? row.images.map(String) : []
    }));
  }
}
