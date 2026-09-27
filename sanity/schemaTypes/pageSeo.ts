import { defineField, defineType } from "sanity";

const staticPageOptions = [
  { title: "Home", value: "/" },
  { title: "Services", value: "/services" },
  { title: "Software Development", value: "/services/software-development" },
  { title: "Mobile App Development", value: "/services/mobile-app-development" },
  { title: "AI & LLM Automation", value: "/services/ai-llm-automation" },
  { title: "Design & Creative", value: "/services/design-creative" },
  { title: "CRM/ERP Solutions", value: "/services/crm-erp-solutions" },
  { title: "Work", value: "/work" },
  { title: "Scale", value: "/scale" },
  { title: "About", value: "/about" },
  { title: "Blog", value: "/blog" },
  { title: "Contact", value: "/contact" },
  { title: "Careers", value: "/careers" },
  { title: "Cookie Policy", value: "/cookie-policy" },
  { title: "Privacy Policy", value: "/privacy-policy" },
  { title: "Terms of Use", value: "/terms-of-use" },
];

const socialImageFields = [
  defineField({
    name: "alt",
    title: "Alt text",
    type: "string",
    validation: (Rule) => Rule.required().max(160),
  }),
];

export const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "pagePath",
      title: "Page",
      type: "string",
      options: { list: staticPageOptions },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "SEO title",
      description: "The complete title shown in search results, including Zypher if desired.",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      description: "A concise search-result description, ideally between 150 and 160 characters.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(160),
    }),
    defineField({
      name: "socialImage",
      title: "Social sharing image",
      description: "Optional Open Graph and social preview image for this page.",
      type: "image",
      options: { hotspot: true },
      fields: socialImageFields,
    }),
    defineField({
      name: "noIndex",
      title: "Prevent search indexing",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "Prevent link following",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", pagePath: "pagePath" },
    prepare({ title, pagePath }: { title?: string; pagePath?: string }) {
      return { title: title || "Untitled SEO entry", subtitle: pagePath || "Page not selected" };
    },
  },
});
