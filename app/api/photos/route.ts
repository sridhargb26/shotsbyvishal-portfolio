import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("folder:shotsbyvishal/*")
      .sort_by("created_at", "desc")
      .with_field("context")
      .max_results(50)
      .execute();

    const photos = result.resources.map((r: any) => ({
      id: r.public_id,
      src: r.secure_url,
      category: r.context?.custom?.category || "All",
      title: r.context?.custom?.title || r.public_id.split("/").pop(),
    }));

    return NextResponse.json({ photos });
  } catch (err) {
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
