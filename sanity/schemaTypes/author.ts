import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Profile URL",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required().max(160),
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
