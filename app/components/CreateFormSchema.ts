import { z } from "zod";

export const CreateFormSchema = z.object({
  name: z.string().min(2, "Invalid Board Name"),
  statuses: z.array(
    z.object({ name: z.string({ required_error: "This is required." }).min(2, "Invalid Status") })
  ),
});