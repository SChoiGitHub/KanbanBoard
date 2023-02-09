import { EditStatusSchema } from "./EditStatusSchema";

describe('EditStatusSchema', () => {
  it('can omit limits', async () => {
    const obj = { title: "NewTitle", hasLimit: false };

    const actual = EditStatusSchema.safeParse(obj);

    expect(actual.success).toBeTruthy();
  });

  it('can have limits', async () => {
    const obj = { title: "NewTitle", hasLimit: true, limit: 10 };

    const actual = EditStatusSchema.safeParse(obj);

    expect(actual.success).toBeTruthy();
  });

  it('cannot have zero limits', async () => {
    const obj = { title: "NewTitle", hasLimit: true, limit: -1 };

    const actual = EditStatusSchema.safeParse(obj);

    expect(actual.success).toBeFalsy();
  });
});