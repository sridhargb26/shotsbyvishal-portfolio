import { randomBytes } from "crypto";

export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "album";
}

export function uniqueSlug(base: string): string {
  return `${slugify(base)}-${randomBytes(3).toString("hex")}`;
}
