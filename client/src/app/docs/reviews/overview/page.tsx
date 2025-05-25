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
    title: "List Reviews",
    description: "Get a list of reviews. You can filter reviews by product ID.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/?product=123e4567-e89b-12d3-a456-426614174000' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality.",
    "is_purchased": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "user": "123e4567-e89b-12d3-a456-426614174003",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 4,
    "comment": "Good product, but could be better.",
    "is_purchased": true,
    "created_at": "2024-01-02T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
]`
  },
  {
    title: "Get My Reviews",
    description: "Get all reviews created by the current authenticated user.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/my_reviews/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality.",
    "is_purchased": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]`
  },
  {
    title: "Get Product Reviews",
    description: "Get all reviews for a specific product.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/reviews/product_reviews/?product=123e4567-e89b-12d3-a456-426614174000' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality.",
    "is_purchased": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "user": "123e4567-e89b-12d3-a456-426614174003",
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 4,
    "comment": "Good product, but could be better.",
    "is_purchased": true,
    "created_at": "2024-01-02T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
]`
  },
  {
    title: "Create Review",
    description: "Create a new review for a product. You must have purchased the product before reviewing it.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/reviews/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "product": "123e4567-e89b-12d3-a456-426614174000",
    "rating": 5,
    "comment": "Excellent product! Very satisfied with the quality."
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "user": "123e4567-e89b-12d3-a456-426614174001",
  "product": "123e4567-e89b-12d3-a456-426614174000",
  "rating": 5,
  "comment": "Excellent product! Very satisfied with the quality.",
  "is_purchased": true,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}`
  },
  {
    title: "Update Review",
    description: "Update an existing review. You can only update your own reviews.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/reviews/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "rating": 4,
    "comment": "Updated review comment"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user": "123e4567-e89b-12d3-a456-426614174001",
  "product": "123e4567-e89b-12d3-a456-426614174000",
  "rating": 4,
  "comment": "Updated review comment",
  "is_purchased": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  },
  {
    title: "Delete Review",
    description: "Delete a review. You can only delete your own reviews.",
    command: `curl -X DELETE 'https://connectx-backend-4o0i.onrender.com/api/reviews/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
    response: `{
  "message": "Review deleted successfully"
}`
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
          The Reviews API allows you to manage product reviews in ConnectX. Users can create, update, and delete reviews for products they have purchased. Reviews help other users make informed decisions about products.
        </p>
      </DocSection>

      <DocSection title="Authentication" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Most API requests require authentication using a Bearer token. Include your access token in the Authorization header:
        </p>
        <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">Authorization: Bearer YOUR_ACCESS_TOKEN</code>
        </pre>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Note: Some endpoints like listing reviews and getting product reviews do not require authentication.
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
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/</code> - List reviews (filter by product)</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/my_reviews/</code> - Get current user's reviews</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /reviews/product_reviews/</code> - Get reviews for a specific product</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /reviews/</code> - Create a new review</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /reviews/{'{id}'}/</code> - Update a review</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">DELETE /reviews/{'{id}'}/</code> - Delete a review</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Access Control" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Review Permissions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Anyone can view reviews for products</li>
              <li>Only authenticated users who have purchased the product can create reviews</li>
              <li>Users can only update or delete their own reviews</li>
              <li>Users cannot review the same product multiple times</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Review Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Reviews must include a rating (1-5 stars)</li>
              <li>Reviews can include an optional comment</li>
              <li>Users must have purchased the product before reviewing it</li>
              <li>Reviews are automatically marked as verified purchases</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="cURL Examples" defaultOpen={true}>
        <div className="space-y-8">
          {curlExamples.map((example) => renderExample(example))}
        </div>
      </DocSection>

      <DocsPager />
    </div>
  );
} 