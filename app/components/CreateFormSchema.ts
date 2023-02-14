import { z } from "zod";

export const CreateFormSchema = z.object({
  name: z.string().min(2, "Invalid Board Name"),
  statuses: z.array(
    z.object({ name: z.string({ required_error: "This is required." }).min(2, "Invalid Status") })
  ).refine((arr) => {
    const set = new Set(arr.map((({ name }) => name)));

    return set.size === arr.length;
  }, { message: "You cannot duplicate status names"}),
});