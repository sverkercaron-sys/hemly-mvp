import { describe, expect, it } from "vitest";
import { estimateMonthlyCost, slugify } from "@/lib/utils";

describe("utils", () => {
  it("creates slugs", () => {
    expect(slugify("Göteborg Västra")).toBe("goteborg-vastra");
  });

  it("estimates monthly cost", () => {
    expect(estimateMonthlyCost(4_200_000, 2300)).toBeGreaterThan(2000);
  });
});
