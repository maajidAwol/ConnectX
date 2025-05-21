'use client';

import { useState } from 'react';
import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CurlExample {
  title: string;
  description: string;
  command: string;
  response?: string;
}

const curlExamples: CurlExample[] = [
  {
    title: "List Payments",
    description: "Get a list of all payments",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/payments/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "order": "123e4567-e89b-12d3-a456-426614174001",
      "order_number": "ORD-2024-001",
      "amount": "1999.98",
      "payment_method": "chapa",
      "status": "pending",
      "transaction_id": "TX-1234567890ABCDEF",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "order": "123e4567-e89b-12d3-a456-426614174003",
      "order_number": "ORD-2024-002",
      "amount": "1499.99",
      "payment_method": "cod",
      "status": "completed",
      "transaction_id": "COD-2024-002",
      "created_at": "2024-01-02T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ]
}`
  },
  {
    title: "Initialize Chapa Payment",
    description: "Initialize a new payment transaction with Chapa payment gateway",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/payments/initialize_chapa_payment/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "order_id": "123e4567-e89b-12d3-a456-426614174000",
    "phone_number": "+251912345678",
    "return_url": "https://your-frontend.com/payment-complete"
  }'`,
    response: `{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "payment_id": "123e4567-e89b-12d3-a456-426614174004",
    "checkout_url": "https://checkout.chapa.co/checkout/payment/1234567890",
    "tx_ref": "TX-1234567890ABCDEF"
  }
}`
  },
  {
    title: "Verify Chapa Payment",
    description: "Verify the status of a Chapa payment transaction",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/payments/verify_chapa_payment/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "tx_ref": "TX-1234567890ABCDEF"
  }'`,
    response: `{
  "status": "success",
  "message": "Payment verified successfully",
  "payment": {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "order": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-2024-001",
    "amount": "1999.98",
    "payment_method": "chapa",
    "status": "completed",
    "transaction_id": "TX-1234567890ABCDEF",
    "verification_data": {
      "status": "success",
      "message": "Payment verified successfully",
      "data": {
        "id": "1234567890",
        "tx_ref": "TX-1234567890ABCDEF",
        "amount": "1999.98",
        "currency": "ETB",
        "status": "success"
      }
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}`
  },
  {
    title: "Confirm Cash on Delivery Payment",
    description: "Confirm receipt of payment for Cash on Delivery orders (Tenant Owner only)",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/payments/123e4567-e89b-12d3-a456-426614174002/confirm_cod_payment/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "confirmation_note": "Payment received in cash"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "order": "123e4567-e89b-12d3-a456-426614174003",
  "order_number": "ORD-2024-002",
  "amount": "1499.99",
  "payment_method": "cod",
  "status": "completed",
  "transaction_id": "COD-2024-002",
  "created_at": "2024-01-02T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}`
  }
];

export default function PaymentsOverviewPage() {
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
        heading="Payments API Overview"
        text="Learn how to interact with the ConnectX Payments API"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Payments API allows you to manage payments in your ConnectX store. You can initialize payments, verify transactions, and handle both Chapa online payments and Cash on Delivery orders.
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
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Payments</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /payments/</code> - List all payments</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /payments/initialize_chapa_payment/</code> - Initialize Chapa payment</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /payments/verify_chapa_payment/</code> - Verify Chapa payment</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /payments/{'{id}'}/confirm_cod_payment/</code> - Confirm Cash on Delivery payment</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Payment Methods" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Chapa Online Payment</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Chapa is our primary online payment gateway. It supports various payment methods including bank transfers, mobile money, and credit/debit cards. The payment flow consists of:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Initialize payment with order details</li>
              <li>Redirect customer to Chapa checkout page</li>
              <li>Verify payment status after completion</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Cash on Delivery (COD)</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For Cash on Delivery orders, the payment is confirmed by the tenant owner after receiving the payment from the customer. The confirmation process includes:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Create order with COD payment method</li>
              <li>Deliver order to customer</li>
              <li>Confirm payment receipt through the API</li>
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
  )
} 