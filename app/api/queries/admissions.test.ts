import { describe, it, expect } from "vitest";
import { generateReferenceCode } from "./admissions";

describe("admission queries", () => {
  it("generates a reference code with the U40 prefix and current year", () => {
    const code = generateReferenceCode();
    const year = new Date().getFullYear();
    expect(code).toMatch(new RegExp(`^U40-${year}-[A-F0-9]{8}$`));
  });
});
