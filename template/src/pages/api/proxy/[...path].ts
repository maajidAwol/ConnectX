import { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not set in environment variables');
}

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_API_KEY is not set in environment variables');
}

// Since we've checked API_URL is not undefined above, we can safely assert it here
const API_URL_SAFE = API_URL as string;

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

// Helper function to sanitize error messages
const sanitizeErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';

  // Handle network errors
  if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
    return 'Connection timed out. Please try again.';
  }
  if (error.cause?.code === 'UND_ERR_SOCKET') {
    return 'Connection lost. Please try again.';
  }

  // Handle fetch errors
  if (error.message === 'fetch failed') {
    return 'Unable to connect to the server. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
};

// Helper function to sanitize URL for logging
const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname}`;
  } catch {
    return 'unknown-url';
  }
};

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

  try {
    const { path, ...queryParams } = req.query;
    const pathString = Array.isArray(path) ? path.join('/') : path || '';

    // Construct the full URL, ensuring we don't have double slashes
    const baseUrl = API_URL_SAFE.endsWith('/') ? API_URL_SAFE.slice(0, -1) : API_URL_SAFE;
    const cleanPath = pathString.startsWith('/') ? pathString : `/${pathString}`;
    
    // Ensure the path ends with a trailing slash for POST requests
    const pathWithSlash = req.method !== 'GET' && !cleanPath.endsWith('/') ? `${cleanPath}/` : cleanPath;
    
    // Convert query parameters to URLSearchParams and clean any trailing slashes
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.replace(/\/$/, '')));
      } else if (value) {
        searchParams.append(key, value.toString().replace(/\/$/, ''));
      }
    });

    // Construct URL without adding extra slash
    const url = `${baseUrl}${pathWithSlash}?${searchParams.toString()}`;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': API_KEY as string,
    };

    // Forward relevant headers from the original request
    const forwardHeaders = [
      'Authorization',
      'X-CSRF-Token',
      'X-Requested-With',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Date',
      'X-Api-Version',
      'Cache-Control',
      'Pragma'
    ] as const;

    forwardHeaders.forEach(header => {
      const value = req.headers[header.toLowerCase()];
      if (value && typeof value === 'string') {
        headers[header as keyof HeadersInit] = value;
      } else if (value && Array.isArray(value) && value[0]) {
        headers[header as keyof HeadersInit] = value[0];
      }
    });

    // Forward the request to the backend
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Log request and response details in development
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('[Proxy Request]', {
    //     url: sanitizeUrl(url),
    //     method: req.method,
    //     headers,
    //     body: req.body
    //   });
    //   console.log('[Proxy Response]', {
    //     status: response.status,
    //     headers: Object.fromEntries(response.headers.entries())
    //   });
    // }

    // Get the response data
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          // Try to parse as JSON even if content-type is not application/json
          data = JSON.parse(text);
        } catch {
          data = { message: text || 'Invalid response from server' };
        }
      }

      // Log response data in development
      if (process.env.NODE_ENV === 'development') {
        // console.log('[Proxy Response Data]', data);
      }
    } catch (e) {
      // console.error('[Proxy Error] Error parsing response:', e);
      data = { message: 'Invalid response from server' };
    }

    // Handle specific error cases with user-friendly messages
    if (response.status === 401) {
      return res.status(401).json({
        message: 'Invalid email or password. Please try again.'
      });
    }

    if (response.status === 403) {
      return res.status(403).json({
        message: 'Access denied. Please check your credentials.'
      });
    }

    if (response.status === 404) {
      return res.status(404).json({
        message: 'The requested resource was not found.'
      });
    }

    if (response.status === 422) {
      return res.status(422).json({
        message: data.detail || 'Please check your input and try again.'
      });
    }

    if (response.status >= 500) {
      // Log error in development only
      // if (process.env.NODE_ENV === 'development') {
      //   console.error('[Proxy Error]', {
      //     endpoint: sanitizeUrl(url),
      //     status: response.status,
      //     method: req.method,
      //     requestBody: req.body,
      //     responseData: data
      //   });
      // }
      return res.status(500).json({
        message: data.message || 'The server is currently unavailable. Please try again later.'
      });
    }

    // Forward the response status and data
    res.status(response.status).json(data);
  } catch (error) {
    // Log error in development only
    // if (process.env.NODE_ENV === 'development') {
    //   console.error('[Proxy Error]', {
    //     error: sanitizeErrorMessage(error),
    //     endpoint: sanitizeUrl(`${API_URL_SAFE}/${Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || ''}`),
    //     method: req.method,
    //     requestBody: req.body
    //   });
    // }

    res.status(500).json({
      message: sanitizeErrorMessage(error)
    });
  }
} 