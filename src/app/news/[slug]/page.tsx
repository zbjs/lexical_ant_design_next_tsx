"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface NewsItem {
  title: string;
  slug: string;
  content: string;
}

export default function NewsPage() {
  const { slug } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsItem() {
      const response = await fetch(`/api/news/${slug}`);
      const data = await response.json();
      setNewsItem(data);
      setLoading(false);
    }
    fetchNewsItem();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!newsItem) {
    return <div>News not found</div>;
  }

  return (
    <div>
      <h1>{newsItem.title}</h1>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: newsItem.content }}
      />
      <Link href="/news">Back to news list</Link>
    </div>
  );
}
