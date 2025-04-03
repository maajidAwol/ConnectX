import { DeveloperLayoutWrapper } from "@/components/developer/layout-wrapper"

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DeveloperLayoutWrapper>{children}</DeveloperLayoutWrapper>
} 