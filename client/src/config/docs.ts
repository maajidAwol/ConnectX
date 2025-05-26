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
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "Authentication",
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
          title: "Users",
          href: "/docs/users/overview",
        },
      ],
    },
    {
      title: "Product APIs",
      items: [
        {
          title: "Products",
          href: "/docs/products/overview",
        },
      ],
    },
    {
      title: "Categories",
      items: [
        {
          title: "Categories",
          href: "/docs/categories/overview",
        },
      ],
    },
    {
      title: "Order APIs",
      items: [
        {
          title: "Orders",
          href: "/docs/orders/overview",
        },
      ],
    },
    {
      title: "Payment Integration",
      items: [
        {
          title: "Payments",
          href: "/docs/payments/overview",
        },
        {
          title: "Chapa Integration",
          href: "/docs/payments/chapa",
        },
      ],
    },
    {
      title: "Shipping Management",
      items: [
        {
          title: "Shipping",
          href: "/docs/shipping/overview",
        },
      ],
    },
    {
      title: "Reviews",
      items: [
        {
          title: "Reviews",
          href: "/docs/reviews/overview",
        },
      ],
    },
  ],
}
