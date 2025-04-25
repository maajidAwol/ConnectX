import { Mail } from "lucide-react"

interface EmailTemplatePreviewProps {
  template: any
  templateContent: string
}

export function EmailTemplatePreview({ template, templateContent }: EmailTemplatePreviewProps) {
  const replacePlaceholders = (text: string) => {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, placeholder) => {
      // Replace placeholders with example values
      const replacements: Record<string, string> = {
        customer_name: "Yared Tesfaye",
        order_id: "ORD-7245",
        order_date: "March 15, 2024",
        order_total: "ETB 4,799.99",
        store_name: "Your Store",
      }
      return replacements[placeholder] || match
    })
  }

  return (
    <div className="rounded-md border">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{replacePlaceholders(template?.subject || "")}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          From: Your Store &lt;no-reply@yourstoreethiopia.com&gt;
        </div>
        <div className="text-sm text-muted-foreground">To: customer@example.com</div>
      </div>
      <div className="p-6 bg-white">
        <div
          dangerouslySetInnerHTML={{
            __html: replacePlaceholders(templateContent),
          }}
        />
      </div>
    </div>
  )
}
