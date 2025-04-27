import { DocPageHeader } from "../components/doc-page-header"
import { DocsPager } from "../components/pager"

export default function QuickstartPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader heading="Quickstart" text="Get up and running with ConnectX in minutes." />

      <p className="leading-7 text-gray-700">
        This quickstart guide will help you create a simple e-commerce application using ConnectX. By the end of this
        guide, you'll have a working application that can list products, handle user authentication, and process orders.
      </p>

      <h2 id="prerequisites" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Prerequisites
      </h2>
      <p className="leading-7 text-gray-700">Before you begin, make sure you have:</p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Installed ConnectX (see the{" "}
          <a href="/docs/installation" className="text-[#02569B] hover:underline">
            Installation guide
          </a>
          )
        </li>
        <li>Set up your API key</li>
        <li>Basic knowledge of JavaScript and React</li>
      </ul>

      <h2 id="create-project" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Create a New Project
      </h2>
      <p className="leading-7 text-gray-700">Let's start by creating a new Next.js project:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Terminal</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>npx create-next-app my-connectx-store</code>
        </pre>
      </div>

      <p className="leading-7 text-gray-700">Navigate to your project directory:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Terminal</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>cd my-connectx-store</code>
        </pre>
      </div>

      <h2 id="install-dependencies" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Install Dependencies
      </h2>
      <p className="leading-7 text-gray-700">Install the ConnectX client library:</p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Terminal</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>npm install @connectx/client</code>
        </pre>
      </div>

      <h2 id="configure-api-key" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Configure API Key
      </h2>
      <p className="leading-7 text-gray-700">
        Create a <code>.env.local</code> file in the root of your project and add your ConnectX API key:
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

      <h2 id="create-api-client" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Create API Client
      </h2>
      <p className="leading-7 text-gray-700">
        Create a new file called <code>lib/connectx.js</code> to initialize the ConnectX client:
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">lib/connectx.js</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`import { ConnectX } from '@connectx/client';

const connectx = new ConnectX({
  apiKey: process.env.CONNECTX_API_KEY,
});

export default connectx;`}</code>
        </pre>
      </div>

      <h2 id="fetch-products" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Fetch Products
      </h2>
      <p className="leading-7 text-gray-700">
        Create a new API route to fetch products from ConnectX. Create a file called{" "}
        <code>app/api/products/route.js</code>:
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">app/api/products/route.js</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`import { NextResponse } from 'next/server';
import connectx from '@/lib/connectx';

export async function GET() {
  try {
    const products = await connectx.products.list({
      limit: 10,
    });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}`}</code>
        </pre>
      </div>

      <h2 id="display-products" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-12">
        Display Products
      </h2>
      <p className="leading-7 text-gray-700">
        Now, let's create a page to display the products. Update your <code>app/page.js</code> file:
      </p>

      <div className="rounded-md bg-gray-900 p-4 my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">app/page.js</span>
          <button className="text-xs text-gray-400 hover:text-white">Copy</button>
        </div>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{`'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow" >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">\${product.price}</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`}</code>
        </pre>
      </div>

      <DocsPager
        prev={{ title: "Installation", href: "/docs/installation" }}
        next={{ title: "Authentication", href: "/docs/authentication/overview" }}
      />
    </div>
  )
}
