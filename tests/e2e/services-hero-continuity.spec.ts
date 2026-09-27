import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test("should keep the Services Hero rounded bottom corners on the mist backdrop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page, "/services");

  await expect(page.getByTestId("services-hero")).toHaveCSS(
    "background-color",
    "rgb(244, 248, 246)",
  );
});
