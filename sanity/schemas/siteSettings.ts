import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Photographer Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline (Hero)", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "behance", title: "Behance URL", type: "url" }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "profileImage",
      title: "Profile / About Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "stats",
      title: "Stats (About Page)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "value", title: "Value", type: "string" },
          { name: "label", title: "Label", type: "string" },
        ],
      }],
    }),
    defineField({
      name: "publications",
      title: "Publications & Features",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Publication Name", type: "string" },
          { name: "issue", title: "Issue / Project", type: "string" },
          { name: "url", title: "URL", type: "url" },
        ],
      }],
    }),
    defineField({
      name: "heroCategories",
      title: "Hero Subtitle (e.g. Editorial · Portrait · Street)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
