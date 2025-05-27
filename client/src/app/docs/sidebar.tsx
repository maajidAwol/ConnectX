import { SidebarNav } from "./components/sidebar-nav"

const items = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
      },
      {
        title: "Authentication",
        href: "/docs/authentication",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        title: "Products",
        href: "/docs/products/overview",
      },
      {
        title: "Orders",
        href: "/docs/orders/overview",
      },
      {
        title: "Payments",
        href: "/docs/payments/overview",
      },
      {
        title: "Tenants",
        href: "/docs/tenants/overview",
      },
    ],
  },
]

export function Sidebar() {
  return <SidebarNav items={items} />
} 