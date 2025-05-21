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

const orderExamples: CurlExample[] = [
  {
    title: "Create Order",
    description: "Create a new order with items",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/orders/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -d '{
    "items": [
      {
        "product_id": "123e4567-e89b-12d3-a456-426614174000",
        "quantity": 2
      }
    ]
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "order_number": "ORD-2024-001",
  "status": "pending",
  "total_amount": 199.98,
  "items": [
    {
      "product_id": "123e4567-e89b-12d3-a456-426614174000",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "List Orders",
    description: "Get a list of orders with pagination",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/orders/?page=1&size=10' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
    response: `{
  "count": 25,
  "next": "https://connectx-backend-4o0i.onrender.com/api/orders/?page=2",
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "order_number": "ORD-2024-001",
      "status": "pending",
      "total_amount": 199.98,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`
  }
];

export default function OrdersPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CurlExample) => {
    const id = `order-${example.title}`;
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
        heading="Orders API"
        text="Example cURL commands for order endpoints"
      />

      <div className="space-y-4">
        {orderExamples.map((example) => renderExample(example))}
      </div>

      <DocsPager />
    </div>
  );
} 