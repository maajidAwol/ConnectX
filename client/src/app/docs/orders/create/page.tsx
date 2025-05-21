import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function CreateOrderPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Create Order"
        text="Learn how to create new orders using the ConnectX Order API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Create a new order by sending a POST request to:
        </p>
        <PlatformCode
          webCode={`POST /orders`}
          mobileCode={`POST /orders`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Request Body">
        <p className="text-gray-700 mb-4">
          The request body should be a JSON object with the following structure:
        </p>
        <PlatformCode
          webCode={`{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 1
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
  "currency": "USD",
  "notes": "Please deliver in the evening",
  "selling_tenant_id": "tenant_123" // Optional: Specify a different selling tenant
}`}
          mobileCode={`{
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 1
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
  "currency": "USD",
  "notes": "Please deliver in the evening",
  "selling_tenant_id": "tenant_123" // Optional: Specify a different selling tenant
}`}
          title="Request Body"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to create an order using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const createOrder = async () => {
  const response = await fetch('https://api.connectx.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        {
          product_id: 'prod_123',
          quantity: 1
        }
      ],
      shipping_address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US'
      },
      payment_method: 'credit_card',
      currency: 'USD',
      notes: 'Please deliver in the evening'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const createOrder = async () => {
  try {
    const response = await axios.post(
      'https://api.connectx.com/v1/orders',
      {
        items: [
          {
            product_id: 'prod_123',
            quantity: 1
          }
        ],
        shipping_address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US'
        },
        payment_method: 'credit_card',
        currency: 'USD',
        notes: 'Please deliver in the evening'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the created order:
        </p>
        <PlatformCode
          webCode={`{
  "data": {
    "id": "order_123",
    "order_number": "ORD-20240320-0001",
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
    "notes": "Please deliver in the evening",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T10:00:00Z"
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request data",
    "field": "items",
    "details": "Product with ID prod_123 is out of stock"
  }
}`}
          title="Response"
        />
      </DocSection>

      <DocSection title="Error Codes">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">400 Bad Request</h4>
            <p className="text-sm text-gray-600">Invalid request data or missing required fields</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
            <p className="text-sm text-gray-600">Invalid or missing API key</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
            <p className="text-sm text-gray-600">Insufficient permissions to create orders</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">429 Too Many Requests</h4>
            <p className="text-sm text-gray-600">Rate limit exceeded</p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Important Notes">
        <div className="space-y-4">
          <p className="text-gray-700">
            • The order number is automatically generated in the format: ORD-YYYYMMDD-XXXX
          </p>
          <p className="text-gray-700">
            • The customer information is automatically set from the authenticated user
          </p>
          <p className="text-gray-700">
            • If selling_tenant_id is not provided, the order will be created under the authenticated user's tenant
          </p>
          <p className="text-gray-700">
            • The order status will be set to 'pending' by default
          </p>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "List Orders",
          href: "/docs/order-api/list",
        }}
      />
    </div>
  )
} 