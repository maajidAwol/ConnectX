import { DocPageHeader } from "./components/doc-page-header"
import { DocsPager } from "./components/pager"
import { DocSection } from "./components/doc-section"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="ConnectX Documentation"
        text="Welcome to the ConnectX documentation. Learn how to integrate our centralized backend platform into your applications."
      />

      <DocSection title="Overview" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          ConnectX is a powerful, centralized backend platform that provides a comprehensive suite of features for building modern applications:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>RESTful API with comprehensive endpoints</li>
          <li>Real-time updates using WebSocket connections</li>
          <li>Multi-tenant architecture for scalable applications</li>
          <li>Built-in authentication and authorization</li>
          <li>Advanced data management and caching</li>
        </ul>
      </DocSection>

      <DocSection title="Quick Start">
        <p className="text-gray-700 mb-4">
          Get started with ConnectX in minutes. Here's a simple example of how to make your first API request:
        </p>
      </DocSection>

      <DocSection title="Key Features">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Authentication</h3>
            <p className="text-gray-700">
              Secure authentication with API keys, OAuth 2.0, and JWT support.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Data Management</h3>
            <p className="text-gray-700">
              Comprehensive CRUD operations with advanced filtering and pagination.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-700">
              WebSocket support for real-time data synchronization.
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Multi-tenant</h3>
            <p className="text-gray-700">
              Built-in support for multi-tenant applications with data isolation.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Getting Started">
        <ol className="list-decimal ml-6 space-y-4">
          <li>
            <h4 className="font-semibold">Create an Account</h4>
            <p className="text-gray-700">Sign up at connectx.com and create your first project.</p>
          </li>
          <li>
            <h4 className="font-semibold">Get Your API Keys</h4>
            <p className="text-gray-700">Generate API keys from your project dashboard.</p>
          </li>
          <li>
            <h4 className="font-semibold">Install SDK</h4>
          </li>
          <li>
            <h4 className="font-semibold">Make Your First Request</h4>
            <p className="text-gray-700">Start building your application with our comprehensive API.</p>
          </li>
        </ol>
      </DocSection>

      <DocsPager
        next={{
          label: "Authentication",
          href: "/docs/authentication",
        }}
      />
    </div>
  )
}
