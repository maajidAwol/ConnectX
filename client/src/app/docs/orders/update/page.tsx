import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function UpdateOrderPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Update Order"
        text="Learn how to update order details using the ConnectX Order API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Update an order by sending a PATCH request to:
        </p>
        <PlatformCode
          webCode={`PATCH /orders/{order_id}`}
          mobileCode={`PATCH /orders/{order_id}`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Request Body">
        <p className="text-gray-700 mb-4">
          The request body should be a JSON object containing only the fields you want to update:
        </p>
        <PlatformCode
          webCode={`{
  "status": "processing",
  "shipping_address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "notes": "Updated delivery instructions"
}`}
          mobileCode={`{
  "status": "processing",
  "shipping_address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "notes": "Updated delivery instructions"
}`}
          title="Request Body"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to update an order using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const updateOrder = async (orderId, updates) => {
  const response = await fetch(\`https://api.connectx.com/v1/orders/\${orderId}\`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update order');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const updateOrder = async (orderId, updates) => {
  try {
    const response = await axios.patch(
      \`https://api.connectx.com/v1/orders/\${orderId}\`,
      updates,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the updated order:
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
      "street": "456 New St",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90001",
      "country": "US"
    },
    "payment_method": "credit_card",
    "status": "processing",
    "total": 149.99,
    "currency": "USD",
    "notes": "Updated delivery instructions",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T11:00:00Z"
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request data",
    "field": "status",
    "details": "Cannot change status from 'delivered' to 'processing'"
  }
}`}
          title="Response"
        />
      </DocSection>

      <DocSection title="Error Codes">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">400 Bad Request</h4>
            <p className="text-sm text-gray-600">Invalid request data or validation error</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
            <p className="text-sm text-gray-600">Invalid or missing API key</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
            <p className="text-sm text-gray-600">Insufficient permissions to update the order</p>
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

      <DocSection title="Important Notes">
        <div className="space-y-4">
          <p className="text-gray-700">
            • Order status can only be updated in the correct sequence (pending → processing → shipped → delivered).
          </p>
          <p className="text-gray-700">
            • Once an order is marked as delivered, it cannot be updated to a previous status.
          </p>
          <p className="text-gray-700">
            • Cancelled or refunded orders cannot be reactivated.
          </p>
          <p className="text-gray-700">
            • Some fields (like payment_method and currency) cannot be updated after order creation.
          </p>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "Payment Integration",
          href: "/docs/payment-integration",
        }}
      />
    </div>
  )
} 