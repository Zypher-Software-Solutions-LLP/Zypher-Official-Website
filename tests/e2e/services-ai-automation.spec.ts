import { expect, test } from "@playwright/test";
import { openPage } from "./helpers/site";

test.describe("AI and LLM automation section", () => {
  test("should keep the desktop section inside the shared grid and show the laptop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openPage(page, "/services");

    const layout = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>('[data-testid="ai-automation-section"]');
      const grid = document.querySelector<HTMLElement>('[data-testid="ai-automation-grid"]');
      const laptop = document.querySelector<HTMLElement>('[data-testid="ai-automation-laptop"]');
      const workflow = document.querySelector<HTMLElement>('[data-testid="ai-node-workflow"]');
      const workflowImage = document.querySelector<HTMLElement>(
        '[data-testid="ai-node-workflow-image"]',
      );
      const bottomGrid = document.querySelector<HTMLElement>(
        '[data-testid="ai-automation-bottom-grid"]',
      );
      const node = document.querySelector<HTMLElement>('[data-testid="ai-capability-node"]');
      const deliverablesList = document.querySelector<HTMLElement>(
        '[data-testid="business-deliverables-list"]',
      );
      const points = Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid="ai-node-point"]'),
      );

      if (
        !section ||
        !grid ||
        !laptop ||
        !workflow ||
        !workflowImage ||
        !bottomGrid ||
        !node ||
        !deliverablesList ||
        points.length !== 5
      ) {
        throw new Error("Missing AI automation section geometry");
      }

      const workflowImageRect = workflowImage.getBoundingClientRect();
      const pointOffsets = points.map((point) => {
        const pointRect = point.getBoundingClientRect();
        return (
          (pointRect.left + pointRect.width / 2 - workflowImageRect.left) / workflowImageRect.width
        );
      });

      return {
        gridWidth: grid.getBoundingClientRect().width,
        gridRight: grid.getBoundingClientRect().right,
        laptopDisplay: getComputedStyle(laptop).display,
        laptopWidth: laptop.getBoundingClientRect().width,
        laptopRight: laptop.getBoundingClientRect().right,
        laptopBottom: laptop.getBoundingClientRect().bottom,
        laptopPosition: getComputedStyle(laptop).position,
        laptopBottomOffset: Number.parseFloat(getComputedStyle(laptop).bottom),
        sectionBottom: section.getBoundingClientRect().bottom,
        sectionHeight: section.getBoundingClientRect().height,
        workflowDisplay: getComputedStyle(workflow).display,
        workflowImageSrc: workflowImage.getAttribute("data-image-src"),
        pointOffsets,
        deliverablesGap:
          bottomGrid.getBoundingClientRect().top - workflow.getBoundingClientRect().bottom,
        deliverableListGap: Number.parseFloat(getComputedStyle(deliverablesList).rowGap),
        deliverableListStyle: getComputedStyle(deliverablesList).listStyleType,
        nodeWidth: node.getBoundingClientRect().width,
        sectionRadius: getComputedStyle(section).borderBottomLeftRadius,
        laptopAnimationName: getComputedStyle(laptop).animationName,
      };
    });

    expect(layout.gridWidth).toBeGreaterThan(1000);
    expect(layout.gridWidth).toBeLessThan(1200);
    expect(layout.laptopDisplay).not.toBe("none");
    expect(layout.laptopWidth).toBeGreaterThan(900);
    expect(layout.laptopRight).toBeGreaterThan(layout.gridRight + 32);
    expect(layout.laptopPosition).toBe("absolute");
    expect(layout.laptopBottomOffset).toBeLessThan(0);
    expect(layout.laptopBottom).toBeGreaterThan(layout.sectionBottom);
    expect(layout.sectionHeight).toBeLessThan(1000);
    expect(layout.sectionHeight).toBeGreaterThan(928);
    expect(layout.workflowDisplay).toBe("block");
    expect(layout.workflowImageSrc).toContain("services-page/section-2/Group%2022.png");
    expect(layout.pointOffsets[0]).toBeCloseTo(0.0626, 2);
    expect(layout.pointOffsets[1]).toBeCloseTo(0.2783, 2);
    expect(layout.pointOffsets[2]).toBeCloseTo(0.4957, 2);
    expect(layout.pointOffsets[3]).toBeCloseTo(0.7122, 2);
    expect(layout.pointOffsets[4]).toBeCloseTo(0.9304, 2);
    expect(layout.deliverablesGap).toBeLessThan(48);
    expect(layout.deliverableListGap).toBeGreaterThan(8);
    expect(layout.deliverableListStyle).toBe("disc");
    expect(layout.nodeWidth).toBeGreaterThan(120);
    expect(layout.sectionRadius).not.toBe("0px");
    expect(layout.laptopAnimationName.endsWith("ai-laptop-rise-in")).toBe(true);
  });

  test("should retain the laptop at a roomy tablet width", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await openPage(page, "/services");

    await expect(page.getByTestId("ai-automation-laptop")).toBeVisible();
  });

  test("should keep the tablet points close to the workflow artwork", async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await openPage(page, "/services");

    const geometry = await page.evaluate(() => {
      const artwork = document.querySelector<HTMLElement>('[data-testid="ai-node-workflow-image"]');
      const points = Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid="ai-node-point"]'),
      );

      if (!artwork || points.length !== 5) {
        throw new Error("Missing tablet workflow geometry");
      }

      const artworkRect = artwork.getBoundingClientRect();
      const closestPointTop = Math.min(...points.map((point) => point.getBoundingClientRect().top));

      return {
        artworkBottom: artworkRect.bottom,
        closestPointTop,
      };
    });

    expect(geometry.closestPointTop).toBeLessThan(geometry.artworkBottom);
  });

  test("should align mobile labels to shared diagram rows across phone widths", async ({
    page,
  }) => {
    for (const width of [320, 390, 430, 540, 767]) {
      await page.setViewportSize({ width, height: 844 });
      await openPage(page, "/services");

      const geometry = await page.evaluate(() => {
        const artwork = document.querySelector<HTMLElement>(
          '[data-testid="ai-node-workflow-mobile-image"]',
        );
        const workflow = document.querySelector<HTMLElement>('[data-testid="ai-node-workflow"]');
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-testid="ai-capability-node"]'),
        );

        if (!artwork || !workflow || nodes.length !== 5) {
          throw new Error("Missing mobile workflow row geometry");
        }

        const nodeTops = nodes.map((node) => node.getBoundingClientRect().top);
        const rowSteps = nodeTops.slice(1).map((top, index) => top - nodeTops[index]);

        return {
          artworkHeight: artwork.getBoundingClientRect().height,
          workflowHeight: workflow.getBoundingClientRect().height,
          workflowDisplay: getComputedStyle(workflow).display,
          workflowRows: getComputedStyle(workflow).gridTemplateRows,
          rowGap: getComputedStyle(workflow).rowGap,
          rowSteps,
        };
      });

      expect(geometry.workflowDisplay).toBe("grid");
      expect(geometry.workflowRows.split(" ").length).toBe(5);
      expect(geometry.rowGap).toBe("0px");
      expect(geometry.artworkHeight).toBeCloseTo(geometry.workflowHeight, 1);
      expect(geometry.rowSteps.every((step) => Math.abs(step - geometry.rowSteps[0]) < 0.5)).toBe(
        true,
      );
    }
  });
  test("should stack the node diagram and hide the laptop on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const workflow = page.getByTestId("ai-node-workflow");
    await expect(page.getByTestId("ai-automation-laptop")).toBeHidden();
    const mobileWorkflowImage = page.getByTestId("ai-node-workflow-mobile-image");
    await expect(mobileWorkflowImage).toBeVisible();
    await expect(mobileWorkflowImage).toHaveAttribute(
      "data-image-src",
      expect.stringContaining("Group%2022%20-%20Mobile%20View.png"),
    );
    await expect(page.getByTestId("business-deliverable").first()).toBeVisible();
    await expect(workflow).toHaveAttribute("data-mobile-orientation", "vertical");

    await expect
      .poll(() => workflow.evaluate((element) => getComputedStyle(element).flexDirection))
      .toBe("column");

    const mobileArtwork = await mobileWorkflowImage.evaluate((element) => {
      const image = element.querySelector("img");
      const firstLabel = document.querySelector<HTMLElement>('[data-testid="ai-capability-label"]');
      if (!image) {
        throw new Error("Missing mobile workflow image");
      }
      if (!firstLabel) {
        throw new Error("Missing mobile capability label");
      }

      const rect = image.getBoundingClientRect();
      const artworkRect = element.getBoundingClientRect();
      const labelRect = firstLabel.getBoundingClientRect();
      return {
        height: rect.height,
        labelGap: labelRect.left - artworkRect.right,
        objectFit: getComputedStyle(image).objectFit,
        transform: getComputedStyle(image).transform,
      };
    });

    expect(mobileArtwork.height).toBeGreaterThan(0);
    expect(mobileArtwork.labelGap).toBeGreaterThanOrEqual(0);
    expect(mobileArtwork.labelGap).toBeLessThan(40);
    expect(mobileArtwork.objectFit).toBe("contain");
    expect(mobileArtwork.transform).toBe("none");
  });

  test("should keep the mobile workflow CTA text on one line", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const cta = page
      .getByTestId("ai-automation-bottom-grid")
      .getByRole("link", { name: "See How We Build With AI →" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveCSS("white-space", "nowrap");
  });
});
