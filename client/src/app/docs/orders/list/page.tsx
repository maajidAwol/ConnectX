import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function ListOrdersPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="List Orders"
        text="Learn how to retrieve a list of orders using the ConnectX Order API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Retrieve a list of orders by sending a GET request to:
        </p>
        <PlatformCode
          webCode={`GET /orders`}
          mobileCode={`GET /orders`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Query Parameters">
        <p className="text-gray-700 mb-4">
          You can filter and paginate the results using the following query parameters:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">page</h4>
            <p className="text-sm text-gray-600">Page number (default: 1)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">per_page</h4>
            <p className="text-sm text-gray-600">Number of items per page (default: 20, max: 100)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">status</h4>
            <p className="text-sm text-gray-600">Filter by order status (pending, processing, shipped, delivered, cancelled, refunded)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">created_after</h4>
            <p className="text-sm text-gray-600">Filter orders created after this date (ISO 8601 format)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">created_before</h4>
            <p className="text-sm text-gray-600">Filter orders created before this date (ISO 8601 format)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">sort</h4>
            <p className="text-sm text-gray-600">Sort field (created_at, updated_at, total)</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">order</h4>
            <p className="text-sm text-gray-600">Sort order (asc, desc)</p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to list orders using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const listOrders = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(\`https://api.connectx.com/v1/orders?\${queryString}\`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to list orders');
  }

  return response.json();
};

// Example usage:
const orders = await listOrders({
  page: 1,
  per_page: 20,
  status: 'pending',
  created_after: '2024-03-01T00:00:00Z',
  sort: 'created_at',
  order: 'desc'
});`}
          mobileCode={`// Mobile Example (React Native)
const listOrders = async (params = {}) => {
  try {
    const response = await axios.get(
      'https://api.connectx.com/v1/orders',
      {
        params,
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing orders:', error);
    throw error;
  }
};

// Example usage:
const orders = await listOrders({
  page: 1,
  per_page: 20,
  status: 'pending',
  created_after: '2024-03-01T00:00:00Z',
  sort: 'created_at',
  order: 'desc'
});`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return a paginated list of orders:
        </p>
        <PlatformCode
          webCode={`{
  "data": [
    {
      "id": "order_123",
      "customer": {
        "id": "cust_123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "items": [
        {
          "product_id": "prod_123",
          "name": "Premium Headphones",
          "quantity": 1,
          "price": 149.99,
          "total": 149.99
        }
      ],
      "shipping_address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "US"
      },
      "payment_method": "credit_card",
      "status": "pending",
      "total": 149.99,
      "currency": "USD",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid query parameters",
    "field": "created_after",
    "details": "Date must be in ISO 8601 format"
  }
}`}
          title="Response"
        />
      </DocSection>

      <DocSection title="Error Codes">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">400 Bad Request</h4>
            <p className="text-sm text-gray-600">Invalid query parameters</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
            <p className="text-sm text-gray-600">Invalid or missing API key</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
            <p className="text-sm text-gray-600">Insufficient permissions to list orders</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">429 Too Many Requests</h4>
            <p className="text-sm text-gray-600">Rate limit exceeded</p>
          </div>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "Get Order",
          href: "/docs/order-api/retrieve",
        }}
      />
    </div>
  )
} 