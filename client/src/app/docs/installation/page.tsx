import { DocPageHeader } from "../components/doc-page-header"
import { DocsPager } from "../components/pager"

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader heading="Installation" text="How to install and set up ConnectX in your project." />

      <p className="leading-7 text-gray-700">
        This guide will walk you through the process of installing and configuring ConnectX for your e-commerce project.
      </p>

      <h2 id="requirements" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Requirements
      </h2>
      <p className="leading-7 text-gray-700">Before you begin, make sure you have the following:</p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>Node.js 16.x or later</li>
        <li>npm 7.x or later or Yarn 1.22.x or later</li>
        <li>A ConnectX account (sign up at connectx.com if you don't have one)</li>
      </ul>

      <h2 id="installation" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Installation
      </h2>
      <p className="leading-7 text-gray-700 mb-4">You can install the ConnectX client library using npm or yarn:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">npm</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>npm install @connectx/client</code>
        </pre>
      </div>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">yarn</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>yarn add @connectx/client</code>
        </pre>
      </div>

      <h2 id="configuration" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Configuration
      </h2>
      <p className="leading-7 text-gray-700">
        After installing the client library, you need to configure it with your API key. Create a new file called{" "}
        <code>.env.local</code> in the root of your project and add your API key:
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">.env.local</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>CONNECTX_API_KEY=your_api_key_here</code>
        </pre>
      </div>

      <p className="leading-7 text-gray-700">Then, initialize the ConnectX client in your application:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">JavaScript</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`import { ConnectX } from '@connectx/client';

const connectx = new ConnectX({
  apiKey: process.env.CONNECTX_API_KEY,
});`}</code>
        </pre>
      </div>

      <h2 id="verification" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Verification
      </h2>
      <p className="leading-7 text-gray-700">
        To verify that your installation is working correctly, you can make a simple API call:
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">JavaScript</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`import { ConnectX } from '@connectx/client';

const connectx = new ConnectX({
  apiKey: process.env.CONNECTX_API_KEY,
});

async function verifyConnection() {
  try {
    const response = await connectx.health.check();
    console.log('Connection successful:', response);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

verifyConnection();`}</code>
        </pre>
      </div>

      <h2 id="next-steps" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Next Steps
      </h2>
      <p className="leading-7 text-gray-700">Now that you have installed and configured ConnectX, you can:</p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Follow the{" "}
          <a href="/docs/quickstart" className="text-[#02569B] hover:underline">
            Quickstart guide
          </a>{" "}
          to create your first e-commerce application
        </li>
        <li>
          Explore the{" "}
          <a href="/docs/authentication/overview" className="text-[#02569B] hover:underline">
            Authentication
          </a>{" "}
          documentation to learn how to secure your application
        </li>
        <li>
          Check out the{" "}
          <a href="/docs/products/overview" className="text-[#02569B] hover:underline">
            Product APIs
          </a>{" "}
          to start managing your inventory
        </li>
      </ul>

      <DocsPager
        prev={{
          title: "Introduction",
          href: "/docs",
        }}
        next={{
          title: "Quickstart",
          href: "/docs/quickstart",
        }}
      />
    </div>
  )
}
