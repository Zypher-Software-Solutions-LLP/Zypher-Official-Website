import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getArticleSections } from "@/features/blog/article-content";
import { PortableTextBody } from "@/features/blog/PortableTextBody";
import type { PortableTextBlock } from "@/integrations/cms/sanity/types";

const body: PortableTextBlock[] = [
  {
    _key: "section-one",
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: "Build around the problem" }],
  },
  {
    _key: "section-one-body",
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: "Start with what is not working." }],
  },
  {
    _key: "section-two",
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text: "Build around the problem" }],
  },
  {
    _key: "list",
    _type: "block",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", text: "Make the next step clear." }],
  },
];

describe("blog article content", () => {
  it("should create stable unique anchors for article headings", () => {
    expect(getArticleSections(body)).toEqual([
      {
        id: "build-around-the-problem",
        level: 2,
        text: "Build around the problem",
        key: "section-one",
      },
      {
        id: "build-around-the-problem-2",
        level: 2,
        text: "Build around the problem",
        key: "section-two",
      },
    ]);
  });

  it("should render headings and bullet lists from Sanity portable text", () => {
    render(<PortableTextBody value={body} />);

    expect(screen.getAllByRole("heading", { name: "Build around the problem" })[0]).toHaveAttribute(
      "id",
      "build-around-the-problem",
    );
    expect(within(screen.getByRole("list")).getByRole("listitem")).toHaveTextContent(
      "Make the next step clear.",
    );
  });
});
