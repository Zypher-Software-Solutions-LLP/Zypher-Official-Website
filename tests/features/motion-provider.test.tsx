import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/components/motion/MotionProvider";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));
const lenisConstructor = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

vi.mock("lenis", () => {
  class MockLenis {
    public constructor(options: unknown) {
      lenisConstructor(options);
    }

    public destroy(): void {}

    public scrollTo(): void {}
  }

  return { default: MockLenis };
});

describe("motion provider", () => {
  beforeEach(() => {
    navigationState.pathname = "/";
    lenisConstructor.mockClear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should leave Sanity Studio on native scrolling", () => {
    navigationState.pathname = "/studio/structure/blogPost";

    render(
      <MotionProvider>
        <div>Studio</div>
      </MotionProvider>,
    );

    expect(lenisConstructor).not.toHaveBeenCalled();
  });

  it("should keep Lenis enabled for marketing routes", () => {
    render(
      <MotionProvider>
        <div>Marketing page</div>
      </MotionProvider>,
    );

    expect(lenisConstructor).toHaveBeenCalledWith({ autoRaf: true });
  });
});
