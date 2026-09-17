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
        laptopDisplay: getComputedStyle(laptop).display,
        laptopWidth: laptop.getBoundingClientRect().width,
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
    expect(layout.laptopWidth).toBeGreaterThan(700);
    expect(layout.laptopPosition).toBe("absolute");
    expect(layout.laptopBottomOffset).toBeLessThan(0);
    expect(layout.laptopBottom).toBeGreaterThan(layout.sectionBottom);
    expect(layout.sectionHeight).toBeLessThan(900);
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

  test("should stack the node diagram and hide the laptop on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openPage(page, "/services");

    const workflow = page.getByTestId("ai-node-workflow");
    await expect(page.getByTestId("ai-automation-laptop")).toBeHidden();
    await expect(page.getByTestId("business-deliverable").first()).toBeVisible();
    await expect(workflow).toHaveAttribute("data-mobile-orientation", "vertical");

    await expect
      .poll(() => workflow.evaluate((element) => getComputedStyle(element).flexDirection))
      .toBe("column");
  });
});
