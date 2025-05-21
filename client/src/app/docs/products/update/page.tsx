import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function UpdateProductPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Update Product"
        text="Learn how to update product details using the ConnectX Product API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Update a product by sending a PATCH request to:
        </p>
        <PlatformCode
          webCode={`PATCH /products/{product_id}`}
          mobileCode={`PATCH /products/{product_id}`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Request Body">
        <p className="text-gray-700 mb-4">
          The request body should be a JSON object containing only the fields you want to update:
        </p>
        <PlatformCode
          webCode={`{
  "name": "Updated Headphones",
  "price": 129.99,
  "stock_quantity": 150,
  "attributes": {
    "color": "silver",
    "battery_life": "25 hours"
  }
}`}
          mobileCode={`{
  "name": "Updated Headphones",
  "price": 129.99,
  "stock_quantity": 150,
  "attributes": {
    "color": "silver",
    "battery_life": "25 hours"
  }
}`}
          title="Request Body"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to update a product using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const updateProduct = async (productId, updates) => {
  const response = await fetch(\`https://api.connectx.com/v1/products/\${productId}\`, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const updateProduct = async (productId, updates) => {
  try {
    const response = await axios.patch(
      \`https://api.connectx.com/v1/products/\${productId}\`,
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
    console.error('Error updating product:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the updated product:
        </p>
        <PlatformCode
          webCode={`{
  "data": {
    "id": "prod_123",
    "name": "Updated Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 129.99,
    "category": "electronics",
    "stock_quantity": 150,
    "images": [
      "https://example.com/headphones-1.jpg",
      "https://example.com/headphones-2.jpg"
    ],
    "attributes": {
      "color": "silver",
      "brand": "AudioPro",
      "wireless": true,
      "battery_life": "25 hours",
      "noise_cancellation": true
    },
    "sku": "AUDIO-PRO-100",
    "weight": 0.5,
    "dimensions": {
      "length": 20,
      "width": 15,
      "height": 10,
      "unit": "cm"
    },
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T11:00:00Z"
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "validation_error",
    "message": "Invalid request data",
    "field": "price",
    "details": "Price must be greater than 0"
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
            <p className="text-sm text-gray-600">Insufficient permissions to update the product</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">404 Not Found</h4>
            <p className="text-sm text-gray-600">Product not found</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">429 Too Many Requests</h4>
            <p className="text-sm text-gray-600">Rate limit exceeded</p>
          </div>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "Delete Product",
          href: "/docs/products/delete",
        }}
      />
    </div>
  )
} 