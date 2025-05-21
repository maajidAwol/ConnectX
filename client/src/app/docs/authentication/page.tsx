import { DocPageHeader } from "../components/doc-page-header"
import { DocsPager } from "../components/pager"
import { DocSection } from "../components/doc-section"
import { PlatformCode } from "../components/platform-code"

export default function AuthenticationPage() {
  return (
    <div className="space-y-8">
      <DocPageHeader
        heading="Authentication"
        text="Learn how to authenticate your requests to the ConnectX API."
      />

      <DocSection title="API Keys" defaultOpen={true}>
        <p className="text-gray-700 mb-4">
          API keys are the simplest way to authenticate your requests. Include your API key in the Authorization header:
        </p>
        <PlatformCode
          webCode={`// Web Example
const response = await fetch('https://api.connectx.com/v1/products', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`}
          mobileCode={`// Mobile Example (React Native)
import axios from 'axios';

const fetchProducts = async () => {
  try {
    const response = await axios.get('https://api.connectx.com/v1/products', {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};`}
          title="API Key Authentication"
        />
      </DocSection>

      <DocSection title="OAuth 2.0">
        <p className="text-gray-700 mb-4">
          OAuth 2.0 provides more granular control over access. Here's how to implement the authorization code flow:
        </p>
        <PlatformCode
          webCode={`// Web Example
// 1. Redirect user to authorization URL
const authUrl = 'https://api.connectx.com/oauth/authorize?' + new URLSearchParams({
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'YOUR_REDIRECT_URI',
  response_type: 'code',
  scope: 'read write'
});

// 2. Exchange code for token
const response = await fetch('https://api.connectx.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: 'AUTHORIZATION_CODE',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    redirect_uri: 'YOUR_REDIRECT_URI'
  })
});`}
          mobileCode={`// Mobile Example (React Native)
import { authorize, refresh } from 'react-native-app-auth';

const config = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUrl: 'YOUR_REDIRECT_URI',
  scopes: ['read', 'write'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.connectx.com/oauth/authorize',
    tokenEndpoint: 'https://api.connectx.com/oauth/token',
  }
};

// 1. Authorize user
const authState = await authorize(config);

// 2. Use the token
const response = await fetch('https://api.connectx.com/v1/products', {
  headers: {
    'Authorization': \`Bearer \${authState.accessToken}\`,
    'Content-Type': 'application/json'
  }
});`}
          title="OAuth 2.0 Flow"
        />
      </DocSection>

      <DocSection title="JWT Authentication">
        <p className="text-gray-700 mb-4">
          JWT tokens provide stateless authentication. Here's how to use them:
        </p>
        <PlatformCode
          webCode={`// Web Example
// 1. Login to get JWT
const loginResponse = await fetch('https://api.connectx.com/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const { token } = await loginResponse.json();

// 2. Use JWT in requests
const response = await fetch('https://api.connectx.com/v1/products', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});`}
          mobileCode={`// Mobile Example (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Login to get JWT
const login = async () => {
  try {
    const response = await axios.post('https://api.connectx.com/auth/login', {
      email: 'user@example.com',
      password: 'password'
    });
    
    const { token } = response.data;
    await AsyncStorage.setItem('userToken', token);
    return token;
  } catch (error) {
    console.error('Login error:', error);
  }
};

// 2. Use JWT in requests
const fetchProducts = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get('https://api.connectx.com/v1/products', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};`}
          title="JWT Authentication"
        />
      </DocSection>

      <DocSection title="Error Handling">
        <p className="text-gray-700 mb-4">
          Handle authentication errors appropriately:
        </p>
        <PlatformCode
          webCode={`// Web Example
try {
  const response = await fetch('https://api.connectx.com/v1/products', {
    headers: {
      'Authorization': 'Bearer INVALID_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
} catch (error) {
  if (error.message === 'Invalid token') {
    // Handle invalid token
  } else if (error.message === 'Token expired') {
    // Handle token expiration
  }
}`}
          mobileCode={`// Mobile Example (React Native)
const fetchProducts = async () => {
  try {
    const response = await axios.get('https://api.connectx.com/v1/products', {
      headers: {
        'Authorization': 'Bearer INVALID_TOKEN',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        default:
          // Handle other errors
      }
    }
  }
};`}
          title="Error Handling"
        />
      </DocSection>

      <DocsPager
        next={{
          label: "API Endpoints",
          href: "/docs/api-endpoints",
        }}
      />
    </div>
  )
} 