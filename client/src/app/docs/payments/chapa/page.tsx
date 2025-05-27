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
  }
];

export default function ChapaPaymentPage() {
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
        heading="Chapa Payment Integration"
        text="Learn how to integrate and use Chapa payments in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Chapa is a payment gateway that allows you to accept payments from customers in Ethiopia and other African countries. ConnectX provides a seamless integration with Chapa to handle online payments for your orders.
        </p>
      </DocSection>

      <DocSection title="Features" defaultOpen={true}>
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Support for multiple payment methods (bank transfers, mobile money, cards)</li>
            <li>Secure payment processing with encryption</li>
            <li>Real-time payment status updates</li>
            <li>Automatic order status updates after successful payment</li>
            <li>Support for both test and production environments</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Integration Steps" defaultOpen={true}>
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Initialize Payment:</strong> Call the initialize endpoint with order details to get a checkout URL
            </li>
            <li>
              <strong>Redirect Customer:</strong> Redirect the customer to the Chapa checkout page using the provided URL
            </li>
            <li>
              <strong>Handle Callback:</strong> Chapa will redirect back to your return_url after payment completion
            </li>
            <li>
              <strong>Verify Payment:</strong> Verify the payment status using the transaction reference
            </li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Payment Flow" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Customer places an order on your platform</li>
              <li>Your system calls the initialize payment endpoint</li>
              <li>Customer is redirected to Chapa checkout page</li>
              <li>Customer completes payment on Chapa</li>
              <li>Chapa redirects back to your return_url</li>
              <li>Your system verifies the payment status</li>
              <li>Order status is updated based on payment result</li>
            </ol>
          </div>
        </div>
      </DocSection>

      <DocSection title="API Endpoints" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Available Endpoints</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /payments/initialize_chapa_payment/</code> - Initialize a new payment</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /payments/verify_chapa_payment/</code> - Verify payment status</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Error Handling" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Common Error Scenarios</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Invalid order ID or amount</li>
              <li>Network connectivity issues</li>
              <li>Payment timeout or cancellation</li>
              <li>Invalid transaction reference</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Error Response Format</h3>
            <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
              <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "status": "error",
  "message": "Error message describing the issue",
  "code": "ERROR_CODE"
}`}</code>
            </pre>
          </div>
        </div>
      </DocSection>

      <DocSection title="Testing" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Test Environment</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              ConnectX provides a test environment for Chapa integration. Use the following test credentials:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Test Card Number: 4242 4242 4242 4242</li>
              <li>Expiry Date: Any future date</li>
              <li>CVV: Any 3 digits</li>
              <li>OTP: 123456</li>
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