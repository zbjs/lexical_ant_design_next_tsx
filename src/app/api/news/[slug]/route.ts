import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import News from "@/models/News";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await connectToDatabase();

  try {
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { message: "Error fetching news" },
      { status: 500 }
    );
  }
}
