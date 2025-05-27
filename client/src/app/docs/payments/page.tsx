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

const paymentExamples: CurlExample[] = [
  {
    title: "Initialize Chapa Payment",
    description: "Initialize a payment transaction with Chapa",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/payments/initialize_chapa_payment/' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
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
  },
  {
    title: "Verify Payment",
    description: "Verify a payment transaction status",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/payments/verify/123e4567-e89b-12d3-a456-426614174000' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`,
    response: `{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "completed",
    "amount": 199.98,
    "currency": "ETB",
    "transaction_ref": "tx-123456789"
  }
}`
  }
];

export default function PaymentsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CurlExample) => {
    const id = `payment-${example.title}`;
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
        heading="Payments API"
        text="Example cURL commands for payment endpoints"
      />

      <div className="space-y-4">
        {paymentExamples.map((example) => renderExample(example))}
      </div>

      <DocsPager />
    </div>
  );
} 