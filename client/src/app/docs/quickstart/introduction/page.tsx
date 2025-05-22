'use client';

import { DocPageHeader } from "../../components/doc-page-header";
import { DocsPager } from "../../components/pager";
import { DocSection } from "../../components/doc-section";

export default function IntroductionPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Introduction to ConnectX"
        text="Learn about ConnectX and its key features"
      />

      <DocSection title="What is ConnectX?" defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            ConnectX is a comprehensive e-commerce platform that provides a complete solution for online businesses. It offers both web and mobile applications, allowing businesses to manage their operations and customers to shop seamlessly across different platforms.
          </p>
        </div>
      </DocSection>

      <DocSection title="Key Features" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Multi-tenant Architecture</h3>
          <p className="text-gray-700 dark:text-gray-300">
            ConnectX supports multiple businesses (tenants) on a single platform, each with their own:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Product catalog</li>
            <li>Order management</li>
            <li>Customer base</li>
            <li>Analytics and reporting</li>
          </ul>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">User Management</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Comprehensive user management system with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Role-based access control</li>
            <li>Email verification</li>
            <li>Password management</li>
            <li>Profile customization</li>
          </ul>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Product Management</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Advanced product management features:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Category organization</li>
            <li>Inventory tracking</li>
            <li>Price management</li>
            <li>Product reviews and ratings</li>
          </ul>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Order Processing</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Complete order management system:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Order tracking</li>
            <li>Shipping management</li>
            <li>Payment processing</li>
            <li>Order history</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Platform Support" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Web Application</h3>
          <p className="text-gray-700 dark:text-gray-300">
            The web application is built using:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Next.js for the frontend</li>
            <li>React for UI components</li>
            <li>Tailwind CSS for styling</li>
            <li>TypeScript for type safety</li>
          </ul>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Mobile Application</h3>
          <p className="text-gray-700 dark:text-gray-300">
            The mobile application is built using:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Flutter for cross-platform development</li>
            <li>Dart programming language</li>
            <li>Material Design and Cupertino widgets</li>
            <li>Native platform integration</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Getting Started" defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            To get started with ConnectX, follow these steps:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Review the prerequisites for your chosen platform (web or mobile)</li>
            <li>Follow the installation guide to set up your development environment</li>
            <li>Configure your environment variables</li>
            <li>Start the development server</li>
            <li>Begin exploring the features and APIs</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            For detailed instructions, proceed to the <a href="/docs/quickstart/installation" className="text-blue-600 dark:text-blue-400 hover:underline">Installation Guide</a>.
          </p>
        </div>
      </DocSection>

      <DocsPager />
    </div>
  );
} 