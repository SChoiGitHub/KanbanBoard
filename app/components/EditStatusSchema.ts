import { z } from "zod";

const NoLimitFragment = z.object({
  hasLimit: z.literal(false),
});

const HasLimitFragment = z.object({
  hasLimit: z.literal(true),
  limit: z.number({ required_error: "A limit value is required" })
    .min(0, 'Limit must be larger than zero.')
    .int('Limit must be an integer'),
});

export const EditStatusSchema = z.object({
  title: z.string({ required_error: "A title is required" })
    .min(2, "The title is too short."),
}).and(z.union([NoLimitFragment, HasLimitFragment]));
