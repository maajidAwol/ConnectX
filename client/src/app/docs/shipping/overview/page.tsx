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
    title: "List Shipping Addresses",
    description: "Get a list of shipping addresses for the current authenticated user.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/shipping/my_address/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "user": "123e4567-e89b-12d3-a456-426614174001",
    "address_line1": "456 Oak Ave",
    "address_line2": null,
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90001",
    "country": "USA",
    "is_default": false,
    "created_at": "2024-01-02T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
]`
  },
  {
    title: "Create Shipping Address",
    description: "Create a new shipping address for the current user.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/shipping/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "address_line1": "789 Pine St",
    "address_line2": "Suite 100",
    "city": "Chicago",
    "state": "IL",
    "postal_code": "60601",
    "country": "USA",
    "is_default": false
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "user": "123e4567-e89b-12d3-a456-426614174001",
  "address_line1": "789 Pine St",
  "address_line2": "Suite 100",
  "city": "Chicago",
  "state": "IL",
  "postal_code": "60601",
  "country": "USA",
  "is_default": false,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}`
  },
  {
    title: "Update Shipping Address",
    description: "Update an existing shipping address.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/shipping/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "address_line1": "Updated Address",
    "city": "Updated City",
    "is_default": true
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user": "123e4567-e89b-12d3-a456-426614174001",
  "address_line1": "Updated Address",
  "address_line2": "Apt 4B",
  "city": "Updated City",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  },
  {
    title: "Delete Shipping Address",
    description: "Delete a shipping address.",
    command: `curl -X DELETE 'https://connectx-backend-4o0i.onrender.com/api/shipping/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
    response: `{
  "message": "Shipping address deleted successfully"
}`
  }
];

export default function ShippingOverviewPage() {
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
        heading="Shipping API Overview"
        text="Learn how to manage shipping addresses in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Shipping API allows you to manage shipping addresses for users in ConnectX. You can create, update, and delete shipping addresses, as well as retrieve addresses for specific users.
        </p>
      </DocSection>

      <DocSection title="Authentication" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All API requests require authentication using a Bearer token. Include your access token in the Authorization header:
        </p>
        <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
          <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">Authorization: Bearer YOUR_ACCESS_TOKEN</code>
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
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Shipping Addresses</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /shipping/my_address/</code> - List current user's addresses</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /shipping/</code> - Create a new address</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /shipping/{'{id}'}/</code> - Update an address</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">DELETE /shipping/{'{id}'}/</code> - Delete an address</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Access Control" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">User Permissions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Regular users can only manage their own shipping addresses</li>
              <li>Users can create, update, and delete their own shipping addresses</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Default Address</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Users can set one address as their default shipping address</li>
              <li>Setting a new default address will automatically unset the previous default</li>
              <li>The default address is used for new orders unless specified otherwise</li>
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