import { defineField, defineType } from "sanity";

export const photoSchema = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Portrait", value: "Portrait" },
          { title: "Street", value: "Street" },
          { title: "Editorial", value: "Editorial" },
          { title: "B&W", value: "B&W" },
          { title: "Fashion", value: "Fashion" },
          { title: "Landscape", value: "Landscape" },
          { title: "Events", value: "Events" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
