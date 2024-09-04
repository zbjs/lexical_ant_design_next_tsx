import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import News from "@/models/News";

export async function GET(request: Request) {
  await connectToDatabase();

  try {
    const news = await News.find();
    console.log("Fetched news:", news);
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { message: "Error fetching news" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { title, slug, content } = body;

    console.log("Received data:", { title, slug, content });

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    const news = await News.create({
      title,
      slug,
      content,
    });

    console.log("Saved news:", news);
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error saving news:", error);
    return NextResponse.json(
      { message: "Error saving content" },
      { status: 500 }
    );
  }
}
