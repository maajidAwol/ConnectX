// This file contains dummy data for demonstration purposes
// In a production environment, this would be replaced with API calls

// User data
export const users = [
    {
      id: 1,
      email: "admin@connectx.com",
      name: "Admin User",
      role: "admin",
      avatar: "A",
    },
    {
      id: 2,
      email: "merchant@example.com",
      name: "Abebe Kebede",
      role: "merchant",
      isVerified: false,
      avatar: "A",
    },
    {
      id: 3,
      email: "verified@example.com",
      name: "Tigist Haile",
      role: "merchant",
      isVerified: true,
      avatar: "T",
    },
  ]
  
  // Product data
  export const products = [
    {
      id: "prod_001",
      name: "Premium Headphones",
      sku: "SKU-001",
      price: 3499.99,
      stock: 42,
      category: "Electronics",
      sales: 142,
      revenue: "ETB 496,799",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: false,
    },
    {
      id: "prod_002",
      name: "Fitness Tracker",
      sku: "SKU-042",
      price: 2799.95,
      stock: 28,
      category: "Electronics",
      sales: 98,
      revenue: "ETB 274,395",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: false,
    },
    {
      id: "prod_003",
      name: "Wireless Earbuds",
      sku: "SKU-108",
      price: 1899.99,
      stock: 5,
      category: "Electronics",
      sales: 65,
      revenue: "ETB 123,499",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: true,
    },
    {
      id: "prod_004",
      name: "Smart Watch",
      sku: "SKU-157",
      price: 4299.99,
      stock: 3,
      category: "Electronics",
      sales: 54,
      revenue: "ETB 232,199",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: true,
    },
    {
      id: "prod_005",
      name: "Bluetooth Speaker",
      sku: "SKU-203",
      price: 1699.99,
      stock: 2,
      category: "Electronics",
      sales: 87,
      revenue: "ETB 147,899",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: true,
    },
    {
      id: "prod_006",
      name: "Laptop Stand",
      sku: "SKU-289",
      price: 999.99,
      stock: 18,
      category: "Accessories",
      sales: 76,
      revenue: "ETB 75,999",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: false,
    },
    {
      id: "prod_007",
      name: "Wireless Charger",
      sku: "SKU-315",
      price: 1299.99,
      stock: 24,
      category: "Electronics",
      sales: 85,
      revenue: "ETB 110,499",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: false,
    },
    {
      id: "prod_008",
      name: "Phone Case",
      sku: "SKU-422",
      price: 699.99,
      stock: 8,
      category: "Accessories",
      sales: 112,
      revenue: "ETB 78,399",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: true,
      lowStock: false,
    },
    {
      id: "prod_009",
      name: "Traditional Coffee Set",
      sku: "SKU-501",
      price: 1799.99,
      stock: 150,
      category: "Home & Kitchen",
      sales: 45,
      revenue: "ETB 80,999",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: false,
      merchantId: 3,
      lowStock: false,
    },
    {
      id: "prod_010",
      name: "Handmade Jewelry",
      sku: "SKU-502",
      price: 2199.99,
      stock: 32,
      category: "Accessories",
      sales: 28,
      revenue: "ETB 61,599",
      image: "/placeholder.svg?height=100&width=100",
      centrallyListed: false,
      merchantId: 3,
      lowStock: false,
    },
  ]
  
  // Order data
  export const orders = [
    {
      id: "#ORD-7245",
      customer: "Yared Tesfaye",
      email: "yared.tesfaye@example.com",
      status: "Processing",
      amount: "ETB 4,799.99",
      date: "2 hours ago",
      items: [
        { product: "Premium Headphones", quantity: 1, price: "ETB 3,499.99", lowStock: false },
        { product: "Phone Case", quantity: 1, price: "ETB 699.99", lowStock: false },
      ],
      shipping: {
        address: "Bole Sub-city, Woreda 6, House No. 123, Addis Ababa",
        method: "Standard Shipping",
        tracking: "TRK123456789",
      },
    },
    {
      id: "#ORD-7244",
      customer: "Meron Tadesse",
      email: "meron.t@example.com",
      status: "Shipped",
      amount: "ETB 2,799.95",
      date: "5 hours ago",
      items: [{ product: "Fitness Tracker", quantity: 1, price: "ETB 2,799.95", lowStock: false }],
      shipping: {
        address: "Kirkos Sub-city, Woreda 3, Near Meskel Square, Addis Ababa",
        method: "Express Shipping",
        tracking: "TRK987654321",
      },
    },
    {
      id: "#ORD-7243",
      customer: "Dawit Alemu",
      email: "dawit@example.com",
      status: "Delivered",
      amount: "ETB 8,099.97",
      date: "Yesterday",
      items: [
        { product: "Smart Watch", quantity: 1, price: "ETB 4,299.99", lowStock: true },
        { product: "Wireless Earbuds", quantity: 2, price: "ETB 3,799.98", lowStock: true },
      ],
      shipping: {
        address: "Arada Sub-city, Woreda 8, Piazza Area, House No. 431, Addis Ababa",
        method: "Priority Shipping",
        tracking: "TRK456789123",
      },
    },
    {
      id: "#ORD-7242",
      customer: "Selam Hailu",
      email: "selam.h@example.com",
      status: "Processing",
      amount: "ETB 1,999.98",
      date: "Yesterday",
      items: [
        { product: "Phone Case", quantity: 1, price: "ETB 699.99", lowStock: false },
        { product: "Wireless Charger", quantity: 1, price: "ETB 1,299.99", lowStock: false },
      ],
      shipping: {
        address: "Lideta Sub-city, Woreda 5, Mexico Area, Addis Ababa",
        method: "Standard Shipping",
        tracking: "Pending",
      },
    },
    {
      id: "#ORD-7241",
      customer: "Bereket Girma",
      email: "bereket@example.com",
      status: "Shipped",
      amount: "ETB 2,699.98",
      date: "2 days ago",
      items: [
        { product: "Bluetooth Speaker", quantity: 1, price: "ETB 1,699.99", lowStock: true },
        { product: "Laptop Stand", quantity: 1, price: "ETB 999.99", lowStock: false },
      ],
      shipping: {
        address: "Addis Ketema Sub-city, Woreda 7, Merkato Area, Addis Ababa",
        method: "Express Shipping",
        tracking: "TRK789123456",
      },
    },
  ]
  
  // Merchant store data
  export const merchantStores = [
    {
      title: "Habesha Electronics",
      description: "High-quality electronics and accessories",
      category: "Electronics",
      products: 128,
      rating: 4.8,
    },
    {
      title: "Desta Fashion",
      description: "Trendy clothing and accessories for all seasons",
      category: "Apparel",
      products: 256,
      rating: 4.6,
    },
    {
      title: "Abyssinia Home",
      description: "Everything you need for your home",
      category: "Home & Kitchen",
      products: 192,
      rating: 4.7,
    },
    {
      title: "Ethiopian Outdoors",
      description: "Gear for outdoor enthusiasts",
      category: "Sports & Outdoors",
      products: 84,
      rating: 4.5,
    },
    {
      title: "Amist Beauty",
      description: "Premium beauty and personal care products",
      category: "Beauty",
      products: 112,
      rating: 4.9,
    },
    {
      title: "Tinsae Kids",
      description: "Toys, games, and children's products",
      category: "Kids",
      products: 76,
      rating: 4.4,
    },
  ]
  
  // Integration data
  export const integrations = [
    {
      name: "Payment Gateway",
      provider: "CBE Birr",
      status: "Active",
      lastSync: "10 minutes ago",
      requests: "2.4K/day",
    },
    {
      name: "Shipping Provider",
      provider: "Ethiopian Post",
      status: "Active",
      lastSync: "1 hour ago",
      requests: "850/day",
    },
    {
      name: "Inventory Management",
      provider: "StockControl",
      status: "Active",
      lastSync: "30 minutes ago",
      requests: "1.2K/day",
    },
    {
      name: "Email Marketing",
      provider: "MailConnect",
      status: "Active",
      lastSync: "2 hours ago",
      requests: "450/day",
    },
    {
      name: "Analytics",
      provider: "DataInsight",
      status: "Active",
      lastSync: "15 minutes ago",
      requests: "3.1K/day",
    },
    {
      name: "Customer Support",
      provider: "HelpDesk",
      status: "Active",
      lastSync: "45 minutes ago",
      requests: "620/day",
    },
  ]
  
  // Analytics data
  export const salesData = {
    direct: 843331,
    marketplace: 412458,
    affiliate: 184442,
    total: 1440231,
  }
  
  // Admin data
  export const adminMetrics = {
    totalMerchants: 1248,
    totalRevenue: 14584432,
    activeDevelopers: 342,
    systemHealth: 99.8,
  }
  
  // System metrics
  export const systemMetrics = [
    { name: "API Response Time", value: "124ms", percentage: 15 },
    { name: "Database Load", value: "42%", percentage: 42 },
    { name: "Memory Usage", value: "68%", percentage: 68 },
    { name: "Storage Capacity", value: "23%", percentage: 23 },
  ]
  
  // Top merchants
  export const topMerchants = [
    { name: "Habesha Electronics", volume: "ETB 1,425,820", growth: "+12%" },
    { name: "Desta Fashion", volume: "ETB 1,181,030", growth: "+8%" },
    { name: "Abyssinia Home", volume: "ETB 964,250", growth: "+15%" },
    { name: "Ethiopian Outdoors", volume: "ETB 872,320", growth: "+5%" },
  ]
  
  // API usage
  export const apiUsage = [
    { endpoint: "/api/products", requests: "1.2M", change: "+18%" },
    { endpoint: "/api/orders", requests: "845K", change: "+5%" },
    { endpoint: "/api/users", requests: "632K", change: "+10%" },
    { endpoint: "/api/payments", requests: "418K", change: "+22%" },
  ]
  
  // Recent activity
  export const adminActivity = [
    { title: "New merchant registered", time: "10 minutes ago" },
    { title: "API rate limit increased for Premium tier", time: "1 hour ago" },
    { title: "System update completed", time: "3 hours ago" },
    { title: "New feature toggle activated", time: "5 hours ago" },
  ]
  
  export const merchantActivity = [
    { title: "New order received", time: "10 minutes ago" },
    { title: "Product inventory updated", time: "1 hour ago" },
    { title: "Customer review submitted", time: "3 hours ago" },
    { title: "Promotion campaign started", time: "5 hours ago" },
  ]
  
  // Team members
  export const teamMembers = [
    {
      id: 1,
      name: "Amanuel Tadesse",
      email: "amanuel@example.com",
      role: "Store Manager",
      status: "Active",
      lastActive: "2 hours ago",
      avatar: "A",
    },
    {
      id: 2,
      name: "Hiwot Gezahegn",
      email: "hiwot@example.com",
      role: "Inventory Specialist",
      status: "Active",
      lastActive: "1 day ago",
      avatar: "H",
    },
    {
      id: 3,
      name: "Mesfin Abebe",
      email: "mesfin@example.com",
      role: "Customer Support",
      status: "Inactive",
      lastActive: "5 days ago",
      avatar: "M",
    },
    {
      id: 4,
      name: "Sara Negash",
      email: "sara@example.com",
      role: "Marketing Specialist",
      status: "Active",
      lastActive: "3 hours ago",
      avatar: "S",
    },
  ]
  
  // Business profile data
  export const businessProfile = {
    unverified: {
      companyName: "Abebe Trading",
      businessType: "Sole Proprietorship",
      contactEmail: "abebe.trading@example.com",
      contactPhone: "+251 911 234 567",
      address: "Bole Sub-city, Woreda 6, House No. 123, Addis Ababa",
      website: "https://abebe-trading.com",
      description: "We sell high-quality products for everyday use.",
      foundedYear: 2020,
      verificationStatus: "Unverified",
    },
    verified: {
      companyName: "Tigist Import & Export",
      businessType: "Private Limited Company",
      contactEmail: "info@tigistimport.com",
      contactPhone: "+251 966 789 012",
      address: "Kirkos Sub-city, Woreda 3, Near Meskel Square, Addis Ababa",
      website: "https://tigistimport.com",
      description: "Premium retailer of specialty products.",
      foundedYear: 2015,
      verificationStatus: "Verified",
      tinNumber: "0032648791",
      businessLicense: "BL-2015/7834",
      bankAccount: "1000542987214",
      verifiedSince: "January 15, 2023",
    },
  }
  
  // Verification requests
  export const verificationRequests = [
    {
      id: "VR-001",
      merchantId: 2,
      merchantName: "Abebe Trading",
      submittedDate: "2023-04-15",
      status: "Pending",
      documents: [
        { name: "Business Registration", status: "Submitted" },
        { name: "Tax ID Number", status: "Submitted" },
        { name: "Bank Account Verification", status: "Submitted" },
      ],
    },
    {
      id: "VR-002",
      merchantId: 4,
      merchantName: "Mekonnen General Trading",
      submittedDate: "2023-04-10",
      status: "Under Review",
      documents: [
        { name: "Business Registration", status: "Verified" },
        { name: "Tax ID Number", status: "Under Review" },
        { name: "Bank Account Verification", status: "Pending" },
      ],
    },
    {
      id: "VR-003",
      merchantId: 5,
      merchantName: "Habesha Import/Export",
      submittedDate: "2023-04-05",
      status: "Approved",
      documents: [
        { name: "Business Registration", status: "Verified" },
        { name: "Tax ID Number", status: "Verified" },
        { name: "Bank Account Verification", status: "Verified" },
      ],
    },
    {
      id: "VR-004",
      merchantId: 6,
      merchantName: "Admas Local Shop",
      submittedDate: "2023-04-01",
      status: "Rejected",
      documents: [
        { name: "Business Registration", status: "Verified" },
        { name: "Tax ID Number", status: "Rejected" },
        { name: "Bank Account Verification", status: "Verified" },
      ],
      rejectionReason: "Tax ID Number could not be verified. Please resubmit with correct information.",
    },
  ]
  
  // Product categories
  export const productCategories = [
    { id: 1, name: "Electronics", count: 45 },
    { id: 2, name: "Clothing", count: 32 },
    { id: 3, name: "Home & Kitchen", count: 28 },
    { id: 4, name: "Beauty & Personal Care", count: 19 },
    { id: 5, name: "Sports & Outdoors", count: 24 },
    { id: 6, name: "Toys & Games", count: 17 },
    { id: 7, name: "Books", count: 21 },
    { id: 8, name: "Automotive", count: 13 },
    { id: 9, name: "Health & Wellness", count: 16 },
    { id: 10, name: "Traditional Crafts", count: 23 },
    { id: 11, name: "Coffee & Spices", count: 18 },
    { id: 12, name: "Jewelry", count: 9 },
  ]
  
  // Customer data
  export const customers = [
    {
      id: "cust_001",
      name: "Yared Tesfaye",
      email: "yared.tesfaye@example.com",
      phone: "+251 911 123 456",
      address: "Bole Sub-city, Woreda 6, House No. 123, Addis Ababa",
      orders: 8,
      totalSpent: "ETB 32,450",
      lastPurchase: "2 days ago",
      status: "Active",
    },
    {
      id: "cust_002",
      name: "Meron Tadesse",
      email: "meron.t@example.com",
      phone: "+251 922 345 678",
      address: "Kirkos Sub-city, Woreda 3, Near Meskel Square, Addis Ababa",
      orders: 5,
      totalSpent: "ETB 18,720",
      lastPurchase: "1 week ago",
      status: "Active",
    },
    {
      id: "cust_003",
      name: "Dawit Alemu",
      email: "dawit@example.com",
      phone: "+251 933 567 890",
      address: "Arada Sub-city, Woreda 8, Piazza Area, House No. 431, Addis Ababa",
      orders: 12,
      totalSpent: "ETB 45,890",
      lastPurchase: "Yesterday",
      status: "Active",
    },
    {
      id: "cust_004",
      name: "Selam Hailu",
      email: "selam.h@example.com",
      phone: "+251 944 678 901",
      address: "Lideta Sub-city, Woreda 5, Mexico Area, Addis Ababa",
      orders: 3,
      totalSpent: "ETB 8,500",
      lastPurchase: "2 weeks ago",
      status: "Active",
    },
    {
      id: "cust_005",
      name: "Bereket Girma",
      email: "bereket@example.com",
      phone: "+251 955 789 012",
      address: "Addis Ketema Sub-city, Woreda 7, Merkato Area, Addis Ababa",
      orders: 7,
      totalSpent: "ETB 21,350",
      lastPurchase: "3 days ago",
      status: "Active",
    },
    {
      id: "cust_006",
      name: "Kidist Mulugeta",
      email: "kidist.m@example.com",
      phone: "+251 966 890 123",
      address: "Yeka Sub-city, Woreda 4, CMC Area, Addis Ababa",
      orders: 1,
      totalSpent: "ETB 4,300",
      lastPurchase: "1 month ago",
      status: "Inactive",
    },
    {
      id: "cust_007",
      name: "Henok Tadesse",
      email: "henok@example.com",
      phone: "+251 977 901 234",
      address: "Gulele Sub-city, Woreda 2, Addis Ababa",
      orders: 9,
      totalSpent: "ETB 37,850",
      lastPurchase: "5 days ago",
      status: "Active",
    },
    {
      id: "cust_008",
      name: "Rahel Mengistu",
      email: "rahel.m@example.com",
      phone: "+251 988 012 345",
      address: "Nifas Silk-Lafto Sub-city, Woreda 9, Addis Ababa",
      orders: 4,
      totalSpent: "ETB 12,780",
      lastPurchase: "2 weeks ago",
      status: "Active",
    },
  ]
  
  // Email templates
  export const emailTemplates = [
    {
      id: "template_001",
      name: "Order Confirmation",
      description: "Sent automatically when a customer places an order",
      subject: "Your Order #{{order_id}} has been confirmed",
      isDefault: true,
      lastEdit: "3 weeks ago",
    },
    {
      id: "template_002",
      name: "Shipping Confirmation",
      description: "Sent when an order is shipped",
      subject: "Your Order #{{order_id}} has been shipped",
      isDefault: true,
      lastEdit: "3 weeks ago",
    },
    {
      id: "template_003",
      name: "Order Delivered",
      description: "Sent when an order is marked as delivered",
      subject: "Your Order #{{order_id}} has been delivered",
      isDefault: true,
      lastEdit: "3 weeks ago",
    },
    {
      id: "template_004",
      name: "Abandoned Cart",
      description: "Reminder for customers who abandoned their shopping cart",
      subject: "Complete your purchase at {{store_name}}",
      isDefault: false,
      lastEdit: "1 week ago",
    },
    {
      id: "template_005",
      name: "Welcome Email",
      description: "Sent to new customers after registration",
      subject: "Welcome to {{store_name}}",
      isDefault: false,
      lastEdit: "2 weeks ago",
    },
    {
      id: "template_006",
      name: "Return Confirmation",
      description: "Sent when a return request is approved",
      subject: "Your Return Request for Order #{{order_id}} has been approved",
      isDefault: true,
      lastEdit: "3 weeks ago",
    },
  ]
  
  // Return requests
  export const returnRequests = [
    {
      id: "return_001",
      orderId: "#ORD-7240",
      customer: "Yared Tesfaye",
      email: "yared.tesfaye@example.com",
      date: "2 days ago",
      status: "Pending",
      reason: "Item damaged during shipping",
      items: [{ product: "Premium Headphones", quantity: 1, price: "ETB 3,499.99" }],
    },
    {
      id: "return_002",
      orderId: "#ORD-7235",
      customer: "Meron Tadesse",
      email: "meron.t@example.com",
      date: "5 days ago",
      status: "Approved",
      reason: "Wrong item received",
      items: [{ product: "Phone Case", quantity: 1, price: "ETB 699.99" }],
    },
    {
      id: "return_003",
      orderId: "#ORD-7225",
      customer: "Dawit Alemu",
      email: "dawit@example.com",
      date: "1 week ago",
      status: "Completed",
      reason: "Changed mind",
      items: [{ product: "Bluetooth Speaker", quantity: 1, price: "ETB 1,699.99" }],
    },
    {
      id: "return_004",
      orderId: "#ORD-7220",
      customer: "Selam Hailu",
      email: "selam.h@example.com",
      date: "2 weeks ago",
      status: "Rejected",
      reason: "Return window expired",
      items: [{ product: "Smart Watch", quantity: 1, price: "ETB 4,299.99" }],
    },
  ]
  
  export const isMerchantVerified = () => {
    return false
  }
  
  export const fileUploadService = {
    uploadFile: async (file: File) => {
      // Simulate an upload process
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real app, this would be the URL returned by your file hosting service
          resolve({
            success: true,
            url: `https://file-storage.example.com/${file.name}`,
            filename: file.name,
            size: file.size,
            type: file.type,
          })
        }, 1500)
      })
    },
  }
  