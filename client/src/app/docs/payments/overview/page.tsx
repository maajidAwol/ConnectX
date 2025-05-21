import { DocPageHeader } from "../../components/doc-page-header"
import { DocsPager } from "../../components/pager"
import { DocSection } from "../../components/doc-section"
import { PlatformCode } from "../../components/platform-code"

export default function PaymentsOverviewPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Payments API Overview"
        text="Learn how to integrate and manage payments using the ConnectX Payments API."
      />

      <DocSection title="Introduction" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          The Payments API allows you to process payments for orders using multiple payment methods. Currently, we support:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Chapa Payment Gateway (Online payments)</li>
          <li>Cash on Delivery (COD)</li>
        </ul>
      </DocSection>

      <DocSection title="Payment Flow">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">1. Initialize Payment</h4>
          <p className="text-gray-700">
            Start by initializing a payment for an order. This creates a payment record and returns a checkout URL for online payments.
          </p>

          <h4 className="font-medium text-gray-900">2. Process Payment</h4>
          <p className="text-gray-700">
            For online payments, redirect the customer to the checkout URL. For COD, the payment will be marked as pending.
          </p>

          <h4 className="font-medium text-gray-900">3. Verify Payment</h4>
          <p className="text-gray-700">
            Verify the payment status using the transaction reference. The system also automatically verifies payments through webhooks.
          </p>

          <h4 className="font-medium text-gray-900">4. Confirm Payment</h4>
          <p className="text-gray-700">
            For COD payments, tenant owners can confirm the payment after receiving the cash.
          </p>
        </div>
      </DocSection>

      <DocSection title="Payment Statuses">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Available Statuses</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><code>pending</code> - Payment has been initialized but not yet processed</li>
              <li><code>processing</code> - Payment is being processed</li>
              <li><code>completed</code> - Payment has been successfully completed</li>
              <li><code>failed</code> - Payment has failed</li>
              <li><code>refunded</code> - Payment has been refunded</li>
              <li><code>cancelled</code> - Payment has been cancelled</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Authentication">
        <p className="text-gray-700 mb-4">
          All payment endpoints require authentication using your API key. Include it in the Authorization header:
        </p>
        <PlatformCode
          webCode={`Authorization: Bearer YOUR_API_KEY`}
          mobileCode={`Authorization: Bearer YOUR_API_KEY`}
          title="Authentication Header"
        />
      </DocSection>

      <DocSection title="Rate Limits">
        <p className="text-gray-700 mb-4">
          The Payments API has the following rate limits:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>100 requests per minute for payment initialization</li>
          <li>200 requests per minute for payment verification</li>
          <li>50 requests per minute for payment confirmation</li>
        </ul>
      </DocSection>

      <DocSection title="Error Handling">
        <p className="text-gray-700 mb-4">
          The API uses standard HTTP status codes and returns error messages in the following format:
        </p>
        <PlatformCode
          webCode={`{
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "field": "field_name", // Optional: indicates which field caused the error
    "details": "Additional error details" // Optional
  }
}`}
          mobileCode={`{
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "field": "field_name", // Optional: indicates which field caused the error
    "details": "Additional error details" // Optional
  }
}`}
          title="Error Response Format"
        />
      </DocSection>

      <DocsPager
        next={{
          label: "Chapa Integration",
          href: "/docs/payments/chapa",
        }}
      />
    </div>
  )
} 