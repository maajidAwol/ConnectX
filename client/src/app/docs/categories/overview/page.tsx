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
    title: "List Categories",
    description: "Get a list of categories for the current tenant.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/categories/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "tenant": "123e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Clothing",
    "description": "Apparel and fashion items",
    "tenant": "123e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]`
  },
  {
    title: "Get Category",
    description: "Get details of a specific category.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/categories/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Create Category",
    description: "Create a new category. Only tenant owners can create categories.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/categories/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Home & Kitchen",
    "description": "Home appliances and kitchen items"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "name": "Home & Kitchen",
  "description": "Home appliances and kitchen items",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}`
  },
  {
    title: "Update Category",
    description: "Update an existing category. Only tenant owners can update categories.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/categories/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Electronics & Gadgets",
    "description": "Updated description for electronics category"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Electronics & Gadgets",
  "description": "Updated description for electronics category",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  },
  {
    title: "Delete Category",
    description: "Delete a category. Only tenant owners can delete categories.",
    command: `curl -X DELETE 'https://connectx-backend-4o0i.onrender.com/api/categories/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
    response: `{
  "message": "Category deleted successfully"
}`
  }
];

export default function CategoriesOverviewPage() {
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
        heading="Categories API Overview"
        text="Learn how to manage product categories in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Categories API allows you to manage product categories in ConnectX. Categories help organize products and make them easier to find. Each tenant can create and manage their own categories.
        </p>
      </DocSection>

      <DocSection title="Authentication" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All API requests require authentication using an API key. Include your API key in the Authorization header:
        </p>
        <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</code>
        </pre>
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
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Categories</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /categories/</code> - List categories</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /categories/{'{id}'}/</code> - Get category details</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /categories/</code> - Create a new category</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /categories/{'{id}'}/</code> - Update a category</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">DELETE /categories/{'{id}'}/</code> - Delete a category</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Access Control" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Category Permissions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>All authenticated users can view categories</li>
              <li>Only tenant owners can create, update, and delete categories</li>
              <li>Users can only access categories within their own tenant</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Category Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Category name is required and must be unique within a tenant</li>
              <li>Description is optional but recommended</li>
              <li>Categories are automatically associated with the tenant of the creating user</li>
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