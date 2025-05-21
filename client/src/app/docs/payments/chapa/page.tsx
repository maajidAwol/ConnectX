import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function ChapaIntegrationPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Chapa Payment Integration"
        text="Learn how to integrate Chapa payment gateway into your application."
      />

      <DocSection title="Overview" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          Chapa is a payment gateway that allows you to accept payments from various payment methods including credit cards, mobile money, and bank transfers. The integration process involves three main steps:
        </p>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Initialize the payment</li>
          <li>Redirect the customer to the checkout page</li>
          <li>Verify the payment status</li>
        </ol>
      </DocSection>

      <DocSection title="Initialize Payment">
        <p className="text-gray-700 mb-4">
          To start a payment, send a POST request to initialize the payment:
        </p>
        <PlatformCode
          webCode={`POST /api/payments/initialize_chapa_payment/

{
  "order_id": "order_uuid",
  "phone_number": "+251912345678", // Optional
  "return_url": "https://your-domain.com/payment-complete" // Optional
}`}
          mobileCode={`POST /api/payments/initialize_chapa_payment/

{
  "order_id": "order_uuid",
  "phone_number": "+251912345678", // Optional
  "return_url": "https://your-domain.com/payment-complete" // Optional
}`}
          title="Initialize Payment Request"
        />

        <p className="text-gray-700 mt-4 mb-4">
          The response will include a checkout URL:
        </p>
        <PlatformCode
          webCode={`{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "payment_id": "payment_uuid",
    "checkout_url": "https://checkout.chapa.co/...",
    "tx_ref": "TX-1234567890ABCDEF"
  }
}`}
          mobileCode={`{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "payment_id": "payment_uuid",
    "checkout_url": "https://checkout.chapa.co/...",
    "tx_ref": "TX-1234567890ABCDEF"
  }
}`}
          title="Initialize Payment Response"
        />
      </DocSection>

      <DocSection title="Redirect to Checkout">
        <p className="text-gray-700 mb-4">
          After receiving the checkout URL, redirect your customer to complete the payment:
        </p>
        <PlatformCode
          webCode={`// Web Example
const handlePayment = async () => {
  const response = await fetch('/api/payments/initialize_chapa_payment/', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      order_id: 'order_uuid'
    })
  });

  const data = await response.json();
  if (data.status === 'success') {
    window.location.href = data.data.checkout_url;
  }
};`}
          mobileCode={`// Mobile Example (React Native)
const handlePayment = async () => {
  try {
    const response = await axios.post(
      '/api/payments/initialize_chapa_payment/',
      {
        order_id: 'order_uuid'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'success') {
      Linking.openURL(response.data.data.checkout_url);
    }
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};`}
          title="Redirect to Checkout"
        />
      </DocSection>

      <DocSection title="Verify Payment">
        <p className="text-gray-700 mb-4">
          After the customer completes the payment, verify the payment status using the transaction reference:
        </p>
        <PlatformCode
          webCode={`POST /api/payments/verify_chapa_payment/

{
  "tx_ref": "TX-1234567890ABCDEF"
}`}
          mobileCode={`POST /api/payments/verify_chapa_payment/

{
  "tx_ref": "TX-1234567890ABCDEF"
}`}
          title="Verify Payment Request"
        />

        <p className="text-gray-700 mt-4 mb-4">
          The verification response:
        </p>
        <PlatformCode
          webCode={`{
  "status": "success",
  "message": "Payment verified successfully",
  "payment": {
    "id": "payment_uuid",
    "order": "order_uuid",
    "order_number": "ORD-20240320-0001",
    "amount": "1000.00",
    "payment_method": "chapa",
    "status": "completed",
    "transaction_id": "TX-1234567890ABCDEF",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T10:00:00Z"
  }
}`}
          mobileCode={`{
  "status": "success",
  "message": "Payment verified successfully",
  "payment": {
    "id": "payment_uuid",
    "order": "order_uuid",
    "order_number": "ORD-20240320-0001",
    "amount": "1000.00",
    "payment_method": "chapa",
    "status": "completed",
    "transaction_id": "TX-1234567890ABCDEF",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-20T10:00:00Z"
  }
}`}
          title="Verify Payment Response"
        />
      </DocSection>

      <DocSection title="Webhook Integration">
        <p className="text-gray-700 mb-4">
          Chapa will send payment status updates to your webhook endpoint. Configure your webhook URL in the Chapa dashboard:
        </p>
        <PlatformCode
          webCode={`POST /api/payments/chapa-webhook/

{
  "tx_ref": "TX-1234567890ABCDEF",
  "status": "success",
  "transaction_id": "chapa_transaction_id"
}`}
          mobileCode={`POST /api/payments/chapa-webhook/

{
  "tx_ref": "TX-1234567890ABCDEF",
  "status": "success",
  "transaction_id": "chapa_transaction_id"
}`}
          title="Webhook Payload"
        />
      </DocSection>

      <DocSection title="Error Handling">
        <p className="text-gray-700 mb-4">
          Common error responses:
        </p>
        <PlatformCode
          webCode={`// Missing order_id
{
  "error": "order_id is required"
}

// Invalid order
{
  "error": "Order not found"
}

// Payment initialization failed
{
  "error": "Payment initialization failed: [error details]"
}

// Verification failed
{
  "error": "Payment verification failed: [error details]"
}`}
          mobileCode={`// Missing order_id
{
  "error": "order_id is required"
}

// Invalid order
{
  "error": "Order not found"
}

// Payment initialization failed
{
  "error": "Payment initialization failed: [error details]"
}

// Verification failed
{
  "error": "Payment verification failed: [error details]"
}`}
          title="Error Responses"
        />
      </DocSection>

      <DocSection title="Testing">
        <p className="text-gray-700 mb-4">
          Chapa provides test credentials for development. Use these test card numbers:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Test Card Number: 4242 4242 4242 4242</li>
          <li>Expiry Date: Any future date</li>
          <li>CVV: Any 3 digits</li>
          <li>OTP: 123456</li>
        </ul>
      </DocSection>

      <DocsPager
        prev={{
          label: "Payments Overview",
          href: "/docs/payments/overview",
        }}
      />
    </div>
  )
} 