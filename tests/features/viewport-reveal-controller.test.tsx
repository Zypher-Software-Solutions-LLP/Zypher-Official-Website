import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pathnameState = vi.hoisted(() => ({ value: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: (): string => pathnameState.value,
}));

import { ViewportRevealController } from "@/components/motion/ViewportRevealController";

type IntersectionEntryStub = {
  isIntersecting: boolean;
  target: Element;
};

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];

  readonly callback: (entries: IntersectionEntryStub[]) => void;
  readonly options: IntersectionObserverInit;
  readonly observedTargets: Element[] = [];
  readonly unobservedTargets: Element[] = [];
  disconnected = false;

  constructor(
    callback: (entries: IntersectionEntryStub[]) => void,
    options: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    IntersectionObserverStub.instances.push(this);
  }

  observe(target: Element): void {
    this.observedTargets.push(target);
  }

  unobserve(target: Element): void {
    this.unobservedTargets.push(target);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(target: Element, isIntersecting = true): void {
    this.callback([{ isIntersecting, target }]);
  }
}

function setMotionPreferences({
  reducedMotion = false,
  saveData = false,
}: {
  reducedMotion?: boolean;
  saveData?: boolean;
} = {}): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: reducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: { saveData },
  });
}

function renderSection() {
  return render(
    <>
      <section data-motion-section="true">
        <div data-motion-item="true">Reveal me</div>
      </section>
      <ViewportRevealController />
    </>,
  );
}

describe("ViewportRevealController", () => {
  beforeEach(() => {
    pathnameState.value = "/";
    IntersectionObserverStub.instances = [];
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    setMotionPreferences();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should reveal a section once when it intersects the viewport", () => {
    renderSection();

    const section = document.querySelector("[data-motion-section]");
    const observer = IntersectionObserverStub.instances[0];

    expect(section).toHaveAttribute("data-reveal-state", "hidden");
    expect(observer?.observedTargets).toContain(section);
    expect(observer?.options).toEqual({
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01,
    });

    act(() => observer?.trigger(section!));

    expect(section).toHaveAttribute("data-reveal-state", "visible");
    expect(observer?.unobservedTargets.filter((target) => target === section)).toHaveLength(1);

    act(() => observer?.trigger(section!));

    expect(observer?.unobservedTargets.filter((target) => target === section)).toHaveLength(1);
  });

  it("should reveal immediately when reduced motion is requested", () => {
    setMotionPreferences({ reducedMotion: true });

    renderSection();

    expect(document.querySelector("[data-motion-section]")).toHaveAttribute(
      "data-reveal-state",
      "visible",
    );
    expect(document.documentElement).toHaveAttribute("data-motion-skip", "true");
    expect(IntersectionObserverStub.instances).toHaveLength(0);
  });

  it("should reveal immediately when the connection requests saved data", () => {
    setMotionPreferences({ saveData: true });

    renderSection();

    expect(document.querySelector("[data-motion-section]")).toHaveAttribute(
      "data-reveal-state",
      "visible",
    );
    expect(document.documentElement).toHaveAttribute("data-motion-skip", "true");
    expect(IntersectionObserverStub.instances).toHaveLength(0);
  });

  it("should reveal immediately when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    renderSection();

    expect(document.querySelector("[data-motion-section]")).toHaveAttribute(
      "data-reveal-state",
      "visible",
    );
    expect(document.documentElement).toHaveAttribute("data-motion-skip", "true");
  });

  it("should disconnect the previous observer when the pathname changes", () => {
    const view = renderSection();
    const previousObserver = IntersectionObserverStub.instances[0];

    act(() => {
      pathnameState.value = "/about";
      view.rerender(
        <>
          <section data-motion-section="true">
            <div data-motion-item="true">Reveal me</div>
          </section>
          <ViewportRevealController />
        </>,
      );
    });

    expect(previousObserver?.disconnected).toBe(true);
    expect(IntersectionObserverStub.instances).toHaveLength(2);
    expect(document.querySelector("[data-motion-section]")).toHaveAttribute(
      "data-reveal-state",
      "hidden",
    );
  });
});
