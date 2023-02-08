import { CreateFormSchema } from "./CreateFormSchema";

describe('CreateFormSchema', () => {
    it('can handle arrays with null in them', async () => {
      const obj = {
        "name": "Testing",
        "statuses": [
          "Test",
          "123",
          null,
        ]
      };

      const actual = CreateFormSchema.safeParse(obj);

      expect(actual.success).toBeTruthy();
    });

    it('cconsiders single character statuses invalid', async () => {
      const obj = {
        "name": "Testing",
        "statuses": [
          "T",
          "123",
          null,
        ]
      };

      const actual = CreateFormSchema.safeParse(obj);

      expect(actual.success).toBeFalsy();
    });
});