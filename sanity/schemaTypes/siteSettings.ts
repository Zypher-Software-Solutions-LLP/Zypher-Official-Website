import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Global site settings",
    }),
    defineField({
      name: "defaultSeoTitle",
      title: "Default SEO title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default SEO description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [{ type: "url" }],
    }),
  ],
});
