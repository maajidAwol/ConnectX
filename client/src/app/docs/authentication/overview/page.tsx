'use client';

import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"

export default function AuthenticationOverviewPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Authentication Overview"
        text="Learn how to authenticate and manage users in ConnectX"
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          ConnectX uses JWT tokens for authentication. The authentication system supports user registration, login, email verification, and password management. 
        </p>
      </DocSection>

      <DocSection title="User Roles" defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            ConnectX supports the following user roles:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Admin</strong> - System administrators with full access</li>
            <li><strong>Owner</strong> - Tenant owners who can manage their tenant's resources</li>
            <li><strong>Member</strong> - Tenant members with limited access</li>
            <li><strong>Customer</strong> - Regular users with basic access (default role)</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="User Model" defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            The User model contains the following fields:
          </p>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{`{
  "id": "UUID",
  "tenant": "UUID (optional)",
  "name": "string",
  "email": "string (unique)",
  "role": "string (admin|owner|member|customer)",
  "bio": "string (optional)",
  "phone_number": "string (optional)",
  "is_verified": "boolean",
  "avatar_url": "string (optional)",
  "is_active": "boolean",
  "is_staff": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}`}</code>
          </pre>
        </div>
      </DocSection>

      <DocSection title="Authentication Flow" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Registration</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>User submits registration form with name, email, and password</li>
            <li>System creates new user with default role "customer"</li>
            <li>Verification email is sent to user's email address</li>
            <li>User must verify email before being able to login</li>
          </ol>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Login</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>User submits email and password</li>
            <li>System verifies credentials and email verification status</li>
            <li>If verified, system returns JWT tokens (access and refresh) and user data</li>
            <li>If not verified, system returns error asking to verify email</li>
          </ol>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Token Management</h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Access token is used for API requests (short-lived)</li>
            <li>Refresh token is used to get new access token (long-lived)</li>
            <li>Tokens are stored securely in the client</li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Endpoints" defaultOpen={true}>
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/login/</code> - User login</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/refresh/</code> - Refresh access token</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/verify-email/</code> - Verify email address</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/resend-verification/</code> - Resend verification email</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/password-reset-request/</code> - Request password reset</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/password-reset/</code> - Reset password</li>
            <li><code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /auth/change-password/</code> - Change password</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Security Considerations" defaultOpen={true}>
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>All passwords are hashed using PBKDF2 with SHA256</li>
            <li>JWT tokens are signed using a secure secret key</li>
            <li>Access tokens have a short expiration time</li>
            <li>Refresh tokens are long-lived but can be revoked</li>
            <li>Email verification is required for all new accounts</li>
            <li>Password reset requires email verification</li>
          </ul>
        </div>
      </DocSection>

      <DocsPager />
    </div>
  )
} 