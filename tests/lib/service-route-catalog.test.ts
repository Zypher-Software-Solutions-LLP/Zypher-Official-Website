import { describe, expect, it } from "vitest";
import { serviceDefinitions } from "@/features/services/service-data";
import { publicRoutes } from "@/lib/routes";

describe("service route catalog", () => {
  it("should not expose UI/UX as a standalone service page", () => {
    expect(serviceDefinitions.map((service) => service.slug)).not.toContain("ui-ux-design");
    expect(publicRoutes).not.toContain("/services/ui-ux-design");
  });
});
