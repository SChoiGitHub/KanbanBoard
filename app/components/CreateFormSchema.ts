import { z } from "zod";

export const CreateFormSchema = z.object({
  name: z.string().min(2, "Invalid Board Name"),
  statuses: z.array(
    z.preprocess(a => String(a), z.string().min(2, "Invalid Status"))
  ),
});