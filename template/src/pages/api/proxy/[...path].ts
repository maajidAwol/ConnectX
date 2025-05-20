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

  // Log the incoming request
  console.log('Proxy request details:', {
    method: req.method,
    path,
    headers: {
      ...req.headers,
      authorization: req.headers.authorization ? '***' : undefined,
      'x-api-key': '***'
    },
    apiUrl: API_URL,
    apiKey: API_KEY ? '***' : 'missing',
  });

  try {
    // Construct the full URL
    const url = `${API_URL}/api/${path}`;
    console.log('Forwarding request to:', url);

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

    console.log('Request headers:', headers);

    // Make the request to the API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // Log the response status
    console.log('API response status:', response.status);

    // Get the response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      
      // Sanitize sensitive data before logging
      const sanitizedData = { ...data };
      if (sanitizedData.access) sanitizedData.access = '***';
      if (sanitizedData.refresh) sanitizedData.refresh = '***';
      if (sanitizedData.user) {
        sanitizedData.user = {
          ...sanitizedData.user,
          email: '***',
          password: '***',
          phone: '***',
          id: '***'
        };
      }
      console.log('API response data:', sanitizedData);
    } else {
      data = await response.text();
      console.log('API response data: [text response]');
    }

    // Handle error responses
    if (!response.ok) {
      console.error('API error response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });
      return res.status(response.status).json(data);
    }

    // Return successful response
    return res.status(response.status).json(data);
  } catch (error) {
    // Log the full error
    console.error('Proxy error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return error response
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 