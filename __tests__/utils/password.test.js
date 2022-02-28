require("../../env/test");
const { expect, it, describe } = require("@jest/globals");
const { encryptPassword, validatePassword } = require("../../utils/password");

describe("encryptPassword", () => {
  it("should return an encrypted password when passed a string", async () => {
    const input = "password";
    const output = await encryptPassword(input);

    expect(typeof output).toBe("string");
  });
});

describe("validatePassword", () => {
  it("should return a Boolean value", async () => {
    const input = "password";
    const output = await validatePassword(
      input,
      "$2b$10$0aIWuZbwpj304PGSzd1WXee5rYy7VL/yXHDNCKIvtTzkAWHxfVoOa"
    );

    expect(typeof output).toBe("boolean");
  });
  it("should return true for a valid password and encrypted password", async () => {
    const input = "password";
    const output = await validatePassword(
      input,
      "$2b$10$0aIWuZbwpj304PGSzd1WXee5rYy7VL/yXHDNCKIvtTzkAWHxfVoOa"
    );
    const expected = true;

    expect(output).toEqual(expected);
  });
  it("should return false for an incorrect password and encrypted password", async () => {
    const input = "password";
    const output = await validatePassword(
      input,
      "fewlkjwfeljkfwejlkwfelkjfweljkfwelkjfwe"
    );
    const expected = false;

    expect(output).toEqual(expected);
  });
});
