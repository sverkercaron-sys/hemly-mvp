import { ListingIntegrationAdapter, ExternalListing } from "./types";

export class FasadAdapter implements ListingIntegrationAdapter {
  source = "fasad" as const;

  async pullListings(input: unknown): Promise<ExternalListing[]> {
    const rows = Array.isArray(input) ? input : [];
    return rows.map((row: any) => ({
      externalId: String(row.external_id ?? row.id),
      title: String(row.headline ?? row.title ?? "Untitled"),
      description: String(row.body ?? row.description ?? ""),
      price: Number(row.asking_price ?? row.price ?? 0),
      monthlyFee: Number(row.monthly_fee ?? 0),
      size: Number(row.living_area ?? row.size ?? 0),
      rooms: Number(row.number_of_rooms ?? row.rooms ?? 0),
      propertyType: (row.property_type ?? "apartment") as ExternalListing["propertyType"],
      address: String(row.street ?? row.address ?? ""),
      city: String(row.city ?? ""),
      area: String(row.area ?? ""),
      latitude: Number(row.lat ?? 0),
      longitude: Number(row.lng ?? 0),
      images: Array.isArray(row.media) ? row.media.map(String) : []
    }));
  }
}
