import { DocPageHeader } from "../components/doc-page-header"
import { DocsPager } from "../components/pager"
import { DocSection } from "../components/doc-section"
import { PlatformCode } from "../components/platform-code"

export default function ProductApiPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Product API"
        text="Learn how to manage products using the ConnectX Product API."
      />

      <DocSection title="Create Product" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Create a new product in your store:
        </p>
        <PlatformCode
          webCode={`// Web Example
const response = await fetch('https://api.connectx.com/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones',
    price: 149.99,
    category: 'electronics',
    stock_quantity: 100,
    images: ['https://example.com/headphones.jpg'],
    attributes: {
      color: 'black',
      brand: 'AudioPro',
      wireless: true
    }
  })
});

const product = await response.json();`}
          mobileCode={`// Mobile Example (React Native)
const createProduct = async () => {
  try {
    const response = await axios.post(
      'https://api.connectx.com/v1/products',
      {
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones',
        price: 149.99,
        category: 'electronics',
        stock_quantity: 100,
        images: ['https://example.com/headphones.jpg'],
        attributes: {
          color: 'black',
          brand: 'AudioPro',
          wireless: true
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
  }
};`}
          title="Create Product"
        />
      </DocSection>

      <DocSection title="List Products">
        <p className="text-gray-700 mb-4">
          Retrieve a list of products with pagination and filtering:
        </p>
        <PlatformCode
          webCode={`// Web Example
const params = new URLSearchParams({
  page: '1',
  per_page: '20',
  category: 'electronics',
  sort: '-created_at'
});

const response = await fetch(\`https://api.connectx.com/v1/products?\${params}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const { data, meta } = await response.json();`}
          mobileCode={`// Mobile Example (React Native)
const fetchProducts = async (page = 1) => {
  try {
    const response = await axios.get('https://api.connectx.com/v1/products', {
      params: {
        page,
        per_page: 20,
        category: 'electronics',
        sort: '-created_at'
      },
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};`}
          title="List Products"
        />
      </DocSection>

      <DocSection title="Get Product">
        <p className="text-gray-700 mb-4">
          Retrieve a single product by ID:
        </p>
        <PlatformCode
          webCode={`// Web Example
const response = await fetch('https://api.connectx.com/v1/products/PRODUCT_ID', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const product = await response.json();`}
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
    console.error('Error fetching product:', error);
  }
};`}
          title="Get Product"
        />
      </DocSection>

      <DocSection title="Update Product">
        <p className="text-gray-700 mb-4">
          Update an existing product:
        </p>
        <PlatformCode
          webCode={`// Web Example
const response = await fetch('https://api.connectx.com/v1/products/PRODUCT_ID', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    price: 129.99,
    stock_quantity: 150,
    description: 'Updated description'
  })
});

const updatedProduct = await response.json();`}
          mobileCode={`// Mobile Example (React Native)
const updateProduct = async (productId, updates) => {
  try {
    const response = await axios.patch(
      \`https://api.connectx.com/v1/products/\${productId}\`,
      {
        price: 129.99,
        stock_quantity: 150,
        description: 'Updated description'
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
    console.error('Error updating product:', error);
  }
};`}
          title="Update Product"
        />
      </DocSection>

      <DocSection title="Delete Product">
        <p className="text-gray-700 mb-4">
          Delete a product:
        </p>
        <PlatformCode
          webCode={`// Web Example
const response = await fetch('https://api.connectx.com/v1/products/PRODUCT_ID', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

if (response.ok) {
  console.log('Product deleted successfully');
}`}
          mobileCode={`// Mobile Example (React Native)
const deleteProduct = async (productId) => {
  try {
    await axios.delete(
      \`https://api.connectx.com/v1/products/\${productId}\`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};`}
          title="Delete Product"
        />
      </DocSection>

      <DocSection title="Response Format">
        <p className="text-gray-700 mb-4">
          All product endpoints return data in the following format:
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
}`}
          mobileCode={`// Error Response
{
  "error": {
    "code": "validation_error",
    "message": "The product name is required",
    "field": "name"
  }
}`}
          title="Response Format"
        />
      </DocSection>

      <DocsPager
        next={{
          label: "Order API",
          href: "/docs/order-api",
        }}
      />
    </div>
  )
} 