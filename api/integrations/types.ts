export interface ExternalListing {
  externalId: string;
  title: string;
  description: string;
  price: number;
  monthlyFee: number;
  operatingCost?: number;
  size: number;
  rooms: number;
  propertyType: "villa" | "apartment" | "townhouse" | "cottage";
  address: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

export interface ListingIntegrationAdapter {
  source: "vitec" | "fasad" | "mspecs" | "csv" | "xml" | "json";
  pullListings(input: unknown): Promise<ExternalListing[]>;
}
