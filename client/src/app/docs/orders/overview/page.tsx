import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function OrderOverviewPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Order API Overview"
        text="Learn how to manage orders using the ConnectX Order API."
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          The Order API allows you to manage customer orders programmatically. You can create, retrieve, update, and track orders, as well as manage their status and fulfillment.
        </p>
        <p className="text-gray-700 mb-4">
          All endpoints require authentication using your API key. Make sure to include it in the Authorization header of your requests.
        </p>
      </DocSection>

      <DocSection title="Base URL">
        <p className="text-gray-700 mb-4">
          All API endpoints are relative to the base URL:
        </p>
        <PlatformCode
          webCode={`https://api.connectx.com/v1`}
          mobileCode={`https://api.connectx.com/v1`}
          title="Base URL"
        />
      </DocSection>

      <DocSection title="Authentication">
        <p className="text-gray-700 mb-4">
          Include your API key in the Authorization header:
        </p>
        <PlatformCode
          webCode={`Authorization: Bearer YOUR_API_KEY`}
          mobileCode={`Authorization: Bearer YOUR_API_KEY`}
          title="Authentication Header"
        />
      </DocSection>

      <DocSection title="Available Endpoints">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Create Order</h4>
            <p className="text-gray-700 mb-2">POST /orders</p>
            <p className="text-sm text-gray-600">Create a new order with customer and product details</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">List Orders</h4>
            <p className="text-gray-700 mb-2">GET /orders</p>
            <p className="text-sm text-gray-600">Retrieve a paginated list of orders with filtering options</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Get Order</h4>
            <p className="text-gray-700 mb-2">GET /orders/{'{order_id}'}</p>
            <p className="text-sm text-gray-600">Retrieve a specific order by ID</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Update Order</h4>
            <p className="text-gray-700 mb-2">PATCH /orders/{'{order_id}'}</p>
            <p className="text-sm text-gray-600">Update an existing order's details or status</p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Order Status Flow">
        <p className="text-gray-700 mb-4">
          Orders progress through the following statuses:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">pending</h4>
            <p className="text-sm text-gray-600">Order has been created but payment is pending</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">processing</h4>
            <p className="text-sm text-gray-600">Payment received, order is being prepared</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">shipped</h4>
            <p className="text-sm text-gray-600">Order has been shipped to the customer</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">delivered</h4>
            <p className="text-sm text-gray-600">Order has been delivered to the customer</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">cancelled</h4>
            <p className="text-sm text-gray-600">Order has been cancelled</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">refunded</h4>
            <p className="text-sm text-gray-600">Order has been refunded</p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Response Format">
        <p className="text-gray-700 mb-4">
          All endpoints return JSON responses in the following format:
        </p>
        <PlatformCode
          webCode={`// Success Response
{
  "data": {
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
}

// List Response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}

// Error Response
{
  "error": {
    "code": "error_code",
    "message": "Error description",
    "field": "field_name" // Optional
  }
}`}
          mobileCode={`// Success Response
{
  "data": {
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
}

// List Response
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "total_pages": 5
  }
}

// Error Response
{
  "error": {
    "code": "error_code",
    "message": "Error description",
    "field": "field_name" // Optional
  }
}`}
          title="Response Format"
        />
      </DocSection>

      <DocSection title="Rate Limits">
        <p className="text-gray-700 mb-4">
          The Order API has the following rate limits:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>100 requests per minute for standard plans</li>
          <li>1000 requests per minute for enterprise plans</li>
          <li>Rate limit headers are included in all responses</li>
        </ul>
      </DocSection>

      <DocsPager
        next={{
          label: "Create Order",
          href: "/docs/order-api/create",
        }}
      />
    </div>
  )
} 