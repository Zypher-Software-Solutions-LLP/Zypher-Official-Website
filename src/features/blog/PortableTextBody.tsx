import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "@/integrations/cms/sanity/types";
import { getPortableTextBlockText, slugifyHeading } from "./article-content";
import styles from "./PortableTextBody.module.css";

function isSafeHref(href: string | undefined): href is string {
  if (!href) return false;
  if (href.startsWith("/")) return true;

  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getHeadingId(value: PortableTextBlock, headingIds: ReadonlyMap<string, string>): string {
  if (value._key)
    return headingIds.get(value._key) ?? slugifyHeading(getPortableTextBlockText(value));
  return slugifyHeading(getPortableTextBlockText(value));
}

function createComponents(headingIds: ReadonlyMap<string, string>): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
      h2: ({ children, value }) => (
        <h2 className={styles.headingTwo} id={getHeadingId(value as PortableTextBlock, headingIds)}>
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          className={styles.headingThree}
          id={getHeadingId(value as PortableTextBlock, headingIds)}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className={styles.blockquote}>{children}</blockquote>
      ),
    },
    list: ({ children, value }) => {
      const listItem = (value as { listItem?: string } | undefined)?.listItem;
      return listItem === "number" ? (
        <ol className={styles.list}>{children}</ol>
      ) : (
        <ul className={styles.list}>{children}</ul>
      );
    },
    listItem: ({ children }) => <li>{children}</li>,
    marks: {
      link: ({ children, value }) => {
        const href = typeof value?.href === "string" ? value.href : undefined;
        if (!isSafeHref(href)) return <>{children}</>;

        return (
          <a
            className={styles.link}
            href={href}
            rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
            target={href.startsWith("/") ? undefined : "_blank"}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        const image = value as PortableTextBlock;
        const url = image.asset?.url;
        if (!url) return null;

        return (
          <figure className={styles.inlineImage}>
            <Image
              alt={image.alt || ""}
              height={image.asset?.metadata?.dimensions?.height || 800}
              src={url}
              width={image.asset?.metadata?.dimensions?.width || 1200}
            />
          </figure>
        );
      },
    },
  };
}

export function PortableTextBody({
  headingIds = new Map<string, string>(),
  value,
}: {
  headingIds?: ReadonlyMap<string, string>;
  value: PortableTextBlock[];
}): React.ReactNode {
  return (
    <div className={styles.body}>
      <PortableText components={createComponents(headingIds)} value={value} />
    </div>
  );
}
