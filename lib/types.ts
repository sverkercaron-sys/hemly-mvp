export type ListingStatus = "pending" | "approved" | "rejected";

export type PropertyType = "villa" | "apartment" | "townhouse" | "cottage";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  monthly_fee: number;
  operating_cost: number;
  size: number;
  rooms: number;
  property_type: PropertyType;
  year_built: number | null;
  city: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  slug: string;
  agent_id: string | null;
  status: ListingStatus;
  created_at: string;
  monthly_cost_estimate: number;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  image_order: number;
}

export interface PropertySearchFilters {
  city?: string;
  area?: string;
  priceMin?: number;
  priceMax?: number;
  monthlyCostMax?: number;
  roomsMin?: number;
  sizeMin?: number;
  propertyType?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "newest" | "priceAsc" | "priceDesc";
}

export interface SearchProfile {
  id: string;
  user_id: string;
  city: string;
  price_min: number | null;
  price_max: number | null;
  monthly_cost_max: number | null;
}
