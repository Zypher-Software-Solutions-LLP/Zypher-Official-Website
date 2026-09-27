import { defineField, defineType } from "sanity";

const editorialImageFields = [
  defineField({
    name: "alt",
    title: "Alt text",
    type: "string",
    validation: (Rule) => Rule.required().max(160),
  }),
];

const richText = {
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            fields: [defineField({ name: "href", title: "URL", type: "url" })],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true }, fields: editorialImageFields },
  ],
};

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(40).max(240),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "image",
      title: "Featured image",
      type: "image",
      options: { hotspot: true },
      fields: editorialImageFields,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
    defineField({
      name: "body",
      title: "Body",
      ...richText,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "SEO title",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "description",
          title: "SEO description",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "image" } },
});
