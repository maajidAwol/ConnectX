# ConnectX E-commerce Template Integration Guide

## Overview
This template provides a ready-to-use e-commerce solution that can be easily integrated with your ConnectX API key. The template includes all necessary features for running an online store, including product management, shopping cart, checkout, and user authentication.

## Prerequisites
- A ConnectX account with an active API key
- Node.js 18.x or later
- Yarn package manager

## Quick Start

1. **Clone the template**
   ```bash
   git clone https://github.com/AASTUSoftwareEngineeringDepartment/ConnectX
   cd ConnectX/template
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://api.connectx.com
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

## API Integration

### Authentication
The template uses JWT-based authentication. All API requests are automatically handled through the built-in proxy.

### Available Endpoints

#### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details


#### Orders
- `GET /api/orders` - List orders (requires authentication)
- `GET /api/orders/:id` - Get order details (requires authentication)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (requires authentication)

#### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)
- `PUT /api/auth/me` - Update user profile (requires authentication)

### Customization

#### Theme Customization
The template supports theme customization through the ConnectX dashboard:
1. Log in to your ConnectX dashboard
2. Navigate to Store Settings > Theme
3. Customize colors, fonts, and layout
4. Save changes

#### Custom Components
You can override default components by creating your own versions in the `src/components` directory.

## Deployment

### Production Build
```bash
yarn build
```

### Deployment Options
1. **Vercel** (Recommended)
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy

2. **Netlify**
   - Connect your GitHub repository to Netlify
   - Configure environment variables in Netlify dashboard
   - Deploy

3. **Custom Server**
   - Build the project: `yarn build`
   - Start the server: `yarn start`

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your API key in the ConnectX merchant dashboard
   - Check if the API key is correctly set in `.env.local`
   - Ensure the backend URL is correct

2. **Authentication Issues**
   - Clear browser cache and cookies
   - Verify JWT token in browser storage
   - Check if the token is expired

3. **Build Errors**
   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `yarn install`
   - Rebuild: `yarn build`

## Support
For additional support:
- Visit our [Documentation](https://connect-x-peach.vercel.app/docs)
