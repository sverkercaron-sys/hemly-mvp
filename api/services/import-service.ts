import { ExternalListing, ListingIntegrationAdapter } from "@/api/integrations/types";
import { estimateMonthlyCost, slugify } from "@/lib/utils";

export interface NormalizedListing {
  external_id: string;
  title: string;
  description: string;
  price: number;
  monthly_fee: number;
  operating_cost: number;
  size: number;
  rooms: number;
  property_type: ExternalListing["propertyType"];
  address: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  slug: string;
  monthly_cost_estimate: number;
  images: string[];
}

export async function ingestViaAdapter(adapter: ListingIntegrationAdapter, input: unknown): Promise<NormalizedListing[]> {
  const listings = await adapter.pullListings(input);

  return listings.map((item) => ({
    external_id: item.externalId,
    title: item.title,
    description: item.description,
    price: item.price,
    monthly_fee: item.monthlyFee,
    operating_cost: item.operatingCost ?? 0,
    size: item.size,
    rooms: item.rooms,
    property_type: item.propertyType,
    address: item.address,
    city: item.city,
    area: item.area,
    latitude: item.latitude ?? 59.33,
    longitude: item.longitude ?? 18.06,
    slug: `${slugify(item.city)}-${slugify(item.area)}-${slugify(item.title)}-${item.externalId}`,
    monthly_cost_estimate: estimateMonthlyCost(item.price, item.monthlyFee, 0.04, 30, item.operatingCost ?? 0),
    images: item.images ?? []
  }));
}
