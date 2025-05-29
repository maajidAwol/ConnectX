# ConnectX Client

**A modern, multi-tenant e-commerce frontend built with Next.js 15**

ConnectX is a centralized, multi-tenant e-commerce platform that democratizes online commerce for entrepreneurs, startups, and students. This client application provides a comprehensive dashboard and management interface for merchants, administrators, and customers.

## 🚀 Features

### 🏪 **Merchant Dashboard**
- **Product Management**: Complete CRUD operations for products with categories and stock tracking
- **Order Processing**: Streamlined order fulfillment with automated processing and status tracking
- **Category Management**: Hierarchical product categorization with icon support
- **Analytics & Reporting**: Revenue tracking, sales analytics, and performance metrics
- **Team Management**: Multi-user access with role-based permissions
- **API Integration**: Developer tools and API key management
- **Business Verification**: Merchant verification system with document upload

### 👨‍💼 **Admin Panel**
- **Merchant Management**: Oversee all registered merchants and their verification status
- **System Analytics**: Platform-wide statistics and performance monitoring
- **User Management**: Admin user creation and permission management
- **Platform Settings**: Global configuration and system maintenance

### 🛡️ **Authentication & Security**
- **Multi-role Authentication**: Secure login for merchants, admins, and customers
- **JWT Token Management**: Secure session handling with refresh tokens
- **Email Verification**: Account verification and password reset functionality
- **Protected Routes**: Role-based access control throughout the application

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Component Library**: Built with Radix UI and shadcn/ui components
- **Accessibility**: WCAG compliant interface elements
- **Loading States**: Skeleton loaders and smooth transitions

## 🌐 Live Demo

**Try ConnectX in action:** [https://connect-x-peach.vercel.app/](https://connect-x-peach.vercel.app/)

Experience the full platform functionality including merchant dashboard, product management, and order processing in our deployed version.

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library

### **State Management**
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### **Data & API**
- **Axios** - HTTP client for API requests
- **Jose** - JWT token handling
- **React Query** - Server state management (via Zustand)

### **Development & Testing**
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **Testing Library** - React component testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── merchant/          # Merchant dashboard pages
│   ├── login/             # Authentication pages
│   ├── signup/            # Registration pages
│   └── docs/              # Documentation pages
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── categories/        # Category management components
│   ├── products/          # Product management components
│   ├── orders/            # Order management components
│   └── modals/            # Modal dialogs
├── store/                 # Zustand state stores
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── utils/                 # Helper utilities
└── styles/                # Global styles
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17 or later
- **npm**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maajidAwol/ConnectX
   cd ConnectX/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://connectx-backend-295168525338.europe-west1.run.app/
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or

   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Build & Deployment

### Production Build
```bash
npm run build    # Create production build
npm run start    # Start production server
```

### Deployment Options
- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Static site deployment
- **Docker** - Containerized deployment
- **Traditional hosting** - Build and serve static files

## 🔧 Configuration

### Next.js Configuration
The project uses custom Next.js configuration in `next.config.mjs`:
- ESLint errors ignored during builds
- TypeScript build errors ignored
- Image optimization disabled for static exports

### Tailwind Configuration
Custom Tailwind setup with:
- Dark mode support
- Custom color palette
- Extended animations
- Component-specific styling

## 📚 Key Features Deep Dive

### Multi-Tenant Architecture
- **Tenant Isolation**: Each merchant operates in their own isolated environment
- **Shared Infrastructure**: Common backend services reduce costs and complexity
- **Scalable Design**: Supports unlimited merchants on a single platform

### State Management
- **Zustand Stores**: Lightweight, TypeScript-friendly state management
- **Persistent State**: User sessions and preferences maintained across visits
- **Optimistic Updates**: Immediate UI feedback with server synchronization

### Authentication Flow
- **JWT-based**: Secure token-based authentication
- **Role-based Access**: Different interfaces for merchants, admins, and customers
- **Session Management**: Automatic token refresh and logout handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **ConnectX Backend** - The API server powering this frontend
- **ConnectX Mobile** - Flutter mobile application
- **ConnectX Templates** - Web app template to build on connectX API



