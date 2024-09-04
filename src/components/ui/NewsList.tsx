// src/components/NewsList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  content: any; // Adjust this type based on the actual content structure
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to fetch news.",
        });
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const columns: ColumnsType<NewsItem> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            router.push(`/news/${record.slug}`); // Navigate to details page
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">News List</h1>
      <Table
        dataSource={news}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default NewsList;
