import type { NextApiRequest, NextApiResponse } from 'next';

// Ensure we have the correct API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/api$/, '') || 'https://connectx-9agd.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the path segments and join them
  const pathSegments = req.query.path as string[];
  let path = pathSegments.join('/');

  // Ensure path ends with a trailing slash for POST requests
  if (req.method === 'POST' && !path.endsWith('/')) {
    path = `${path}/`;
  }

  try {
    // Construct the full URL
    const url = `${API_URL}/api/${path}`;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': API_KEY || '',
    };

    // Add authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // Make the request to the API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // Get the response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Return successful response
    return res.status(response.status).json(data);
  } catch (error) {
    // Return error response
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 