'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { CodeBlock } from './code-block';

interface PlatformCodeProps {
  webCode: string;
  mobileCode: string;
  title?: string;
}

export function PlatformCode({ webCode, mobileCode, title }: PlatformCodeProps) {
  return (
    <Tabs.Root defaultValue="web" className="w-full">
      <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700">
        <Tabs.Trigger
          value="web"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
        >
          Web
        </Tabs.Trigger>
        <Tabs.Trigger
          value="mobile"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
        >
          Mobile
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="web" className="mt-4">
        <CodeBlock code={webCode} title={title} language="javascript" />
      </Tabs.Content>
      <Tabs.Content value="mobile" className="mt-4">
        <CodeBlock code={mobileCode} title={title} language="typescript" />
      </Tabs.Content>
    </Tabs.Root>
  );
} 