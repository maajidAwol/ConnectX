'use client';

import { useState } from 'react';
import { DocPageHeader } from "../../components/doc-page-header";
import { DocsPager } from "../../components/pager";
import { DocSection } from "../../components/doc-section";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

interface CodeExample {
  title: string;
  description: string;
  command: string;
  response?: string;
}

const webExamples: CodeExample[] = [
  {
    title: "Clone Repository",
    description: "Clone the ConnectX repository from GitHub.",
    command: `git clone https://github.com/your-username/connectx.git
cd connectx`
  },
  {
    title: "Install Dependencies",
    description: "Install the required dependencies using npm or yarn.",
    command: `# Using npm
npm install

# Using yarn
yarn install`
  },
  {
    title: "Environment Setup",
    description: "Create and configure your environment variables.",
    command: `# Create .env file
cp .env.example .env

# Configure your environment variables
NEXT_PUBLIC_API_URL=https://connectx-backend-4o0i.onrender.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000`
  },
  {
    title: "Start Development Server",
    description: "Start the development server.",
    command: `# Using npm
npm run dev

# Using yarn
yarn dev`
  }
];

const mobileExamples: CodeExample[] = [
  {
    title: "Clone Repository",
    description: "Clone the ConnectX mobile repository from GitHub.",
    command: `git clone https://github.com/your-username/connectx-mobile.git
cd connectx-mobile`
  },
  {
    title: "Install Dependencies",
    description: "Install the required dependencies using Flutter.",
    command: `# Install Flutter dependencies
flutter pub get`
  },
  {
    title: "Environment Setup",
    description: "Configure your environment variables.",
    command: `# Create .env file
cp .env.example .env

# Configure your environment variables
API_URL=https://connectx-backend-4o0i.onrender.com/api
APP_URL=http://localhost:3000`
  },
  {
    title: "Run the App",
    description: "Run the app on your preferred platform.",
    command: `# For Android
flutter run -d android

# For iOS
flutter run -d ios`
  }
];

export default function InstallationPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderExample = (example: CodeExample) => {
    const id = `code-${example.title}`;
    return (
      <div key={id} className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{example.description}</p>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Command</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(example.command, `${id}-command`)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {copied === `${id}-command` ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </Button>
          </div>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{example.command}</code>
          </pre>
        </div>

        {example.response && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Response</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(example.response!, `${id}-response`)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {copied === `${id}-response` ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </Button>
            </div>
            <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
              <code className="text-gray-900 dark:text-gray-100 font-mono text-sm">{example.response}</code>
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Installation Guide"
        text="Learn how to install and set up ConnectX for web and mobile platforms"
      />

      <DocSection title="Prerequisites" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Web Development</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Node.js (v18 or higher)</li>
            <li>npm or yarn package manager</li>
            <li>Git</li>
            <li>Modern web browser</li>
          </ul>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Mobile Development</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Flutter SDK (latest stable version)</li>
            <li>Android Studio (for Android development)</li>
            <li>Xcode (for iOS development, macOS only)</li>
            <li>Git</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Installation Steps" defaultOpen={true}>
        <Tabs defaultValue="web" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="web">Web Installation</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Installation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="web" className="space-y-8">
            {webExamples.map((example) => renderExample(example))}
          </TabsContent>
          
          <TabsContent value="mobile" className="space-y-8">
            {mobileExamples.map((example) => renderExample(example))}
          </TabsContent>
        </Tabs>
      </DocSection>

      <DocSection title="Verification" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Web</h3>
          <p className="text-gray-700 dark:text-gray-300">
            After installation, open your browser and navigate to <code className="text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">http://localhost:3000</code>. You should see the ConnectX web application running.
          </p>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Mobile</h3>
          <p className="text-gray-700 dark:text-gray-300">
            After installation, run the app on your preferred platform. You should see the ConnectX mobile application running on your device or emulator.
          </p>
        </div>
      </DocSection>

      <DocSection title="Troubleshooting" defaultOpen={true}>
        <div className="space-y-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Common Issues</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Port already in use</strong>
              <p>If port 3000 is already in use, you can change it in the package.json file or use a different port when starting the development server.</p>
            </li>
            <li>
              <strong>Missing dependencies</strong>
              <p>If you encounter missing dependency errors, try deleting the node_modules folder and running npm install or yarn install again.</p>
            </li>
            <li>
              <strong>Environment variables not loading</strong>
              <p>Make sure your .env file is properly configured and located in the root directory of the project.</p>
            </li>
          </ul>
        </div>
      </DocSection>

      <DocsPager />
    </div>
  );
} 