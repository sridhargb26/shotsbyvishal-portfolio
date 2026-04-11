import { NextResponse } from "next/server";
import { fetchCloudinaryPhotos, isCloudinaryConfigured } from "@/lib/cloudinary-photos";

export async function GET() {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ photos: [] });
    }
    const photos = await fetchCloudinaryPhotos();
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
