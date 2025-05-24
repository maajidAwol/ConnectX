import type { NextApiRequest, NextApiResponse } from 'next';

// Ensure we have the correct API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://connectx-9agd.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Define allowed headers
const ALLOWED_HEADERS = [
  'X-CSRF-Token',
  'X-Requested-With',
  'Accept',
  'Accept-Version',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Version',
  'Authorization',
  'X-API-KEY',
  'x-api-key',
  'Cache-Control',
  'Pragma'
].join(',');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS);

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ detail: 'Path parameter is required' });
  }

  // Clean the path by removing any duplicate /api and ensuring no double slashes
  const cleanPath = Array.isArray(path) 
    ? path.join('/').replace(/^api\//, '').replace(/\/+/g, '/')
    : path.toString().replace(/^api\//, '').replace(/\/+/g, '/');

  // Ensure the path ends with a trailing slash
  const pathWithSlash = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;

  // Construct the target URL - the backend already has /api in its routes
  const targetUrl = `${API_URL}/${pathWithSlash}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': API_KEY || '',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
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

    // Forward the response status and data
    res.status(response.status).json(data);
  } catch (error: any) {
    // Handle network errors or other unexpected errors
    console.error('Proxy error:', error);
    res.status(500).json({
      detail: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
} 