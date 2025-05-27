export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  items?: NavItem[]
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[]
}
