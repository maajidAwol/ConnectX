import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function DeleteProductPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Delete Product"
        text="Learn how to delete products using the ConnectX Product API."
      />

      <DocSection title="Endpoint" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Delete a product by sending a DELETE request to:
        </p>
        <PlatformCode
          webCode={`DELETE /products/{product_id}`}
          mobileCode={`DELETE /products/{product_id}`}
          title="Endpoint"
        />
      </DocSection>

      <DocSection title="Code Examples">
        <p className="text-gray-700 mb-4">
          Here's how to delete a product using different platforms:
        </p>
        <PlatformCode
          webCode={`// Web Example
const deleteProduct = async (productId) => {
  const response = await fetch(\`https://api.connectx.com/v1/products/\${productId}\`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return response.json();
};`}
          mobileCode={`// Mobile Example (React Native)
const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      \`https://api.connectx.com/v1/products/\${productId}\`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};`}
          title="Code Examples"
        />
      </DocSection>

      <DocSection title="Response">
        <p className="text-gray-700 mb-4">
          A successful response will return a confirmation message:
        </p>
        <PlatformCode
          webCode={`{
  "data": {
    "id": "prod_123",
    "deleted": true,
    "message": "Product successfully deleted"
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
            <p className="text-sm text-gray-600">Insufficient permissions to delete the product</p>
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

      <DocSection title="Important Notes">
        <div className="space-y-4">
          <p className="text-gray-700">
            • Deleting a product is permanent and cannot be undone.
          </p>
          <p className="text-gray-700">
            • If the product is associated with any orders, you may need to handle those orders first.
          </p>
          <p className="text-gray-700">
            • Consider archiving products instead of deleting them if you need to maintain historical data.
          </p>
        </div>
      </DocSection>

      <DocsPager
        next={{
          label: "Order API Overview",
          href: "/docs/order-api/overview",
        }}
      />
    </div>
  )
} 