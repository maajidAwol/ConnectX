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
    title: "Register User",
    description: "Create a new user account.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password",
    "role": "customer",
    "tenant": "123e4567-e89b-12d3-a456-426614174001"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "is_verified": false,
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Verify Email",
    description: "Verify user's email address using OTP.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/verify-email/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'`,
    response: `{
  "message": "Email verified successfully"
}`
  },
  {
    title: "Resend Verification",
    description: "Request a new verification email.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/resend-verification/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "john@example.com"
  }'`,
    response: `{
  "message": "Verification email sent successfully"
}`
  }
];

export default function RegisterPage() {
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
        heading="Register"
        text="Learn how to register new users in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The registration process in ConnectX involves creating a new user account and verifying the user's email address. Users must verify their email before they can log in to the system.
        </p>
      </DocSection>

      <DocSection title="Registration Flow" defaultOpen={true}>
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>User submits registration form with required information</li>
            <li>System creates new user account with default role "customer"</li>
            <li>System sends verification email with OTP</li>
            <li>User verifies email using OTP</li>
            <li>User can now log in to the system</li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Request Format" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Register Request</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 8 characters)",
  "role": "string (optional, default: customer)",
  "tenant": "UUID (optional)"
}`}</code>
          </pre>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Verify Email Request</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "email": "string (required)",
  "otp": "string (required)"
}`}</code>
          </pre>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Resend Verification Request</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "email": "string (required)"
}`}</code>
          </pre>
        </div>
      </DocSection>

      <DocSection title="Response Format" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Register Response</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "id": "UUID",
  "name": "string",
  "email": "string",
  "role": "string",
  "is_verified": "boolean",
  "tenant": "UUID",
  "created_at": "datetime",
  "updated_at": "datetime"
}`}</code>
          </pre>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Verify Email Response</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "message": "string"
}`}</code>
          </pre>
        </div>
      </DocSection>

      <DocSection title="Error Responses" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Common Errors</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>400 Bad Request</strong>
              <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "error": "Email already exists"
}`}</code>
              </pre>
            </li>
            <li>
              <strong>400 Bad Request</strong>
              <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "error": "Invalid OTP"
}`}</code>
              </pre>
            </li>
          </ul>
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