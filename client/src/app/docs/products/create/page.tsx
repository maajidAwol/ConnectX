import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function CreateProductPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Create Product"
        text="Learn how to create new products using the ConnectX Product API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Create a new product by sending a POST request to:
        </p>
        <PlatformCode
          webCode={`POST /products`}
          mobileCode={`POST /products`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Request Body">
        <p className="text-gray-700 mb-4">
          The request body should be a JSON object with the following structure:
        </p>
        <PlatformCode
          webCode={`{
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
  }
}`}
          mobileCode={`{
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
  }
}`}
          title="Request Body"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to create a product using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const createProduct = async () => {
  const response = await fetch('https://api.connectx.com/v1/products', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 149.99,
      category: 'electronics',
      stock_quantity: 100,
      images: [
        'https://example.com/headphones-1.jpg',
        'https://example.com/headphones-2.jpg'
      ],
      attributes: {
        color: 'black',
        brand: 'AudioPro',
        wireless: true,
        battery_life: '20 hours',
        noise_cancellation: true
      },
      sku: 'AUDIO-PRO-100',
      weight: 0.5,
      dimensions: {
        length: 20,
        width: 15,
        height: 10,
        unit: 'cm'
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const createProduct = async () => {
  try {
    const response = await axios.post(
      'https://api.connectx.com/v1/products',
      {
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 149.99,
        category: 'electronics',
        stock_quantity: 100,
        images: [
          'https://example.com/headphones-1.jpg',
          'https://example.com/headphones-2.jpg'
        ],
        attributes: {
          color: 'black',
          brand: 'AudioPro',
          wireless: true,
          battery_life: '20 hours',
          noise_cancellation: true
        },
        sku: 'AUDIO-PRO-100',
        weight: 0.5,
        dimensions: {
          length: 20,
          width: 15,
          height: 10,
          unit: 'cm'
        }
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
    console.error('Error creating product:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return the created product:
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
            <p className="text-sm text-gray-600">Invalid request data or missing required fields</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
            <p className="text-sm text-gray-600">Invalid or missing API key</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
            <p className="text-sm text-gray-600">Insufficient permissions to create products</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">429 Too Many Requests</h4>
            <p className="text-sm text-gray-600">Rate limit exceeded</p>
          </div>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "List Products",
          href: "/docs/products/list",
        }}
      />
    </div>
  )
} 