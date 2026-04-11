/** Parsed from admin album forms (checkboxes). */
export type AlbumVisibilityFlags = {
  show_in_gallery: boolean;
  show_in_commercial: boolean;
  show_in_editorial: boolean;
};

export function parseAlbumVisibilityFromForm(
  formData: FormData
): AlbumVisibilityFlags {
  return {
    show_in_gallery: formData.get("show_in_gallery") === "on",
    show_in_commercial: formData.get("show_in_commercial") === "on",
    show_in_editorial: formData.get("show_in_editorial") === "on",
  };
}

export function assertAtLeastOneVisibility(flags: AlbumVisibilityFlags): void {
  if (
    !flags.show_in_gallery &&
    !flags.show_in_commercial &&
    !flags.show_in_editorial
  ) {
    throw new Error(
      "Choose at least one: Main gallery, Commercial, or Editorial"
    );
  }
}
