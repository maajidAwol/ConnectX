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
    title: "Login",
    description: "Authenticate a user and get JWT tokens.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/login/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'`,
    response: `{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer",
    "is_verified": true,
    "tenant": "123e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}`
  },
  {
    title: "Refresh Token",
    description: "Get a new access token using a refresh token.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/auth/refresh/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'`,
    response: `{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}`
  }
];

export default function LoginPage() {
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
        heading="Login"
        text="Learn how to authenticate users in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The login endpoint allows users to authenticate and receive JWT tokens for accessing protected resources. The system uses email and password for authentication and requires email verification before allowing login.
        </p>
      </DocSection>

      <DocSection title="Authentication Flow" defaultOpen={true}>
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>User submits email and password</li>
            <li>System verifies credentials and email verification status</li>
            <li>If verified, system returns:
              <ul className="list-disc pl-6 mt-2">
                <li>Access token (short-lived)</li>
                <li>Refresh token (long-lived)</li>
                <li>User data</li>
              </ul>
            </li>
            <li>If not verified, system returns error asking to verify email</li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Request Format" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Login Request</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "email": "string (required)",
  "password": "string (required)"
}`}</code>
          </pre>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Refresh Token Request</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "refresh": "string (required)"
}`}</code>
          </pre>
        </div>
      </DocSection>

      <DocSection title="Response Format" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Login Response</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "access": "string (JWT access token)",
  "refresh": "string (JWT refresh token)",
  "user": {
    "id": "UUID",
    "name": "string",
    "email": "string",
    "role": "string",
    "is_verified": "boolean",
    "tenant": "UUID",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}`}</code>
          </pre>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Refresh Token Response</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "access": "string (new JWT access token)"
}`}</code>
          </pre>
        </div>
      </DocSection>

      <DocSection title="Error Responses" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Common Errors</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>401 Unauthorized</strong>
              <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "error": "Invalid credentials"
}`}</code>
              </pre>
            </li>
            <li>
              <strong>403 Forbidden</strong>
              <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "error": "Please verify your email address before logging in.",
  "email": "user@example.com"
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