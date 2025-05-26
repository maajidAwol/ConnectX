'use client';

import { useState } from 'react';
import { DocPageHeader } from "../../components/doc-page-header";
import { DocsPager } from "../../components/pager";
import { DocSection } from "../../components/doc-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CurlExample {
  title: string;
  description: string;
  command: string;
  response?: string;
}

const curlExamples: Record<string, CurlExample[]> = {
  "Authentication": [
    {
      title: "Login",
      description: "Authenticate and get access token",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/login/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'`,
      response: `{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}`
    },
    {
      title: "Refresh Token",
      description: "Get new access token using refresh token",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/token/refresh/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "refresh": "your_refresh_token"
  }'`,
      response: `{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}`
    }
  ],
  "Users": [
    {
      title: "List Users",
      description: "Get a list of users with pagination",
      command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/users/?page=1&size=10' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
      response: `{
  "count": 100,
  "next": "https://connectx-backend-4o0i.onrender.com/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`
    },
    {
      title: "Create User",
      description: "Create a new user account",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "customer"
  }'`,
      response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}`
    }
  ],
  "Products": [
    {
      title: "List Products",
      description: "Get a list of products with filters",
      command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/products/?filter_type=public&min_price=100&max_price=1000&category=electronics' \\
  -H 'Authorization: Bearer YOUR_API_KEY'`,
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
      "is_public": true
    }
  ]
}`
    },
    {
      title: "Create Product",
      description: "Create a new product",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/products/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "name": "Product Name",
    "description": "Product Description",
    "base_price": 99.99,
    "category": "123e4567-e89b-12d3-a456-426614174000",
    "is_public": true
  }'`,
      response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Product Name",
  "description": "Product Description",
  "base_price": 99.99,
  "category": "123e4567-e89b-12d3-a456-426614174000",
  "is_public": true,
  "created_at": "2024-01-01T00:00:00Z"
}`
    }
  ],
  "Orders": [
    {
      title: "Create Order",
      description: "Create a new order with items",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/orders/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
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
    }
  ],
  "Payments": [
    {
      title: "Initialize Chapa Payment",
      description: "Initialize a payment transaction with Chapa",
      command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/payments/initialize_chapa_payment/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000",
    "phone_number": "+251912345678",
    "return_url": "https://your-frontend.com/payment-complete"
  }'`,
      response: `{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "payment_id": "123e4567-e89b-12d3-a456-426614174000",
    "checkout_url": "https://checkout.chapa.co/checkout/123",
    "tx_ref": "tx-123456789"
  }
}`
    }
  ]
};

export default function CurlExamplesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CurlExample, category: string) => {
    const id = `${category}-${example.title}`;
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
        heading="cURL Examples"
        text="Example cURL commands for interacting with the ConnectX API"
      />

      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          {Object.keys(curlExamples).map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(curlExamples).map(([category, examples]) => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-4">
            {examples.map((example) => renderExample(example, category))}
          </TabsContent>
        ))}
      </Tabs>

      <DocsPager />
    </div>
  );
} 