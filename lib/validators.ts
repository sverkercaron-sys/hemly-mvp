import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive(),
  monthly_fee: z.number().nonnegative(),
  size: z.number().positive(),
  rooms: z.number().positive(),
  property_type: z.enum(["villa", "apartment", "townhouse", "cottage"]),
  city: z.string().min(2),
  area: z.string().min(2),
  address: z.string().min(4),
  image_urls: z.array(z.string().url()).optional()
});

export const createLeadSchema = z.object({
  property_id: z.string().uuid(),
  email: z.string().email(),
  message: z.string().min(5)
});

export const createSearchProfileSchema = z.object({
  city: z.string().min(2),
  price_max: z.number().positive().nullable(),
  monthly_cost_max: z.number().positive().nullable()
});
