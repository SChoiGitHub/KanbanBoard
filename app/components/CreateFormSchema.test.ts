import { CreateFormSchema } from "./CreateFormSchema";

describe('CreateFormSchema', () => {
  it('can pass valid objects', async () => {
    const obj = {
      "name": "Testing",
      "statuses": [
        { name: "Test" },
        { name: "123" },
      ]
    };

    const actual = CreateFormSchema.safeParse(obj);

    expect(actual.success).toBeTruthy();
  });

  it('cconsiders single character statuses invalid', async () => {
    const obj = {
      "name": "Testing",
      "statuses": [
        { name: "T" },
        { name: "123" },
      ]
    };

    const actual = CreateFormSchema.safeParse(obj);

    expect(actual.success).toBeFalsy();
  });
});