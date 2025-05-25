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
    title: "List Users",
    description: "Get a list of users. Admin users can see all users, while owners and members can only see users in their tenant.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/users/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "tenant": "123e4567-e89b-12d3-a456-426614174001",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "customer",
      "tenant": "123e4567-e89b-12d3-a456-426614174001",
      "is_verified": true,
      "created_at": "2024-01-02T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ]
}`
  },
  {
    title: "Create User",
    description: "Create a new user. The role and permissions depend on who is creating the user.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "securepassword123",
    "role": "member"
  }'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "name": "New User",
  "email": "newuser@example.com",
  "role": "member",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "is_verified": false,
  "created_at": "2024-01-03T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}`
  },
  {
    title: "Get Current User",
    description: "Get details of the currently authenticated user.",
    command: `curl -X GET 'https://connectx-backend-4o0i.onrender.com/api/users/me/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}`
  },
  {
    title: "Update User Profile",
    description: "Update the current user's profile information.",
    command: `curl -X PATCH 'https://connectx-backend-4o0i.onrender.com/api/users/me/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'name=Updated Name' \\
  -F 'bio=New bio information' \\
  -F 'phone_number=+1234567890' \\
  -F 'avatar=@/path/to/avatar.png'`,
    response: `{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Name",
  "email": "john@example.com",
  "role": "member",
  "tenant": "123e4567-e89b-12d3-a456-426614174001",
  "is_verified": true,
  "bio": "New bio information",
  "phone_number": "+1234567890",
  "avatar_url": "https://example.com/avatars/user-123.png",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-04T00:00:00Z"
}`
  },
  {
    title: "Change Password",
    description: "Change the current user's password.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/change-password/' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "old_password": "currentpassword123",
    "new_password": "newsecurepassword456"
  }'`,
    response: `{
  "message": "Password changed successfully"
}`
  },
  {
    title: "Request Password Reset",
    description: "Request a password reset email for a user.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/reset-password-request/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com"
  }'`,
    response: `{
  "message": "Password reset email sent"
}`
  },
  {
    title: "Reset Password",
    description: "Reset a user's password using a reset token.",
    command: `curl -X POST 'https://connectx-backend-4o0i.onrender.com/api/users/reset-password/' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "token": "reset-token-from-email",
    "new_password": "newsecurepassword456"
  }'`,
    response: `{
  "message": "Password has been reset successfully"
}`
  }
];

export default function UsersOverviewPage() {
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
        heading="Users API Overview"
        text="Learn how to interact with the ConnectX Users API"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The Users API allows you to manage user accounts in ConnectX. You can create users, update profiles, manage passwords, and handle user authentication.
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
          Note: Some endpoints like password reset request and user creation do not require authentication.
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
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Users</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /users/</code> - List users</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /users/</code> - Create a new user</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /users/me/</code> - Get current user</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PATCH /users/me/</code> - Update user profile</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /users/change-password/</code> - Change password</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /users/reset-password-request/</code> - Request password reset</li>
              <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /users/reset-password/</code> - Reset password</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="User Roles" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Available Roles</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Admin</strong> - Full system access, can manage all tenants and users</li>
              <li><strong>Owner</strong> - Can manage their tenant and its users</li>
              <li><strong>Member</strong> - Can access tenant resources but with limited permissions</li>
              <li><strong>Customer</strong> - Basic user access for making purchases</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Role-Based Access</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Admins can create and manage users across all tenants</li>
              <li>Owners can create and manage users within their tenant</li>
              <li>Members can view user information within their tenant</li>
              <li>Customers can only manage their own profile</li>
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