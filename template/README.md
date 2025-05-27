# ConnectX Template

## Introduction
This template provides a ready-to-use e-commerce solution that can be easily integrated with your ConnectX API key. It includes all necessary features for running an online store, including product management, shopping cart, checkout, and user authentication.

## Features
- **Product Management:** Complete CRUD operations for products with categories and stock tracking
- **Shopping Cart:** Seamless cart management and checkout process
- **User Authentication:** Secure login and registration with JWT-based authentication
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Theme Customization:** Easily customizable through the ConnectX dashboard

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── store/                 # State management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── utils/                 # Helper utilities
└── styles/                # Global styles
```

## Getting Started
### Prerequisites
- A ConnectX account with an active API key
- Node.js 18.x or later
- Yarn package manager

### Installation
1. **Clone the template**
   ```bash
   git clone https://github.com/connectx/template.git
   cd template
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

## Integration & Deployment
For detailed integration and deployment instructions, see [docs/INTEGRATION.md](docs/INTEGRATION.md).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## USING YARN (Recommend)

- yarn install
- yarn dev

## USING NPM

- npm i OR npm i --legacy-peer-deps
- npm run dev
