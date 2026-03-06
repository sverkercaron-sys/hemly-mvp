import { ListingIntegrationAdapter, ExternalListing } from "./types";

export class VitecAdapter implements ListingIntegrationAdapter {
  source = "vitec" as const;

  async pullListings(input: unknown): Promise<ExternalListing[]> {
    const rows = Array.isArray(input) ? input : [];
    return rows.map((row: any) => ({
      externalId: String(row.id),
      title: String(row.title ?? "Untitled"),
      description: String(row.description ?? ""),
      price: Number(row.price ?? 0),
      monthlyFee: Number(row.monthlyFee ?? 0),
      size: Number(row.size ?? 0),
      rooms: Number(row.rooms ?? 0),
      propertyType: (row.propertyType ?? "apartment") as ExternalListing["propertyType"],
      address: String(row.address ?? ""),
      city: String(row.city ?? ""),
      area: String(row.area ?? ""),
      latitude: Number(row.latitude ?? 0),
      longitude: Number(row.longitude ?? 0),
      images: Array.isArray(row.images) ? row.images.map(String) : []
    }));
  }
}
