import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function RetrieveProductPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Retrieve Product"
        text="Learn how to retrieve product details using the ConnectX Product API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Retrieve a product by sending a GET request to:
        </p>
        <PlatformCode
          webCode={`GET /products/{product_id}`}
          mobileCode={`GET /products/{product_id}`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to retrieve a product using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const getProduct = async (productId) => {
  const response = await fetch(\`https://api.connectx.com/v1/products/\${productId}\`, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve product');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const getProduct = async (productId) => {
  try {
    const response = await axios.get(
      \`https://api.connectx.com/v1/products/\${productId}\`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error retrieving product:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the product details:
        </p>
        <PlatformCode
          webCode={`{
  "data": {
    "id": "prod_123",
    "name": "Premium Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 149.99,
    "category": "electronics",
    "stock_quantity": 100,
    "images": [
      "https://example.com/headphones-1.jpg",
      "https://example.com/headphones-2.jpg"
    ],
    "attributes": {
      "color": "black",
      "brand": "AudioPro",
      "wireless": true,
      "battery_life": "20 hours",
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
    "updated_at": "2024-03-20T10:00:00Z"
  }
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "not_found",
    "message": "Product not found",
    "details": "No product exists with the specified ID"
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
            <p className="text-sm text-gray-600">Insufficient permissions to view the product</p>
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
          label: "Update Product",
          href: "/docs/products/update",
        }}
      />
    </div>
  )
} 