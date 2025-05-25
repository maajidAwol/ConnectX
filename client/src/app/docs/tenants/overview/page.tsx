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
    title: "List Tenants",
    description: "Get a list of all tenants. Admin users can see all tenants, while owners and customers can only see their own tenant.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/tenants/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Tech Store",
      "email": "tech@store.com",
      "logo": "https://example.com/logos/tech-store.png",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Fashion Boutique",
      "email": "fashion@boutique.com",
      "logo": "https://example.com/logos/fashion-boutique.png",
      "is_verified": false,
      "created_at": "2024-01-02T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ]
}`
  },
  {
    title: "Create Tenant",
    description: "Create a new tenant and automatically create a tenant owner user account.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/tenants/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "New Store",
    "email": "store@example.com",
    "password": "securepassword123",
    "fullname": "John Doe"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "name": "New Store",
  "email": "store@example.com",
  "logo": null,
  "is_verified": false,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}`
  },
  {
    title: "Get Current Tenant",
    description: "Get details of the current user's tenant.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/tenants/me/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Tech Store",
  "email": "tech@store.com",
  "logo": "https://example.com/logos/tech-store.png",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Update Tenant",
    description: "Update tenant details. Only tenant owners can update their tenant information.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/tenants/123e4567-e89b-12d3-a456-426614174000/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'name=Updated Store Name' \\
  -F 'logo=@/path/to/logo.png'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Store Name",
  "email": "tech@store.com",
  "logo": "https://example.com/logos/updated-store.png",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  },
  {
    title: "Update Verification Status",
    description: "Update tenant verification status. Only admin users can update verification status.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/tenants/123e4567-e89b-12d3-a456-426614174001/verification-status/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "is_verified": true
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Fashion Boutique",
  "email": "fashion@boutique.com",
  "logo": "https://example.com/logos/fashion-boutique.png",
  "is_verified": true,
  "created_at": "2024-01-02T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  }
];

export default function TenantsOverviewPage() {
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
        heading="Tenants API Overview"
        text="Learn how to interact with the ConnectX Tenants API"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Tenants API allows you to manage tenant accounts in ConnectX. Each tenant represents a store or business entity that can manage their own products, orders, and users.
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
          Note: The create tenant endpoint does not require authentication as it is used for initial tenant registration.
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
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Tenants</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /tenants/</code> - List tenants</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /tenants/</code> - Create a new tenant</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /tenants/me/</code> - Get current tenant</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /tenants/{'{id}'}/</code> - Update tenant</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /tenants/{'{id}'}/verification-status/</code> - Update verification status</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Access Control" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Role-Based Access</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Admin users can view and manage all tenants</li>
              <li>Tenant owners can only view and update their own tenant</li>
              <li>Regular users can only view their tenant's information</li>
              <li>Tenant creation is open to all (no authentication required)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Verification Process</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tenant verification is managed by admin users. The verification process includes:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Tenant submits required documentation</li>
              <li>Admin reviews the documentation</li>
              <li>Admin updates verification status through the API</li>
            </ol>
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