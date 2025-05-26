'use client';

import { useState } from 'react';
import { DocPageHeader } from "../../components/doc-page-header";
import { DocsPager } from "../../components/pager";
import { DocSection } from "../../components/doc-section";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CurlExample {
  title: string;
  description: string;
  command: string;
  response?: string;
}

const curlExamples: CurlExample[] = [
  {
    title: "Create Review",
    description: "Create a new review for a product. You must have purchased the product to review it.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/reviews/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 5,
    "title": "Great Product!",
    "comment": "This product exceeded my expectations."
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "product": "123e4567-e89b-12d3-a456-426614174000",
  "user": "123e4567-e89b-12d3-a456-426614174001",
  "rating": 5,
  "title": "Great Product!",
  "comment": "This product exceeded my expectations.",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Get Product Reviews",
    description: "Get all reviews for a specific product with pagination.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/product-reviews/?product_id=123e4567-e89b-12d3-a456-426614174000' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "product": "123e4567-e89b-12d3-a456-426614174000",
      "user": "123e4567-e89b-12d3-a456-426614174001",
      "rating": 5,
      "title": "Great Product!",
      "comment": "This product exceeded my expectations.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}`
  },
  {
    title: "Get Product Review Statistics",
    description: "Get comprehensive review statistics for a specific product.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/product-stats/?product_id=123e4567-e89b-12d3-a456-426614174000' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "total_reviews": 10,
  "average_rating": 4.5,
  "rating_distribution": {
    "1": 1,
    "2": 0,
    "3": 1,
    "4": 3,
    "5": 5
  }
}`
  },
  {
    title: "Get Product Review Summary",
    description: "Get both reviews and statistics for a product in a single response.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/product-summary/?product_id=123e4567-e89b-12d3-a456-426614174000&limit=5' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "reviews": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "product": "123e4567-e89b-12d3-a456-426614174000",
      "user": "123e4567-e89b-12d3-a456-426614174001",
      "rating": 5,
      "title": "Great Product!",
      "comment": "This product exceeded my expectations.",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "total_reviews": 10,
    "average_rating": 4.5,
    "rating_distribution": {
      "1": 1,
      "2": 0,
      "3": 1,
      "4": 3,
      "5": 5
    }
  }
}`
  },
  {
    title: "Get My Reviews",
    description: "Get all reviews created by the authenticated user.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/my_reviews/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "rating": 5,
    "title": "Great Product!",
    "comment": "This product exceeded my expectations.",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]`
  }
];

export default function ReviewsOverviewPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CurlExample) => {
    const id = `curl-${example.title}`;
    return (
      <div key={id} className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{example.description}</p>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Command</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(example.command, `${id}-command`)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {copied === `${id}-command` ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </Button>
          </div>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{example.command}</code>
          </pre>
        </div>

        {example.response && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Response</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(example.response!, `${id}-response`)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {copied === `${id}-response` ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </Button>
            </div>
            <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
              <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{example.response}</code>
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Reviews API Overview"
        text="Learn how to manage product reviews in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Reviews API allows you to manage product reviews in ConnectX. Users can create, read, update, and delete their reviews, as well as view review statistics for products.
        </p>
      </DocSection>

      <DocSection title="Authentication" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Most API requests require authentication using an API key. Include your API key in the Authorization header:
        </p>
        <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</code>
        </pre>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Note: Some endpoints like viewing product reviews and statistics are publicly accessible without authentication.
        </p>
      </DocSection>

      <DocSection title="Base URL" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All API endpoints are relative to the base URL:
        </p>
        <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">https://connectx-backend-4o0i.onrender.com/api</code>
        </pre>
      </DocSection>

      <DocSection title="Endpoints" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Reviews</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /reviews/</code> - Create a new review</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/product-reviews/</code> - Get product reviews</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/product-stats/</code> - Get product review statistics</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/product-summary/</code> - Get product review summary</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/my_reviews/</code> - Get user's reviews</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Access Control" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">User Permissions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Users can only create reviews for products they have purchased</li>
              <li>Users can only update or delete their own reviews</li>
              <li>Anyone can view product reviews and statistics</li>
              <li>Users can only view their own reviews through the my_reviews endpoint</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Review Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Rating must be between 1 and 5</li>
              <li>Comment is required for all reviews</li>
              <li>Title is optional but recommended</li>
              <li>Users can only review a product once</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="cURL Examples" defaultOpen={true}>
        <div className="space-y-8">
          {curlExamples.map((example) => renderExample(example))}
        </div>
      </DocSection>

      <DocsPager
        prev={{
          label: "Shipping",
          href: "/docs/shipping/overview",
        }}
        next={{
          label: "Products",
          href: "/docs/products/overview",
        }}
      />
    </div>
  );
} 