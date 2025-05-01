import { DocPageHeader } from "./components/doc-page-header"
import { DocsPager } from "./components/pager"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Introduction"
        text="Welcome to the ConnectX documentation. ConnectX is a centralized, multi-tenant backend framework for e-commerce that empowers entrepreneurs, startups, and students to build and manage e-commerce platforms with ease."
      />

      <p className="leading-7 text-gray-700">
        This documentation will guide you through the process of integrating ConnectX into your application, from
        authentication to making API requests and handling errors.
      </p>

      {/* Info Callout */}
      <div className="rounded-md bg-blue-50 p-4 my-6 dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400 dark:text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ConnectX is currently in public beta. We're constantly improving our API and documentation based on user
              feedback.
            </p>
          </div>
        </div>
      </div>

      <h2 id="getting-started" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Getting Started
      </h2>
      <p className="leading-7 text-gray-700">
        To get started with ConnectX, you'll need to create an account and obtain your API keys. Once you have your API
        keys, you can start making requests to our API endpoints.
      </p>

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">Installation</h3>
      <p className="leading-7 text-gray-700 mb-4">You can install our official client libraries using npm or yarn:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">npm</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>npm install @connectx/client</code>
        </pre>
      </div>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">yarn</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>yarn add @connectx/client</code>
        </pre>
      </div>

      <h2 id="authentication" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Authentication
      </h2>
      <p className="leading-7 text-gray-700">
        ConnectX uses API keys to authenticate requests. You can view and manage your API keys in the ConnectX
        Dashboard.
      </p>
      <p className="leading-7 text-gray-700 mt-4">
        Authentication to the API is performed via Bearer Auth. Provide your API key as the bearer token value in the
        Authorization header.
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Authorization Header</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </pre>
      </div>

      {/* Warning Callout */}
      <div className="rounded-md bg-yellow-50 p-4 my-6 dark:bg-yellow-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400 dark:text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Your API keys carry many privileges, so be sure to keep them secure! Do not share your API keys in
              publicly accessible areas such as GitHub, client-side code, etc.
            </p>
          </div>
        </div>
      </div>

      <h2 id="making-requests" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Making Requests
      </h2>
      <p className="leading-7 text-gray-700">
        The ConnectX API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded
        request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and
        verbs.
      </p>

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8">Creating a Product</h3>
      <p className="leading-7 text-gray-700 mb-4">Here's an example of how to create a new product using our API:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Request</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`fetch('https://api.connectx.com/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 149.99,
    category: 'electronics',
    stock_quantity: 100
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</code>
        </pre>
      </div>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Response</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`{
  "id": "prod_1234567890",
  "name": "Premium Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 149.99,
  "category": "electronics",
  "stock_quantity": 100,
  "created_at": "2023-04-25T12:34:56Z",
  "updated_at": "2023-04-25T12:34:56Z"
}`}</code>
        </pre>
      </div>

      <h2 id="error-handling" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Error Handling
      </h2>
      <p className="leading-7 text-gray-700">
        ConnectX uses conventional HTTP response codes to indicate the success or failure of an API request. In general,
        codes in the 2xx range indicate success, codes in the 4xx range indicate an error that failed given the
        information provided, and codes in the 5xx range indicate an error with ConnectX's servers.
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Error Response</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`{
  "error": {
    "code": "invalid_request_error",
    "message": "The product name is required",
    "param": "name",
    "type": "validation_error"
  }
}`}</code>
        </pre>
      </div>

      <h2 id="rate-limits" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Rate Limits
      </h2>
      <p className="leading-7 text-gray-700">
        The ConnectX API has rate limits in place to protect our infrastructure and ensure fair usage across all users.
        Rate limits are applied on a per-API key basis.
      </p>
      <p className="leading-7 text-gray-700 mt-4">
        For most API endpoints, the rate limit is 100 requests per minute. If you exceed this limit, you will receive a
        429 Too Many Requests response.
      </p>

      {/* Tip Callout */}
      <div className="rounded-md bg-green-50 p-4 my-6 dark:bg-green-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400 dark:text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-green-700 dark:text-green-400">
              You can monitor your current rate limit usage by checking the X-RateLimit-Remaining header in the API
              response.
            </p>
          </div>
        </div>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">Next Steps</h2>
      <p className="leading-7 text-gray-700">
        Now that you understand the basics of the ConnectX API, you can explore our detailed guides for specific
        features:
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Learn how to manage products and inventory</li>
        <li>Process orders and handle fulfillment</li>
        <li>Integrate payment gateways</li>
        <li>Implement user authentication and authorization</li>
        <li>Set up webhooks for real-time updates</li>
      </ul>

      <DocsPager
        next={{
          label: "Installation",
          href: "/docs/installation",
        }}
      />
    </div>
  )
}
