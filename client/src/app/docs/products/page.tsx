'use client';

import { useState } from 'react';
import { DocPageHeader } from "../components/doc-page-header";
import { DocsPager } from "../components/pager";
import { DocSection } from "../components/doc-section";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CurlExample {
  title: string;
  description: string;
  command: string;
  response?: string;
}

const productApiExamples: CurlExample[] = [
  {
    title: "Get All Products",
    description: "Retrieve a list of all products with optional filtering",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/products/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "count": 50,
  "next": "https://connectx-backend-4o0i.onrender.com/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Smartphone",
      "description": "Latest model smartphone",
      "base_price": 999.99,
      "category": "electronics",
      "is_public": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`
  },
  {
    title: "Get Product by ID",
    description: "Retrieve a specific product by its ID",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/products/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Smartphone",
  "description": "Latest model smartphone",
  "base_price": 999.99,
  "category": "electronics",
  "is_public": true,
  "created_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Create Product",
    description: "Create a new product",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/products/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "New Product",
    "description": "Product description",
    "base_price": 99.99,
    "category": "electronics",
    "is_public": true
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "New Product",
  "description": "Product description",
  "base_price": 99.99,
  "category": "electronics",
  "is_public": true,
  "created_at": "2024-01-01T00:00:00Z"
}`
  }
];

export default function ProductApiPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CurlExample) => {
    const id = `product-api-${example.title}`;
    return (
      <DocSection key={id} title={example.title} defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700">{example.description}</p>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Command</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(example.command, `${id}-command`)}
              >
                {copied === `${id}-command` ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="mt-2 rounded-lg bg-gray-100 p-4 overflow-x-auto">
              <code>{example.command}</code>
            </pre>
          </div>

          {example.response && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Response</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(example.response!, `${id}-response`)}
                >
                  {copied === `${id}-response` ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="mt-2 rounded-lg bg-gray-100 p-4 overflow-x-auto">
                <code>{example.response}</code>
              </pre>
            </div>
          )}
        </div>
      </DocSection>
    );
  };

  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Product API"
        text="Example cURL commands for product endpoints"
      />

      <div className="space-y-4">
        {productApiExamples.map((example) => renderExample(example))}
      </div>

      <DocsPager />
    </div>
  );
}
