'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";

interface CurlExecutorProps {
  defaultCommand: string;
  defaultBody?: string;
}

export function CurlExecutor({ defaultCommand, defaultBody }: CurlExecutorProps) {
  const [command, setCommand] = useState(defaultCommand);
  const [body, setBody] = useState(defaultBody || '');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const executeCurl = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Extract URL and headers from the cURL command
      const urlMatch = command.match(/'([^']+)'/);
      const headersMatch = command.match(/-H '([^']+)'/g);
      
      if (!urlMatch) {
        throw new Error('Invalid URL in cURL command');
      }

      const url = urlMatch[1];
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Parse headers
      headersMatch?.forEach(header => {
        const [key, value] = header.replace(/-H '|'$/g, '').split(': ');
        headers[key] = value;
      });

      // Determine HTTP method
      const method = command.includes('-X POST') ? 'POST' :
                    command.includes('-X PUT') ? 'PUT' :
                    command.includes('-X PATCH') ? 'PATCH' :
                    command.includes('-X DELETE') ? 'DELETE' : 'GET';

      // Make the request
      const response = await fetch(url, {
        method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      // Try to parse and format the JSON
      const parsed = JSON.parse(e.target.value);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {
      // If not valid JSON, just set the raw value
      setBody(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Command</h3>
          <Button
            variant="default"
            size="sm"
            onClick={executeCurl}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="ml-2">Execute</span>
          </Button>
        </div>
        <Textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="font-mono text-sm h-24"
          placeholder="Enter cURL command..."
        />
      </div>

      {['POST', 'PUT', 'PATCH'].some(method => command.includes(`-X ${method}`)) && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Request Body</h3>
          <Textarea
            value={body}
            onChange={handleBodyChange}
            className="font-mono text-sm h-32"
            placeholder="Enter JSON request body..."
          />
        </div>
      )}

      {error && (
        <div className="text-red-500 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {response && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Response</h3>
          <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto">
            <code className="text-gray-900 dark:text-gray-100">{response}</code>
          </pre>
        </div>
      )}
    </div>
  );
} 