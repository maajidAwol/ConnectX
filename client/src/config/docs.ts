import type { SidebarNavItem } from "@/types/nav"

export const docsConfig: { sidebarNav: SidebarNavItem[] } = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/quickstart/introduction",
        },
        {
          title: "Installation",
          href: "/docs/quickstart/installation",
        },
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "Overview",
          href: "/docs/authentication/overview",
        },
        {
          title: "Login",
          href: "/docs/authentication/login",
        },
        {
          title: "Register",
          href: "/docs/authentication/register",
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "Overview",
          href: "/docs/users/overview",
        },
      
      ],
    },
    {
      title: "Product APIs",
      items: [
        {
          title: "Overview",
          href: "/docs/products/overview",
        },
       
      ],
    },
    {
      title: "Categories",
      items: [
        {
          title: "Overview",
          href: "/docs/categories/overview",
        },
       
      ],
    },
    {
      title: "Order APIs",
      items: [
        {
          title: "Overview",
          href: "/docs/orders/overview",
        },
       
      ],
    },
    {
      title: "Payment Integration",
      items: [
        {
          title: "Overview",
          href: "/docs/payments/overview",
        },
        {
          title: "Chapa Integration",
          href: "/docs/payments/chapa",
        },
        {
          title: "Cash on Delivery",
          href: "/docs/payments/cod",
        },
      ],
    },
    {
      title: "Shipping Management",
      items: [
        {
          title: "Overview",
          href: "/docs/shipping/overview",
        },
       
      ],
    },
    {
      title: "Reviews",
      items: [
        {
          title: "Overview",
          href: "/docs/reviews/overview",
        },
       
      ],
    },
    {
      title: "Tenant Management",
      items: [
        {
          title: "Overview",
          href: "/docs/tenants/overview",
        },
       
      ],
    },
    {
      title: "Error Handling",
      items: [
        {
          title: "Overview",
          href: "/docs/api/errors",
        },
      ],
    },
  ],
}
