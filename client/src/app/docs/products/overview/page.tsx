import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function ProductOverviewPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Product API Overview"
        text="Learn how to manage your products using the ConnectX Product API."
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          The Product API allows you to manage your product catalog programmatically. You can create, retrieve, update, and delete products, as well as manage their inventory and attributes.
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
            <h4 className="font-medium text-gray-900 mb-2">Create Product</h4>
            <p className="text-gray-700 mb-2">POST /products</p>
            <p className="text-sm text-gray-600">Create a new product in your catalog</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">List Products</h4>
            <p className="text-gray-700 mb-2">GET /products</p>
            <p className="text-sm text-gray-600">Retrieve a paginated list of products with filtering options</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Get Product</h4>
            <p className="text-gray-700 mb-2">GET /products/{'{product_id}'}</p>
            <p className="text-sm text-gray-600">Retrieve a specific product by ID</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Update Product</h4>
            <p className="text-gray-700 mb-2">PATCH /products/{'{product_id}'}</p>
            <p className="text-sm text-gray-600">Update an existing product's details</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Delete Product</h4>
            <p className="text-gray-700 mb-2">DELETE /products/{'{product_id}'}</p>
            <p className="text-sm text-gray-600">Remove a product from your catalog</p>
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
    "id": "prod_123",
    "name": "Premium Headphones",
    "description": "High-quality wireless headphones",
    "price": 149.99,
    "category": "electronics",
    "stock_quantity": 100,
    "images": ["https://example.com/headphones.jpg"],
    "attributes": {
      "color": "black",
      "brand": "AudioPro",
      "wireless": true
    },
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
    "id": "prod_123",
    "name": "Premium Headphones",
    "description": "High-quality wireless headphones",
    "price": 149.99,
    "category": "electronics",
    "stock_quantity": 100,
    "images": ["https://example.com/headphones.jpg"],
    "attributes": {
      "color": "black",
      "brand": "AudioPro",
      "wireless": true
    },
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
          The Product API has the following rate limits:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>100 requests per minute for standard plans</li>
          <li>1000 requests per minute for enterprise plans</li>
          <li>Rate limit headers are included in all responses</li>
        </ul>
      </DocSection>

      <DocsPager
        next={{
          label: "Create Product",
          href: "/docs/products/create",
        }}
      />
    </div>
  )
} 