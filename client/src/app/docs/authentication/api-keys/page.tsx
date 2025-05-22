import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { CodeBlock } from "../../components/code-block"

export default function ApiKeysPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="API Keys"
        text="Learn how to create, manage, and use API keys in ConnectX."
      />

      <DocSection title="Creating API Keys" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          To create a new API key, follow these steps:
        </p>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Log in to your ConnectX Dashboard</li>
          <li>Navigate to Settings → API Keys</li>
          <li>Click "Create New API Key"</li>
          <li>Enter a name and description for your key</li>
          <li>Select the required permissions</li>
          <li>Click "Generate Key"</li>
        </ol>
        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            Make sure to copy your API key immediately after creation. For security reasons, you won't be able to see it again.
          </p>
        </div>
      </DocSection>

      <DocSection title="Using API Keys">
        <p className="text-gray-700 mb-4">
          Include your API key in the Authorization header of your requests:
        </p>
        <CodeBlock
          code={`// Example request with API key
const response = await fetch('https://api.connectx.com/v1/products', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`}
          title="API Request Example"
        />
      </DocSection>

      <DocSection title="API Key Permissions">
        <p className="text-gray-700 mb-4">
          API keys can have different permission levels:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Read</h4>
            <p className="text-sm text-gray-600">
              Allows reading data from your ConnectX account. Safe for client-side applications.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Write</h4>
            <p className="text-sm text-gray-600">
              Allows creating and updating data. Use with caution and only in secure environments.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Admin</h4>
            <p className="text-sm text-gray-600">
              Full access to all operations. Should only be used in secure server environments.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Custom</h4>
            <p className="text-sm text-gray-600">
              Granular permissions for specific operations. Ideal for third-party integrations.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Managing API Keys">
        <p className="text-gray-700 mb-4">
          You can manage your API keys through the ConnectX Dashboard or API:
        </p>
        <CodeBlock
          code={`// List all API keys
const response = await fetch('https://api.connectx.com/v1/api-keys', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

// Delete an API key
const response = await fetch('https://api.connectx.com/v1/api-keys/KEY_ID', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});`}
          title="API Key Management"
        />
      </DocSection>

      <DocSection title="Security Best Practices">
        <ul className="list-disc ml-6 space-y-2">
          <li>Never share your API keys or commit them to version control</li>
          <li>Use environment variables to store API keys</li>
          <li>Rotate API keys regularly (recommended every 90 days)</li>
          <li>Use the minimum required permissions for each key</li>
          <li>Monitor API key usage for suspicious activity</li>
          <li>Implement IP restrictions for sensitive operations</li>
        </ul>
      </DocSection>

      <DocsPager
        next={{
          label: "OAuth",
          href: "/docs/authentication/oauth",
        }}
      />
    </div>
  )
} 