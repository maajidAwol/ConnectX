import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { CodeBlock } from "../../components/code-block"

export default function AuthOverviewPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Authentication Overview"
        text="Learn about the different authentication methods available in ConnectX."
      />

      <DocSection title="Authentication Methods" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          ConnectX supports multiple authentication methods to secure your API requests:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>API Keys - For server-to-server communication</li>
          <li>OAuth 2.0 - For user authentication and authorization</li>
          <li>JWT Tokens - For stateless authentication</li>
        </ul>
      </DocSection>

      <DocSection title="API Key Authentication">
        <p className="text-gray-700 mb-4">
          API keys are the simplest way to authenticate your requests. Include your API key in the Authorization header:
        </p>
        <CodeBlock
          code={`Authorization: Bearer YOUR_API_KEY`}
          title="Authorization Header"
        />
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            Keep your API keys secure and never expose them in client-side code or public repositories.
          </p>
        </div>
      </DocSection>

      <DocSection title="OAuth 2.0 Authentication">
        <p className="text-gray-700 mb-4">
          OAuth 2.0 is used for user authentication and provides more granular control over access:
        </p>
        <CodeBlock
          code={`// OAuth 2.0 Authorization Code Flow
const response = await fetch('https://api.connectx.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: 'AUTHORIZATION_CODE',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    redirect_uri: 'YOUR_REDIRECT_URI'
  })
});`}
          title="OAuth Token Request"
        />
      </DocSection>

      <DocSection title="JWT Authentication">
        <p className="text-gray-700 mb-4">
          JWT tokens provide stateless authentication and are useful for microservices:
        </p>
        <CodeBlock
          code={`// JWT Token Structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "iat": 1516239022,
    "exp": 1516242622
  },
  "signature": "..." // HMACSHA256 signature
}`}
          title="JWT Structure"
        />
      </DocSection>

      <DocSection title="Best Practices">
        <ul className="list-disc ml-6 space-y-2">
          <li>Always use HTTPS for all API requests</li>
          <li>Rotate API keys regularly</li>
          <li>Use the minimum required permissions</li>
          <li>Implement proper error handling</li>
          <li>Monitor authentication attempts</li>
        </ul>
      </DocSection>

      <DocsPager
        next={{
          label: "API Keys",
          href: "/docs/authentication/api-keys",
        }}
      />
    </div>
  )
} 