import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function RetrieveOrderPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Retrieve Order"
        text="Learn how to retrieve order details using the ConnectX Order API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Retrieve an order by sending a GET request to:
        </p>
        <PlatformCode
          webCode={`GET /orders/{order_id}`}
          mobileCode={`GET /orders/{order_id}`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to retrieve an order using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const getOrder = async (orderId) => {
  const response = await fetch(\`https://api.connectx.com/v1/orders/\${orderId}\`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve order');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const getOrder = async (orderId) => {
  try {
    const response = await axios.get(
      \`https://api.connectx.com/v1/orders/\${orderId}\`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error retrieving order:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the order details:
        </p>
        <PlatformCode
          webCode={`{
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
    "notes": "Please deliver in the evening",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T10:00:00Z"
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "not_found",
    "message": "Order not found",
    "details": "No order exists with the specified ID"
  }
}`}
          title="Response"
        />
      </DocSection>

      <DocSection title="Error Codes">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
            <p className="text-sm text-gray-600">Invalid or missing API key</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
            <p className="text-sm text-gray-600">Insufficient permissions to view the order</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">404 Not Found</h4>
            <p className="text-sm text-gray-600">Order not found</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">429 Too Many Requests</h4>
            <p className="text-sm text-gray-600">Rate limit exceeded</p>
          </div>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "Update Order",
          href: "/docs/order-api/update",
        }}
      />
    </div>
  )
} 